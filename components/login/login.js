// components/login/login.js
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
    showLogin: {
      type: Boolean,
      value: false
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
        this.triggerEvent('confirm', e.detail)
      }
    },
    clickCancel: function () {
      this.triggerEvent('cancel', {}) // 只会触发 pageEventListener2
    }
  }
})
