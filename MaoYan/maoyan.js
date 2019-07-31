const Axios = require('axios')
const fs = require('fs')
const path = require('path')

const GROUP_END = 10

async function getOnePage(url) {

  try {
    let headers = {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.162 Safari/537.36'
    }
    let response = await Axios.get(url, { headers })

    if(response.status === 200) {
      return response.data
    }
    return
  } catch (error) {
    return
  }
}

function parseOnePage(html) {
  let re = /<dd>(?:\s.*?)*board-index.*?>(\d+)<\/i>(?:\s.*?)*data-src="(.*?)"(?:\s.*?)*name"><a.*?>(.*?)<\/a><\/p>\s*?<p class="star">\s*?(.*?)\s*?<\/p>(?:\s.*?)*releasetime">(.*?)<\/p>(?:\s.*?)*integer">(.*?)<\/i>.*?fraction">(.*?)<\/i>/g
 
  let arr = []
  let item
  while (item = re.exec(html)) {
    item.splice(0 ,1)
    arr.push({
      'index': item[0],
      'image': item[1],
      'title': item[2],
      'actor': item[3],
      'time': item[4],
      'score': item[5] + item[6]
    })
  }
  return arr
}

async function writeToFile(content) {
  return new Promise((response, reject) => {
    fs.appendFile('./MaoYan/result.txt', JSON.stringify(content) + '\n', (err) => {
      if(err)  return reject()
      response()
    })
  })
}

async function main(offset) {
  let url = `http://maoyan.com/board/4?offset=${offset}`
  let html = await getOnePage(url)

  for(let item of parseOnePage(html)) {
    await writeToFile(item)
  }
}

let groups = []

for(let i = 0; i < GROUP_END; i++){
  groups.push(i*10)
}

groups.forEach(offset => {
  main(offset)
})    

