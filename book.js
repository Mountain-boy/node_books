const {getId} = require('./global') 
class HomeIndex {
  constructor($) {
    this.$ = $
  }
  getHot() {
    console.log('开始爬取热门数据')
    this.$('#hotcontent .item').each((i, item) => {
      let $eleItem = this.$(item)
      let hotItem = {
        id: getId($eleItem.find('.image a').attr('href')),
        author: $eleItem.find('dt span').text(),
        name: $eleItem.find('dt a').text(),
        description: $eleItem.find('dd').text(),
        img: $eleItem.find('.image img').attr('src'),
        isHot: true,
        isNew: false,
      }
      // console.log(hotItem)
    })
  }
  getNew() {
    console.log('开始爬取最近更新数据')
    this.$('#newscontent .l li').each((i, item) => {
      let $eleItem = this.$(item)
      let newItem = {
        id: getId($eleItem.find('.s2 a').attr('href')),
        author: $eleItem.find('.s4').text(),
        name: $eleItem.find('.s2 a').text(),
        description: '',
        updateTime: $eleItem.find('.s5').text(),
        img: '',
        tag: $eleItem.find('.s1').text(),
        newUpdate: true,
        isHot: false,
        isNew: true,
      }
      console.log(newItem)
    })
    this.$('#newscontent .r li').each((i, item) => {
      let $eleItem = this.$(item)
      let newItem = {
        id: getId($eleItem.find('.s2 a').attr('href')),
        tag: $eleItem.find('.s1').text(),
        name: $eleItem.find('.s2 a').text(),
        author: $eleItem.find('.s5').text(),
        isHot: false,
        isNew: true,
      }
      console.log(newItem)
    })
  }
  getList() {
    console.log('开始获取列表数据')
    this.$('.nav li').each((i,item) => {
      let $eleItem = this.$(item)
      let listItem = {
        url: $eleItem.find('a').attr('href'),
        name: $eleItem.find('a').text()
      }
      console.log(listItem)
    })
  }
}
module.exports = HomeIndex