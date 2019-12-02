// components/login/login.js
let app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    loginConf: {
      type: Object,
      value: {
        title: '提示',
        content: '该小程序需要登录使用',
        cancelText: '取消',
        confirmText: '登录',
        loadingText: 123
      }
    },
    showModal: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGotUserInfo: function (e) {
      if (!e.detail.userInfo) {
        wx.showToast({ title: "为了您更好的体验,请先同意授权", icon: 'none', duration: 2000 })
        return
      } else {
        console.log(e.detail)
        app.globalData.userInfo = e.detail.userInfo
        app.globalData.hasUserInfo = true
        let udata = {
          uiv: e.detail.iv,
          uencryptedData: e.detail.encryptedData,
          sessionKey: app.globalData.session_key
        }
        app.http.post("focus.decodeUnionId", udata).then((res2) => {
          if (res2.status && res2.status == 1) {
            res2.data = JSON.parse(res2.data)
            app.globalData.unionId = res2.data.data[0].unionId
            app.globalData.openId = res2.data.data[0].openId
            wx.setStorageSync('unionId', res2.data.data[0].unionId)
            wx.setStorageSync('openId', res2.data.data[0].openId)
            app.updateUserInfo(() => {
              app.http.post("focus.publicParams", {}).then((res) => {
                if (res.code == 200) {
                  // res.data.userInfo = 20
                  // res.data.userId = '2570600122532098'
                  console.log(res, '公共参数')
                  wx.setStorageSync('publicParams', res.data)
                  app.globalData.publicParams = res.data
                  app.globalData.userId = res.data.userId
                  wx.setStorageSync('userId', res.data.userId)
                  app.globalData.unionId = res.data.unionId
                  wx.setStorageSync('unionId', res.data.unionId)
                  app.globalData.cardCode = res.data.code
                  app.globalData.cardId = res.data.cardId
                  app.globalData.createCardData = {
                    encrypt_card_id: decodeURIComponent(res.data.encryptCardId),
                    outer_str: res.data.outer_str,
                    biz: decodeURIComponent(res.data.biz)
                  }
                  if (res.data.userInfo) {
                    wx.setStorageSync('step', res.data.userInfo)
                    app.globalData.step = res.data.userInfo
                  }
                  this.triggerEvent('confirm', {
                    openId: app.globalData.openId,
                    unionId: app.globalData.unionId
                  })
                }
              })
            })
          } else {
            wx.showToast({
              title: '登录失败，请重试！',
              icon: 'none',
              duration: 1500,
              mask: false
            });
          }
        }).catch(err => {
          console.log(err.status, err.message)
        })
      }
    },
    clickCancel: function () {
      this.triggerEvent('close', {}) // 只会触发 pageEventListener2
    }
  }
})
