//index.js
//获取应用实例
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    phone: '',
    page: '',
    pageMine: '',
    cardId: '',
    cardDetailId: '',
    activeSelect: '',
    id: '',
    qytype: ''
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      page: options.page ? options.page: '',
      cardId: options.cardId,
      cardDetailId: options.cardDetailId,
      pageMine: options.pageMine ? options.pageMine: '',
      activeSelect: options.activeSelect ? options.activeSelect : '',
      id: options.id ? options.id : '',
      qytype: options.qytype ? options.qytype: ''
    })
    // app.globalData.id = options.id
    // wx.setStorageSync('id', options.id)
    // app.globalData.qytype = options.qytype
    // wx.setStorageSync('qytype', options.qytype)
  },
  goPage() {
    wx.navigateTo({
      url: '/pages/bind-other/bind-other?cardId=' + this.data.cardId + '&cardDetailId=' + this.data.cardDetailId + '&page=' + this.data.page + '&pageMine=' + this.data.pageMine + '&activeSelect=' + this.data.activeSelect + '&id=' + this.data.id + '&qytype=' + this.data.qytype
    })
  },
  getPhoneNumberSuccess: function(e) { 
    // if (this.data.page) {
    //   wx.navigateTo({
    //     url: '/pages/code-detail/code-detail?cardId=' + this.data.cardId + '&cardDetailId=' + this.data.cardDetailId + '&page=' + this.data.page + '&activeSelect=' + this.data.activeSelect + '&id=' + this.data.id + '&qytype=' + this.data.qytype
    //   })
    // } 
    // if (this.data.pageMine == 'mine') {
    //   wx.switchTab({
    //     url: '/pages/mine/mine'
    //   })
    // }
    let that = this
    if (e.detail.errMsg != 'getPhoneNumber:ok') { // 获取失败
      wx.showToast({
        title: '获取手机号失败，请重试！',
        icon: 'none',
        duration: 1500,
        mask: false
      });
      return false
    }
    wx.showLoading({
      title: '',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    let udata = {
      iv: e.detail.iv,
      encryptedData: e.detail.encryptedData,
      sessionKey: app.globalData.session_key
    }
    app.http.post("focus.decodeWechatPhone", udata).then((res)=>{
      wx.hideLoading()
      if (res.code && res.code == 200) {
        wx.showToast({
          title: '绑定成功',
          icon: 'none',
          duration: 1500,
          mask: false
        });
        app.globalData.bindPhone = true
        wx.setStorageSync('bindPhone', true)
        app.globalData.phone = res.data
        wx.setStorageSync('phone', res.data)
        let data = {
          phone: res.data,
          loginType: '10',
          unionId: app.globalData.unionId
        }
        app.http.post("focus.leyeBindingPhone", data).then((res) => {
          if (res.code == 200) {
            let data = JSON.parse(res.data)
            app.globalData.userId = data.userId
            if (that.data.page) {
              wx.navigateTo({
                url: '/pages/code-detail/code-detail?cardId=' + that.data.cardId + '&cardDetailId=' + that.data.cardDetailId + '&page=' + that.data.page + '&activeSelect=' + this.data.activeSelect + '&id=' + this.data.id + '&qytype=' + this.data.qytype
              })
            } else if (that.data.pageMine == 'mine') {
              wx.switchTab({
                url: '/pages/mine/mine'
              })
            } else {
              if (data.step == 30) {
                wx.navigateTo({
                  url: '/pages/apply-company/apply-company'
                })
              } else {
                wx.switchTab({
                  url: '/pages/index/index'
                })
              }
            }
            
          }
        })
        // setTimeout(() => {
        //   this.backPage(1)
        // }, 1500)
      } else {
        wx.showToast({
          title: '绑定失败，请重试！',
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