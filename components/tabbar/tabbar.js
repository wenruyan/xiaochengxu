// tabBarComponent/tabBar.js
const app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tabbar: {
      type: Object,
      value: {
        "backgroundColor": "#ffffff",
        "color": "#CCCCCC",
        "selectedColor": "#396EFF",
        "list": [
          {
            "pagePath": "../index/index",
            "iconPath": "../../images/tabbar/index.png",
            "selectedIconPath": "../../images/tabbar/index-active.png",
            "text": "首页"
          },
          // {
          //   "pagePath": "page/myRelease/index",
          //   "iconPath": "icon/icon_release.png",
          //   "isSpecial": true,
          //   "text": "发布"
          // },
          {
            "pagePath": "",
            "iconPath": "../../images/tabbar/shop.png",
            "selectedIconPath": "../../images/tabbar/shop.png",
            "isSpecial": true,
            "funcName": 'showTipsConfirm',
            "text": "步步抽"
          },
          {
            "pagePath": "../mine/mine",
            "iconPath": "../../images/tabbar/my.png",
            "selectedIconPath": "../../images/tabbar/my.png",
            "text": "我的"
          }
        ]
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    isIphoneX: (app.globalData.systemInfo.model.indexOf('iPhone X') > -1  || app.globalData.systemInfo.screenHeight == 812) ? true : false,
    tipsConfirm: false
  },

  /**
   * 组件的方法列表
   */
  methods: {
    showTipsConfirm: function () {
      this.setData({
        tipsConfirm: true
      })
    },
    closeTipsConfirm: function () {
      this.setData({
        tipsConfirm: false
      })
    },
    stopMove: function () {
      
    },
    getsuccess(){
      console.log(22332)
    }
  }
})
