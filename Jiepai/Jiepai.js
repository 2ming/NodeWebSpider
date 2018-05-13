const Axios = require('axios')
const fs = require('fs')
const path = require('path')
const crypto = require('crypto')

let keywords = process.argv.slice(2)
if(keywords.length === 0) { keywords =  ['街拍'] }

const GROUP_END = 6

async function getPage(offset, keyword = '街拍') {
  let params = {
    'offset': offset,
    'format': 'json',
    'keyword': keyword,
    'autoload': 'true',
    'count': '20',
    'cur_tab': '3',
    'from': 'gallery',
  }
  let url = 'https://www.toutiao.com/search_content'

  return await Axios.get(url, { params }).then(res => {
    if(res.status === 200) {
      return res.data
    }
    return []
  }).catch(err => {
    return err
  })
}

function getImage(data) {
  let imageList = []
  if(data) {
    data.forEach(item => {
      let title = item.title
      item.image_list.forEach(image => {
        imageList.push({image: image.url, title})
      })
    })
  }
  return imageList
}

async function saveImage(item) {
  let path_file = path.join(__dirname, item.title)
  try {
    fs.accessSync(path_file)
  } catch (error) {
    fs.mkdirSync(path_file)
  }

  let new_image_url = item.image.replace('list','large')
  let response = await Axios.get('http:' + new_image_url,{
    responseType:'stream'
  })

  if (response.status == 200) {
    let hash = crypto.createHash('sha256')
    
    hash.update(response.config.url)

    let file_name = hash.digest('hex')
    let file_path = path.join(__dirname, item.title, file_name + '.jpg')

    try {
      fs.accessSync(file_path)
      console.warning('Already Downloaded', file_path)
    } catch (error) {
      response.data.pipe(fs.createWriteStream(file_path))
    }
  }
}

async function main(offset, keyword) {
  let json = await getPage(offset, keyword)
  getImage(json.data).forEach( async (item) => {
    await saveImage(item)
  })

}

let groups = []

for(let i = 0; i <= GROUP_END; i++){
  groups.push(i*20)
}

keywords.forEach(keyword => {
  groups.forEach(offset => {
    main(offset, keyword)
  })    
})

