"user strict"
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const request = require('superagent');
charset(request);
const {dirExists} = require('../global')
const fs = require('fs')
const https = require('https')
var listId = 9
let index = 0
let arr = []
getListBook(listId)
function getListBook (listId) {
  index = 0
  fs.readFile(`./data/book${listId}.json`, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let bookArr = JSON.parse(data.toString());
      let len = bookArr.length
      getBookItemInfo(index,bookArr,len)
    }
  });
}
function getBookItemInfo (index,bookArr,len) {
  if (index >= len) {
    listId = listId +1
    getListBook(listId)
    return
  }
  arr = []
  let element = bookArr[index];
  request.get(`http://www.biquge.com.tw/${element.id}`).buffer(true).charset('gbk').end(function (err, res) {
    if (err) {
      console.log(err)
    } else {
      let $ = cheerio.load(res.text)
      $('#list a').each((i, item) => {
        let $eleItem = $(item)
        let itemData = {
          title: $eleItem.text(),
          id: $eleItem.attr('href').replace(`/${element.id}/`, '').replace('.html','')
        }
        arr.push(itemData)
        if (i == $('#list a').length -1) {
          writeBooks(element.id, JSON.stringify(arr),bookArr)
        }
      })
    }
  })
}
async function writeBooks (id,msg, bookArr) {
  await dirExists(`./books/${listId}`)
  fs.writeFile(`./books/${listId}/${id}.json`, msg, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`写入单本数据成功  --/books/${id}.json--`);
      index = index + 1
      getBookItemInfo(index,bookArr,bookArr.length)
    }
  });
}
/**
 * 下载图片
 * @param {*请求图片地址} url 
 * @param {*保存图片名称} name 
 */
let updataImg = (url, name) => {
  //先访问图片
  https.get(url, (res) => {
    //用来存储图片二进制编码
    let imgData = '';
    //设置图片编码格式
    res.setEncoding("binary");
    //检测请求的数据
    res.on('data', (chunk) => {
      imgData += chunk;
    })
    //请求完成执行的回调
    res.on('end', () => {
      // 通过文件流操作保存图片
      fs.writeFile(`./image/${name}.jpg`, imgData, 'binary', (error) => {
        if (error) {
          console.log('下载失败');
        } else {
          console.log('下载成功！')
        }
      })
    })
  })
}
