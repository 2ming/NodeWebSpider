### 验证码识别

有几个问题：
- Callback must be a function

``` bash
# 解决方法： https://github.com/desmondmorris/node-tesseract/issues/57
TypeError [ERR_INVALID_CALLBACK]: Callback must be a function
    at makeCallback (fs.js:132:11)
    at Object.fs.unlink (fs.js:1002:14)
    at /Users/ming/code/NodeWebSpider/node_modules/.0.2.7@node-tesseract/lib/tesseract.js:99:14
    at FSReqWrap.readFileAfterClose [as oncomplete] (fs.js:408:3)

Before:
fs.unlink(files[0]);
Now:
fs.unlink(files[0], err => { if (err) console.log(err) });
```

- gm
  > 由于 安装了 imageMagick， 所以如果直接用gm 会报错， 要改变一下

``` javascript
  let imageMagick = gm.subClass({imageMagick: true})
```