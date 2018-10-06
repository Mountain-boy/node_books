"user strict"
const cheerio = require('cheerio');
const charset = require('superagent-charset');
const request = require('superagent');
charset(request);
const { dirExists } = require('../../global')
const fs = require('fs')
let listId = 0
let chapterIndex = 0
let fileIndex = 3
let filesLength = 0
let dataLength = 0

goOnOneFile(listId)

function goOnOneFile (listId) {
  let files = getFileList(`../books/${listId}/`)
  filesLength = files.length
  fs.readFile(`${files[fileIndex].path}${files[fileIndex].filename}`,(err,res) => {
    let data = JSON.parse(res.toString())
    dataLength = data.length
    // goOnOneChapter(data,chapterIndex,files[fileIndex].filename)
    getOneChapter(`${files[fileIndex].filename.replace('.json','')}`, data[chapterIndex].id)
  })
}

function getOneChapter (id, chapterId) {
  request.get(`http://www.biquge.com.tw/${id}/${chapterId}.html`).buffer(true).charset('gbk').end(function (err, res) {
    // console.log(res.text)  
    let $ = cheerio.load(res.text)
    let msg = $('#content').text()
    writeChapterFile(id,chapterId,msg)
  })
}

async function writeChapterFile (filename,chapterId,msg) {
  await dirExists(`./${listId}/${filename}`)
  fs.writeFile(`./${listId}/${filename}/${chapterId}.txt`, msg, (err, res) => {
    if (err) {
      console.log(err)
    } else {
      console.log(`单章节小说写入成功，写入地址为:${listId}/${filename}/${chapterId}.txt`)
      chapterIndex = chapterIndex + 1
      if (chapterIndex == dataLength) { // 当前小说没有新的章节 切换为下一本小说
        chapterIndex = 0
        fileIndex = fileIndex + 1
        if (fileIndex == filesLength) { // 当前文件没有下一本小说切换为下一个文件夹
          chapterIndex = 0
          fileIndex = 0
          listId = listId + 1
          goOnOneFile(listId)
          return
        }
        goOnOneFile(listId)
        return
      }
      goOnOneFile(listId)
    }
  })
}

function getFileList (path) {
  var filesList = [];
  readFileList(path, filesList);
  return filesList;
}

function readFileList(path, filesList) {
  var files = fs.readdirSync(path);
  files.forEach(function (itm, index) {
    var stat = fs.statSync(path + itm);
    if (stat.isDirectory()) {
      //递归读取文件
      readFileList(path + itm + "/", filesList)
    } else {
      var obj = {};//定义一个对象存放文件的路径和名字
      obj.path = path;//路径
      obj.filename = itm//名字
      filesList.push(obj);
    }
  })
}