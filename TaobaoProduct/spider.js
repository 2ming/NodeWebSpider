const puppeteer = require('puppeteer')
const MongoClient = require('mongodb').MongoClient;
const $config = require('./config.js')
const mongodb_url = `${$config.MONGO_URL}/${$config.MONGO_DB}`
let Collection
let Client

async function indexPage(browser, page, num) {
  console.log('正在爬取第', num, '页')

  if (num > 1) {
    let input = await page.$('#mainsrp-pager div.form > input')
    let submit = await page.$('#mainsrp-pager div.form > span.btn.J_Submit')
    input.value = num
    submit.click()
    await page.waitFor(1 * 1000)
  }
  await getProducts(browser, page)
}

async function getProducts(browser, page) {
  let products = await page.evaluate(async () => {
    let items = document.querySelectorAll('#mainsrp-itemlist .items .item')
    return Array.prototype.slice.apply(items).map(item => {
      return {
        'image': item.querySelector('.pic .img').dataset['src'],
        'price': item.querySelector('.price').innerText,
        'deal': item.querySelector('.deal-cnt').innerText,
        'title': item.querySelector('.title').innerText,
        'shop': item.querySelector('.shop').innerText,
        'location': item.querySelector('.location').innerText
      }
    })
  })
  await saveToMongo(products, page)
}

async function saveToMongo(products, page) {
  await Collection.insertMany(products, (err, res) => {
    if (err) throw err
    console.log('====插入',res.insertedCount,'条数据====')
    if(page === 100) Client.close()
  })
}

async function main() {
  await MongoClient.connect(mongodb_url, async(err, client) => {
    if (err) throw err
    const db = client.db($config.MONGO_DB)
    Collection = db.collection($config.MONGO_COLLECTION)
    Client = client
  })

  let url = `https://s.taobao.com/search?q=${$config.KEYWORD}`
  const browser = await puppeteer.launch({headless: false})
  const page = await browser.newPage()
  page.goto(url)
  await page.waitFor(3 * 1000)

  for(let i = 1; i <= $config.MAX_PAGE; i++) {
    await indexPage(browser, page, i)
  }
}

main()