let fs = require('fs')
let tesseract = require('node-tesseract');
const gm = require('gm')

const image = require('path').resolve(__dirname, 'code.jpg');
let test_image = require('path').resolve(__dirname, 'code_1.jpg');

processImg(image, test_image)
  .then(text => {
    console.log(`识别结果:${text}`);
  })
  .catch((err) => {
    console.error(`识别失败:${err}`);
  });

function processImg(imgPath, newPath, thresholdVal) {
  return new Promise((resolve, reject) => {
    let imageMagick = gm.subClass({imageMagick: true})
    imageMagick(imgPath)
      .despeckle()
      .contrast(-6)
      .write(newPath, err => {
        if (err) {
          reject(err);
        } else {
          tesseract.process(newPath, {l: 'eng', psm: 7, binary: 'tesseract'}, (err, data) => {
            if (err) {
              reject(err)
            } else {
              resolve(data.trim())
            }
          });
        }
      });
  });
}