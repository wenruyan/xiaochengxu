// pages/mine/mine.js
const app = getApp()
import {
  $stopWuxRefresher
} from '../../libs/wux/index'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  /**
   * 页面的初始数据
   */
  data: {
    tabbar: {},
    list:[
      {
        image: '../../images/gift.png',
        title: '我的福利',
        show: true
      },
      {
        image: '../../images/order.png',
        title: '我的订单',
        show: true
      },
      {
        image: '../../images/gear.png',
        title: '企业福利设置',
        show: false
      },
      {
        image: '../../images/dialogue.png',
        title: '联系客服',
        show: true
      }
    ],
    step: "",
    userUrl: "",
    companyLogo: "",
    phone: "",
    nickName: "",
    loginModal: false,
    role: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // app.globalData.step = 10
    app.editTabbar();
    wx.hideTabBar();
    this.setData({
      step: app.globalData.step,
      userUrl: app.globalData.userUrl,
      companyLogo: app.globalData.companyLogo ? app.globalData.companyLogo : '',
      phone: app.globalData.phone ? app.geTel(app.globalData.phone) : '',
      nickName: app.globalData.nickName ? app.globalData.nickName: ''
    })
  },
  /**
    * 生命周期函数--监听页面显示
    */
  onShow: function () {
    this.getPublicParams(() => {
      this.getUserInfoList()
    })
  },
  // 公共参数
  getPublicParams(cb) {
    let data = {}
    app.http.post("focus.publicParams", data).then((res) => {
      if (res.code == 200) {
        // res.data.userInfo = 10
        // res.data.role = 10
        console.log(res, '公共参数')
        wx.setStorageSync('publicParams', res.data)
        app.globalData.publicParams = res.data
        app.globalData.userId = res.data.userId
        wx.setStorageSync('userId', res.data.userId)
        app.globalData.unionId = res.data.unionId
        wx.setStorageSync('unionId', res.data.unionId)
        app.globalData.cardCode = res.data.code
        app.globalData.cardId = res.data.cardId
        if (res.data.userInfo) {
          wx.setStorageSync('step', res.data.userInfo)
          app.globalData.step = res.data.userInfo
        }
        this.setData({
          step: app.globalData.step,
          role: res.data.role
        })
        if (res.data.role == 10) {
          this.data.list[2].show = true
          this.setData({
            list: this.data.list
          })
        }
        app.globalData.createCardData = {
          encrypt_card_id: decodeURIComponent(res.data.encryptCardId),
          outer_str: res.data.outer_str,
          biz: decodeURIComponent(res.data.biz)
        }
        
        cb && cb()
      }
    })
  },
  // 用户个人数据
  getUserInfoList() {
    let data = {
      userId: app.globalData.userId
    }
    app.http.post("focus.selfInfo", data).then((res) => {
      if (res.code == 200) {
        var data = res.data
        app.globalData.check = data.instate
        wx.setStorageSync('check', data.instate)
        app.globalData.staffCheck = data.verifystatus
        wx.setStorageSync('staffCheck', data.verifystatus)
        app.globalData.nickName = data.name
        wx.setStorageSync('nickName', data.name)
        app.globalData.companyNo = data.companyNo
        wx.setStorageSync('companyNo', data.companyNo)
        app.globalData.companyLogo = data.companyLogo
        wx.setStorageSync('companyLogo', data.companyLogo)
        app.globalData.phone = data.phone
        wx.setStorageSync('phone', data.phone)
        app.globalData.userUrl = data.userUrl
        wx.setStorageSync('userUrl', data.userUrl)
        this.setData({
          userUrl: res.data.userUrl,
          companyLogo: app.globalData.companyLogo ? app.globalData.companyLogo : '',
          phone: app.globalData.phone ? app.geTel(app.globalData.phone) : '',
          nickName: app.globalData.nickName ? app.globalData.nickName : ''
        })
      }
    })
  },
  login() {
    this.setData({
      loginModal: true
    })
  },
  closeLoginModal() {
    this.setData({
      loginModal: false
    })
  },
  getUserInfoSuccess: function (e) {
    console.log('获取用户信息成功', e)
    this.setData({
      loginModal: false
    })

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
    app.http.post("focus.decodeUnionId", udata).then((res) => {
      if (res.status && res.status == 1) {
        res.data = JSON.parse(res.data)
        console.log(res.data, 'res')
        app.globalData.unionId = res.data.data[0].unionId
        app.globalData.openId = res.data.data[0].openId
        this.setData({
          unionId: res.data.data[0].unionId,
          openId: res.data.data[0].openId
        })
        wx.setStorageSync('unionId', res.data.data[0].unionId)
        wx.setStorageSync('openId', res.data.data[0].openId)
        app.updateUserInfo(() => {
          this.onShow()
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
  },
  bindPhone() {
    wx.navigateTo({
      url: '/pages/bind-index/bind-index?pageMine=' + 'mine'
    })
  },
  goPage(e) {
    console.log(e)
    if (app.globalData.step == 10) {
      this.setData({
        loginModal: true
      })
    } else {
      let index = e.currentTarget.dataset.index
      if (index == 0) {
        //跳转福利包
        wx.navigateTo({
          url: '/pages/my-welfare/my-welfare'
        })
      }
      if (index == 1) {
        //跳转我的订单
        wx.navigateTo({
          url: '/pages/my-order/my-order'
        })
      }
      if (index == 2) {
        //跳转企业福利
        wx.navigateTo({
          url: `/pages/box-list/box-list`
        })
      }
    }
    
    
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})