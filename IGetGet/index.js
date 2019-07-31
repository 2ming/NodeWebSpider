const puppeteer = require('puppeteer')
const MongoClient = require('mongodb').MongoClient;
const $config = require('./config.js')
const Mitm = require("mitm")
const https = require('https')
//const mongodb_url = `${$config.MONGO_URL}/${$config.MONGO_DB}`
let mitm = Mitm()
let Collection
let Client

function getBooks(url) {
  mitm.on("request", function(req, res) {
    res.statusCode = 402
    res.send()

  })
  
  https.get(url, function(res) {
    res.setEncoding("utf8")
    res.statusCode // => 402
    res.on("data", console.log) // => "Pay up, sugar!"
  })
}

async function main() {
  // await MongoClient.connect(mongodb_url, async(err, client) => {
  //   if (err) throw err
  //   const db = client.db($config.MONGO_DB)
  //   Collection = db.collection($config.MONGO_COLLECTION)
  //   Client = client
  // })

  let url = 'https://i.weread.qq.com/market/category?categoryId=701&synckey=0&count=20&maxIdx=0'

  getBooks(url)
}

main()