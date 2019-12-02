// components/navbar.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    title: {
      type: String,
      value: ''
    },
    page: {
      type: String,
      value: ''
    },
    canBack: {
      type: Boolean,
      value: true
    },
    fontSize: {
      type: String,
      value: '36rpx'
    },
    fontColor: {
      type: String,
      value: '#333333'
    },
    bgColor: {
      type: String,
      value: '#FFF'
    },
    bgOp: {
      type: Number,
      value: 1
    },
    goPage: {
      type: Number,
      value: 1
    },
    border: {
      type: Boolean,
      value: true
    },
    leftBtnStyle: {
      type: String,
      value: 'black' //返回按钮的颜色，可以是white/black
    },
    leftBtnText: {
      type: String,
      value: ''
    },
    toPagePath: {
      type: String,
      value: '' // 跳转的页面路径
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    statusBarHeight: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    goBack: function () {
      console.log(getCurrentPages().length)
      console.log(this.data.title)
      console.log(this.data.page)
      let that = this
      let i = this.data.goPage
      if (this.data.title == '订单详情') {
        //步步抽跳转过来
        if (getCurrentPages().length == 2) {
          console.log(222)
          wx.navigateBack({
            delta: 1
          })
        }else if (getCurrentPages().length == 1) {
          wx.switchTab({
            url: '../index/index',
            success: function (e) {
              console.log('123', e)
            },
            fail: function (e) {
              console.log(2222, e)
            }
          })
        } else if (getCurrentPages().length == 3) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.navigateBack({
            delta: i
          })
        }

      } else if (this.data.title == '商品详情') {
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            console.log(2222, e)
          }
        })
      } else if (this.data.title == '推送列表') {
        console.log('liebia')
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            console.log(2222, e)
          }
        })
      } else if (this.data.title == '我的福利') {
        console.log('liebia')
        wx.switchTab({
          url: '../mine/mine',
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            console.log(2222, e)
          }
        })
      } else if (this.data.toPagePath) {
        console.log('跳转到其他页面')
        wx.navigateTo({
          url: '../' + that.data.toPagePath + '/' + that.data.toPagePath,
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            // 跳转失败，使用switchTab跳转
            wx.switchTab({
              url: '../' + that.data.toPagePath + '/' + that.data.toPagePath,
              success: function (e) {
                console.log('123', e)
              },
              fail: function (e) {
                console.log(2222, e)
              }
            })
          }
        })
      } else if (this.data.page == 'code-detail') {
        wx.navigateTo({
          url: '/pages/my-welfare/my-welfare?activeSelect=' + app.globalData.activeSelect
        })
      } else if (this.data.page == '领取详情') {
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            console.log(2222, e)
          }
        })
      } else if (this.data.page == 'details') {
        wx.navigateTo({
          url: '/pages/get-details/get-details?id=' + app.globalData.id + '&qytype=' + app.globalData.qytype
        })
      } else if (this.data.page == 'index') {
        wx.switchTab({
          url: '../index/index',
          success: function (e) {
            console.log('123', e)
          },
          fail: function (e) {
            console.log(2222, e)
          }
        })
      } else {
        console.log(`返回上${i}页`)
        wx.navigateBack({
          delta: i
        })
      }

    }
  },

  ready: function () {
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          statusBarHeight: res.statusBarHeight
        })
        // console.log('statusBarHeight', res.statusBarHeight)
      }
    })
  },

})