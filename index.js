"user strict"
// const Home = require('./book');
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const request = require('superagent');
const fs = require('fs')
charset(request);
let listId = 0; // 类别id
let bookId = 1; // 小说id
// request.get('http://www.biquge.com.tw/').charset('gbk').end(function (err, res) {
  // if (err) return err
  // let $ = cheerio.load(res.text)
  // let HomeIndex = new Home($)
  // HomeIndex.getHot()
  // HomeIndex.getNew()
  // HomeIndex.getList()
// })

function getBookId (listId, bookId) { // 便利存入小说id
  if (listId === 20) return
  request.get(`http://www.biquge.com.tw/${listId}_${bookId}`).buffer(true).charset('gbk').end(function (err, res) {
    if (err) {
      console.log(`爬取错误，错误码：${err.status}`)
      if (err.status == 404) {
        setTimeout(() => {
          if (bookId <= (listId+1) * 1000) {
            bookId = bookId + 1
            getBookId(listId, bookId)
          } else {
            bookId = (listId+1) * 1000
            listId = listId + 1
            getBookId(listId, bookId)
          }
          console.log(`重置请求参数，重置后参数为：listId: ${listId},bookId:${bookId}`)
          let msg = `错误id${listId}_${bookId}----${err}\n`
          fs.appendFile(`./errLog${listId}.txt`, msg, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log(`写入错误日志成功  --/errLog${listId}.txt--`);
            }
          });
        }, Math.floor(Math.random()*1000))
        return
      } else {
        let msg = `错误id${listId}_${bookId}----${err}\n`
        fs.appendFile(`./errLog${listId}.txt`, msg, (err) => {
          if (err) {
            console.log(err);
          } else {
            console.log(`写入错误日志成功  --/errLog${listId}.txt--`);
          }
        });
        getBookId(listId, ++bookId)
      }
    }
    let $ = cheerio.load(res.text)
    let bookItem = {
      id: `${listId}_${bookId}`,
      name: $('#info h1').text(),
      author: $('#info p:nth-of-type(1)').text(),
      lastUpdateTime: $('#info p:nth-of-type(3)').text(),
      lastUpdateChapter: $('#info p:nth-of-type(4) a').text(),
      lastUpdateChapterId: $('#info p:nth-of-type(4) a').attr('href').replace(/.html/, ''),
      intro: $('#intro p').text()
    }
    fs.appendFile(`./book${listId}.json`, JSON.stringify(bookItem)+',', (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log(`小说数据写入成功,小说id: ${listId}_${bookId}`);
      }
    });
    // console.log($('body').text())
    setTimeout(() => {
      getBookId(listId, ++bookId)
    }, Math.floor(Math.random()*1000))
  })
}
getBookId(listId, bookId)
