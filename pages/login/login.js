//index.js
//获取应用实例
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null
  },
  onLoad: function(options) {
    let that = this
  },
  getUserInfoSuccess: function(e) {
    console.log('获取用户信息成功', e)
    let that = this
    if (!e.detail.userInfo) { // 获取失败
      wx.showToast({
        title: '授权失败',
        icon: 'none',
        duration: 1500,
        mask: false
      });
      return false
    }
    app.globalData.userInfo = e.detail.userInfo
    app.globalData.hasUserInfo = true
    this.setData({
      userInfo: e.detail.userInfo
    })

    let udata = {
      uiv: e.detail.iv,
      uencryptedData: e.detail.encryptedData,
      sessionKey: app.globalData.session_key
    }
    app.http.post("focus.decodeUnionId", udata).then((res)=>{
      if (res.status && res.status == 1) {
        res.data = JSON.parse(res.data)
        app.globalData.unionId = res.data.data[0].unionId
        app.globalData.openId = res.data.data[0].openId
        this.setData({
          unionId: res.data.data[0].unionId,
          openId: res.data.data[0].openId
        })
        wx.setStorageSync('unionId', res.data.data[0].unionId)
        wx.setStorageSync('openId', res.data.data[0].openId)
        app.updateUserInfo(() => {
          that.backPage(1)
        })
      } else {
        wx.showToast({
          title: '登录失败，请重试！',
          icon: 'none',
          duration: 1500,
          mask: false
        });
      }
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  }
})