import { fly  } from './http.js'
const checkLogin = (cb) => {
  let openId = wx.getStorageSync("openId")
  if (openId) {
    wx.checkSession({
      success: function (res) {
        console.log('session_key 未失效', res)
        cb && cb()
        // getRunData()
        //session_key 未过期，并且在本生命周期一直有效
      },
      fail: function () {
        // session_key 已经失效，需要重新执行登录流程
        console.log('session_key 失效')
        login(cb)
      }
    })
  } else {
    login(cb)
  }
}
const getWxUserInfo = (cb) => {
  wx.getSetting({
    success: res => {
      if (res.authSetting['scope.userInfo']) {
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        wx.getUserInfo({
          success: res => {
            console.log(res,2222)
            // 可以将 res 发送给后台解码出 unionId
            getApp().globalData.userInfo = res.userInfo
            getApp().globalData.hasUserInfo = true
            getApp().globalData.uiv = res.iv
            getApp().globalData.encryptedData = res.encryptedData
            console.log(getApp().globalData.encryptedData)
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (getApp().userInfoReadyCallback) {
              getApp().userInfoReadyCallback(res)
            }
          }
        })
      } else {
        typeof cb == 'function' && cb()
      }
    }
  })
}
const login = (cb) => {
  wx.login({
    success: function (res) {
      if (res.code) {
        console.log('本地成功获取code，请求后台', res)
        //发起网络请求
        getApp().http.post('focus.login', {
          js_code: res.code,
          mid: getApp().globalData.mid
        }).then((res)=>{
          console.log('上传code返回数据', res.data)
          getApp().globalData.openId = res.data.openid
          getApp().globalData.session_key = res.data.session_key
          wx.setStorageSync("openId", res.data.openid)
          wx.setStorageSync("sessionKey", res.data.session_key)
          cb && cb()
        }).catch(err=>{
          console.log(err.status,err.message)
        })
      } else {
        wx.showToast({
          title: '登录失败！' + res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    }
  });
}

const getRunData = (cb) => {
  wx.authorize({
    scope: 'scope.werun',
    success() {
      console.log('授权成功')
      wx.getWeRunData({
        success(res) {
          const encryptedData = res.encryptedData
          console.log('将密文传给后台')
          typeof cb == "function" && cb(res)
        }
      })
    },
    fail(res) {
      console.log('授权失败', res)
      wx.showModal({
        title: '提示',
        content: '需要授予获取微信运动数据的权限才能使用该小程序',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            wx.openSetting({
              success: (res) => {
                getRunData(cb)
              }
            })
          } else if (res.cancel) {
            console.log('用户点击取消')
            getRunData(cb)
          }
        }
      })
    }
  })
}


module.exports = {
  checkLogin,
  getRunData,
  getWxUserInfo
}
