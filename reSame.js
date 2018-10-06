"user strict"
const fs = require('fs')
const path = require('path')
const {dirExists} = require('./global')
var listId = 0

function rmSame (listId){
  fs.readFile(`./book${listId}.json`, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let bookArr = JSON.parse(data.toString())
      var hash = {};
      let coppyArr = []
      coppyArr = bookArr.reduce(function(item, next) { 
          hash[next.id] ? '' : hash[next.id] = true && item.push(next); 
          return item 
      }, [])
      goOnBooks(bookArr, coppyArr)
      console.log(bookArr.length,coppyArr.length)
    }
  });
}
rmSame(listId)
async function goOnBooks (bookArr, coppyArr) {
  await dirExists(`./books/data`);
  await dirExists(`./books/logs`);
  if (bookArr.length == coppyArr.length) {
    fs.rename(`./book${listId}.json`,`books/data/book${listId}.json`,(err) => {
      if (err) {
        console.log(err)
        return
      }
      console.log('移动文件成功')
    })
    listId = listId + 1
    if (listId === 21) return
    rmSame(listId)
  } else {
    fs.writeFile(`./books/data/book${listId}.json`, JSON.stringify(coppyArr), (err) => {
      if (err) {
        console.log(err);
      } else {
        let msg = `去除重复数据成功，原数据长度为:${bookArr.length}新写入数据长度为${coppyArr.length}`
        fs.writeFile(`./books/logs/${listId}log.txt`, msg, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`写入日志成功  --/${listId}log.txt--`);
          }
        });
        console.log(msg);
      }
    });
  }
}
