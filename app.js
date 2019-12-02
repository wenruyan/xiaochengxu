//app.js
import { checkLogin, getRunData, getWxUserInfo} from './utils/wxCommon.js'
import regeneratorRuntime from './libs/regenerator-runtime/runtime'; // 使用
import { common } from './utils/common.js'
import { checkUpdate } from './utils/checkUpdate.js' // 检测更新的方法
import { config } from './config'  // 全局配置信息
import dayjs from './libs/dayjs.js'
import { fly  } from './utils/http.js'

App({
  onLaunch: function (options) {
    wx.hideTabBar();
    checkUpdate()
    if (config.env == 'dev') { // 测试/开发环境
      wx.setEnableDebug({ // 开启调试模式
        enableDebug: true
      })
    }
    this.globalData.openId = wx.getStorageSync("openId")
    this.globalData.session_key = wx.getStorageSync("sessionKey")
    this.globalData.bindPhone = wx.getStorageSync("bindPhone") || ''
    this.globalData.unionId = wx.getStorageSync("unionId") || ''
    this.globalData.userInfo = wx.getStorageSync("userInfo") || {}
    this.globalData.publicParams = wx.getStorageSync("publicParams") || {}
    this.globalData.userId = wx.getStorageSync("userId") || ''
    this.globalData.phone = wx.getStorageSync("phone") || ''
    this.globalData.check = wx.getStorageSync("check") || ''
    this.getSystemInfo();
    checkLogin()
    wx.hideTabBar();
  },
  onShow: async function (options) {
    const that = this
    console.log('小程序显示参数', options)
    if (options.query.scene) {
      // 请求，拿id
      // let str = await that.getStrFromRemote(options.query.scene);
      // 拿到三个id的对象
      // let obj = JSON.parse(str);
      // console.log(obj, 'str88888888')
      // that.globalData.sharePage = obj.page
      // that.globalData.detailId = obj.shareId
      // that.globalData.detailType = obj.shareType
      // that.globalData.detailSkuid = obj.shareSkuid
      // that.globalData.detailIndex = obj.shareIndex
    }
    if (options.referrerInfo && options.referrerInfo.appId == 'wxeb490c6f9b154ef9') {
      console.log('从开卡组件返回')
      if (options.referrerInfo.extraData && typeof options.referrerInfo.extraData == 'object') {
        console.log('从开卡组件返回,并且成功开卡了')
        let cardData = options.referrerInfo.extraData
        that.globalData.cardId = cardData.card_id
        that.globalData.cardCode = cardData.code
        wx.showLoading()
        // 开始请求后台接口
        let param = {
          code: cardData.code,
          activate_ticket: cardData.activate_ticket
        }
        that.http.post("focus.saveCodeAndActivateCard", param).then((res)=>{
          if (res.code && res.code == 200) {
            wx.hideLoading()
            that.pageFunc.toCard()
          } else {
            wx.hideLoading()
            wx.showToast({
              icon: 'none',
              title: '卡券绑定失败'
            })
          }
        }).catch(err=>{
          console.log(err.status,err.message)
        })
      } else {
        console.log('未激活直接左滑/点返回键返回，或者用户已经激活')
      }
    }
    if (options.sharedOpenId) this.globalData.sharedOpenId = options.sharedOpenId
    // if (options.referrerInfo.extraData && options.referrerInfo.extraData.goodsId && options.referrerInfo.extraData.unionId) {
    //   console.log(options.referrerInfo.extraData)
    //   this.globalData.unionId = options.referrerInfo.extraData.unionId
    //   this.globalData.goodsId = options.referrerInfo.extraData.goodsId
    //   wx.setStorageSync("unionId", options.referrerInfo.extraData.unionId)
    // } else if (options.referrerInfo.extraData && options.referrerInfo.extraData.unionId) {
    //   this.globalData.unionId = options.referrerInfo.extraData.unionId
    //   wx.setStorageSync("unionId", options.referrerInfo.extraData.unionId)
    //   console.log(options.referrerInfo.extraData)
    // } else {
    //   this.globalData.unionId = wx.getStorageSync("unionId") || ''

    // }
    wx.hideTabBar();
  },
  pageFunc: { // 封装调用wx页面跳转的方法
    goPage: function (event, query) { // 保留当前页面，跳转到应用内的某个页面。但是不能跳到 tabbar 页面
      let pageName
      if (typeof event == 'object' && event.currentTarget.dataset.page) { // 点击事件触发，元素可将页面名称绑定在data-page上
        pageName = event.currentTarget.dataset.page
      } else if (typeof event == 'string') { // 直接传入pageName
        pageName = event
      } else {
        return false
      }
      wx.navigateTo({ url: '/pages/' + pageName + '/' + pageName })
    },
    replacePage: function (event) { // 关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面。
      let pageName
      if (typeof event == 'object' && event.currentTarget.dataset.page) { // 点击事件触发，元素可将页面名称绑定在data-page上
        pageName = event.currentTarget.dataset.page
      } else if (typeof event == 'string') { // 直接传入pageName
        pageName = event
      } else {
        return false
      }
      wx.redirectTo({ url: '/pages/' + pageName + '/' + pageName })
    },
    goTab: function (event) { // 跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      let pageName
      if (typeof event == 'object' && event.currentTarget.dataset.page) { // 点击事件触发，元素可将页面名称绑定在data-page上
        pageName = event.currentTarget.dataset.page
      } else if (typeof event == 'string') { // 直接传入pageName
        pageName = event
      } else {
        return false
      }
      wx.switchTab({ url: '/pages/' + pageName + '/' + pageName })
    },
    backPage: function (event) { // 关闭当前页面，返回上一页面或多级页面
      let pageName
      if (typeof event == 'object' && event.currentTarget.dataset.page) { // 点击事件触发，元素可将页面名称绑定在data-page上
        pageName = event.currentTarget.dataset.page
      } else if (typeof event == 'string' || typeof event == 'number') { // 直接传入pageName
        pageName = event
      } else {
        return false
      }
      wx.navigateBack({
        delta: pageName
      })
    },
    launchPage: function (event) { // 关闭所有页面，打开到应用内的某个页面
      let pageName
      if (typeof event == 'object' && event.currentTarget.dataset.page) { // 点击事件触发，元素可将页面名称绑定在data-page上
        pageName = event.currentTarget.dataset.page
      } else if (typeof event == 'string') { // 直接传入pageName
        pageName = event
      } else {
        return false
      }
      wx.reLaunch({ url: '/pages/' + pageName + '/' + pageName })
    },
    async toCard (val) {
      const app = getApp()
      console.log(app.globalData.cardCode, 'app.globalData.cardCode')
      if (!val) {val = app.globalData.wxCardOpt}
      // app.globalData.wxCardOpt = val
      // app.saveWxCardOpt(val)
      if (app.globalData.cardCode) {
        let result = await app.saveWxCardOpt(val)
        wx.openCard({
          cardList: [{
            cardId: app.globalData.cardId,
            code: app.globalData.cardCode
          }],
          success (res) { 
            console.log('成功打开了卡券',res)
          }
        })
      } else {
        wx.navigateToMiniProgram({
          appId: 'wxeb490c6f9b154ef9', // 固定为此appid，不可改动
          extraData: app.globalData.createCardData,
          success: function(res) {  console.log('成功跳转了', res)  },
          fail: function() {   },
          complete: function() {   }
        })
      }
    }
  },
  saveWxCardOpt (val) {
    console.log(val, 'val');
    let app = getApp()
    return new Promise((resolve, reject) => {
      app.http.post("focus.lykH5KeyValue", {
        isSave: '1',
        key: app.globalData.userId,
        // key: '2570600471265794',
        value: JSON.stringify(val) || ''
      }).then((res)=>{
        resolve(res)
        console.log(res)
      }).catch(err=>{
        reject(err)
      })
    })
  },
  getSystemInfo: function () {
    let t = this;
    wx.getSystemInfo({
      success: function (res) {
        console.log('系统信息', res)
        t.globalData.systemInfo = res;
        t.pageData.statusBarHeight = res.statusBarHeight
        t.globalData.isIphoneX = (res.model.indexOf('iPhone X') > -1  || res.screenHeight == 812) ? true : false
      }
    });
  },
  checkBindPhone (cb) {
    let app = this;
    if (!app.globalData.bindPhone) {
      this.pageFunc.goPage('bind-index')
      return false
    }
    cb && cb()
  },
  checkUserInfo: function(pageEle, cb) {
    let that = pageEle
    let app = this;
    if (typeof app.globalData.userInfo == "object" && app.globalData.userInfo.nickName && app.globalData.unionId) {
      app.globalData.hasUserInfo = true
      pageEle.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
      app.checkBindPhone(cb)
    } else {
      if (app.globalData.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          if (app.globalData.unionId) {
            app.globalData.userInfo = res.userInfo
            app.globalData.hasUserInfo = true
            pageEle.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            app.updateUserInfo(cb) // 更新最新获取的用户信息并判断是否绑定手机号
          } else {
            this.pageFunc.goPage('login')
          }
        }
        app.getWxUserInfo((res) => {
          this.pageFunc.goPage('login')
        })
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            app.globalData.hasUserInfo = true
            pageEle.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
            app.checkBindPhone(cb)
          }
        })
      }
    }
  },
  updateUserInfo (cb) {
    let app = this;
    let param = {
      userJson: JSON.stringify(app.globalData.userInfo)
    }
    app.http.post("focus.leyeLoginAuth", param).then((res)=>{
      if (res.code && res.code == 200) {
        app.globalData.bindPhone = true
        wx.setStorageSync('bindPhone', true)
        wx.setStorageSync('userInfo', app.globalData.userInfo)
        let data = res.data
        try{
          data = JSON.parse(data)
        } catch (err) {
          console.log(err)
          data = res.data
        }
        app.globalData.userId = data.userId
        wx.setStorageSync('userId', data.userId)
        cb && cb()
        
      }
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  },
  // 保存小程序formId接口
  upFormId(id) {
    let app = this;
    let param = {
      formId: id, // formId
    }
    return app.http.post("focus.saveMiniFormId", param).then((res) => {
      return res
    }).catch(err => {
      return err
    })
  },
  // 记录日志
  record(obj, rightId, cb) {
    let app = this;
    // 权益通用
    if (rightId) {
      obj = {
        pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页
        operationType: "10", // 用户操作行为-10:按钮,20:输入
        operationObject: "70", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
        contentNo: rightId, // 内容ID:只有在点击快报和权益的时候才有
        contentType: "20" // 内容类型10-文章,20-虚拟商品SKU,31-个人注册信息,32-公司申请入驻信息,40-订单信息,41-卡包信息,42-url,43-界面跳转
      }
    }
    obj['productNo'] = '10'; // 产品编号-20:乐业卡 10:小程序
    if (app.globalData.userId) {
      obj['userId'] = app.globalData.userId; // 用户id
    }
    obj['hideloading'] = true
    obj['hideError'] = true

    app.http
      .post(
        '/log/focus.sysLogApi', obj
      ).then(res => {
        // this.$dialog.loading.close();
        // cb && cb();
      })
    setTimeout(() => {
      cb && cb();
    }, 50)
  },
  editTabbar: function () {
    let tabbar = this.globalData.tabBar;
    let currentPages = getCurrentPages();
    console.log(currentPages)
    let _this = currentPages[currentPages.length - 1];
    let pagePath = _this.route;
    // (pagePath.indexOf('/') != 0) && (pagePath = '/' + pagePath);
    for (let i in tabbar.list) {
      tabbar.list[i].selected = false;
      (tabbar.list[i].confPath == pagePath) && (tabbar.list[i].selected = true);
      console.log(tabbar.list[i].confPath, pagePath)
    }
    _this.setData({
      tabbar: tabbar
    });
  },
  saveStrToRemote(str) {
    let app = this;
    let param = {
      shareStr: str, // 字符串
      type: '20'
    }
    return app.http.post("focus.getshareStr", param).then((res) => {
      return res
    }).catch(err => {
      return err
    })
  },
  getStrFromRemote(key) {
    let app = this;
    let param = {
      shareStr: key, // 字符串
      type: '10'
    }
    return app.http.post("focus.getshareStr", param).then((res) => {
      return res
    }).catch(err => {
      return err
    })
  },
  // 隐藏手机中间四位
  geTel(tel) {
    var reg = /^(\d{3})\d{4}(\d{4})$/;
    return tel.replace(reg, "$1****$2");
  },
  // 校验手机号
  isPoneAvailable(value) {
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (!myreg.test(value)) {
      return false;
    } else {
      return true;
    }
  },
  globalData: {
    companyNo: '',
    companyLogo: "",
    guid: '',
    unionId:"",
    uiv:"",
    userInfo: {},
    userId: '',
    phone: '',
    check: '',
    staffCheck: '',
    mid: config.mid,
    openId: "",
    packIndex: '-1',
    sharedOpenId: "",
    session_key: "",
    isInterest: "",
    step: "",
    pull: '',
    page: '',
    nickName: '',
    resultData: {},
    publicParams: {},
    staffStaus1: "",
    staffStaus2: "",
    shareId: "",
    shareType: "",
    sharePage: '',
    detailId: '',
    detailType: '',
    detailSkuid: '',
    detailIndex: '',
    shareSkuid: '',
    shareIndex: '',
    userUrl: "",
    activeSelect: "",
    id: '',
    qytype: "",
    tabBar: {
      "borderStyle": "black",
      "color": "#CCCCCC",
      "selectedColor": "#000000",
      "backgroundColor": "#FFFFFF",
      "list": [
        {
          "pagePath": "../index/index",
          "confPath": "pages/index/index",
          "iconPath": "../../images/tabbar/index.png",
          "selectedIconPath": "../../images/tabbar/index-active.png",
          "text": "首页"
        },
        {
          "pagePath": "../mine/mine",
          "confPath": "pages/mine/mine",
          "iconPath": "../../images/tabbar/mine.png",
          "selectedIconPath": "../../images/tabbar/mine-active.png",
          "text": "我的"
        }
      ]
    },
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    env: config.env,
    cardCode: '',
    cardId: '',
    createCardData: {
      encrypt_card_id: "m5Nn9ZhKt4qVSQPhuf1Xzh1oBDCDwpC8pu57ejkw5+7KAwPWz69GTFXse751ZvJn",
      outer_str: "123",
      biz: "MzU1ODkzODcwNA=="
    },
    wxCardOpt: ''
  },
  pageData: {
    statusBarHeight: '',
    env: config.env
  },
  moment: dayjs,
  http: fly,
  checkLogin,
  getWxUserInfo,
  getRunData,
  common
})