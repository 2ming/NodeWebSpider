const Tesseract = require('tesseract.js')
const myImage = require('path').resolve(__dirname, 'code.jpg');

Tesseract.recognize(myImage)
  .then(data => {
    console.log('then\n', data.text)
  })
  .catch(err => {
    console.log('catch\n', err);
  })
  .finally(e => {
    console.log('finally\n');
    process.exit();
  });