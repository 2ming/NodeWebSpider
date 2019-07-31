const excelToJson = require("convert-excel-to-json");
const glob = require('glob-all')
const fs = require('fs')

const outputFiles = process.argv[2]
async function writeToFile(content, path) {
  return new Promise((response, reject) => {
    fs.appendFile(path, JSON.stringify(content), (err) => {
      if(err)  return reject()
      response()
    })
  })
}

function main() {
  console.log(process.argv)
  let fileName = process.argv[2] ? `${process.argv[2]}*/xls*` : './Excel/*.xls*'
  glob.sync(fileName).forEach(async path => {

    let outputFile = path.split('.xls')
    let content = excelToJson({
      sourceFile: path,
      header:{
          rows: 1
      },
      columnToKey: {
        '*': '{{columnHeader}}'
      },
      // columnToKey: {
      //   'A': '{{A1}}',
      //   'B': '{{B1}}'
      // }
      // sheets:[{
      //   name: 'sheet1',
      //   columnToKey: {
      //     A: 'id',
      //     B: 'ProductName'
      //   }
      // },{
      //     name: 'sheet2',
      //     columnToKey: {
      //       A: 'id',
      //       B: 'ProductDescription'
      //     }
      // }]
    })
    for(let key in content) {
      
      await writeToFile(content[key], `${outputFile[0]}_${key}.json`)
    }

  }) 
}
main()