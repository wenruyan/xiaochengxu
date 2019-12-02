//index.js
//获取应用实例
const app = getApp()

Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    marginTop: '',
    motto: 'Hello World',
    userInfo: {},
    showTabbar: false,
    tabbar: {},
    inputNameValue: '',
    inputAddressValue: '',
    inputPhoneValue: '',
    region: ['', '', ''],
    setDefault: false,
    sendSuccess: false,
    sendDefault: true
  },
  onLoad: function (options) {
    if (options.end) {
      this.setData({
        sendSuccess: false,
        sendDefault: true
      })
    } else {
      this.setData({
        sendSuccess: true,
        sendDefault: false
      })
    }
  },
})