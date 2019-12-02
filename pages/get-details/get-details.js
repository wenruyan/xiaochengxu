//index.js
//获取应用实例
const app = getApp()
// import { $stopWuxRefresher } from '../../libs/wux/index'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    scrollTop: 0,
    navBgColor: '#fff',
    marginRight: '18',
    leftBtn: 'white-bg',
    bgColor: '#F8F8F8',
    navTitle: '',
    showContent: true,
    showContent1: true,
    codeModal: false,
    id: '',
    skuId: '',
    qytype: '',
    status: '',
    loginModal: false,
    noModal: false,
    listData: [],
    topPicture: '',
    loading: false,
    is_first_action: false,
    noPhoneModal: false,
    noCompanyModal: false,
    modalShareShow: false,
    pageImage: '',
    pageTitle: '',
    pageContent: '',
    num: '',
    index: '',
    item: "",
    cardid: "",
    carddetailid: ""
  },
  onLoad: function (options) {
    // app.globalData.step = 10
    console.log(options, '111')
    console.log(app.globalData.step)
    this.setData({
      id: options.id ? options.id : '',
      qytype: options.qytype ? options.qytype : ''
    })
    app.globalData.shareId = options.id
    wx.setStorageSync('shareId', options.id)
    app.globalData.shareType = options.qytype
    wx.setStorageSync('shareType', options.qytype)
  },
  onShow: function (options) {
    this.getListData()
    this.setData({
      is_first_action: true,
      codeModal: false
    })
  },
  getListData() {
    let udata = {
      id: this.data.id,
      qytype: this.data.qytype
    }
    app.http.post("focus.qyDetail", udata).then((res) => {
      if (res.code == 200) {
        var data = res.data.rows
        data.map((item, index) => {
          item.description = item.description.split(',')
        })
        let arr = data[0].qyimage
        arr.map((item, index) => {
          if (item.pictype == 30) {
            this.setData({
              topPicture: item.url,
              pageImage: item.url
            })
            wx.setStorageSync("pageImage", item.url);
          }
        })
        this.setData({
          listData: data,
          pageTitle: data[0].title,
          pageContent: data[0].itemTitle,
          skuId: data[0].skuList ? data[0].skuList[0].skuid : '',
          status: data[0].getNum > 0 ? 10 : 20,
          cardid: data[0].cardPackageId ? data[0].cardPackageId: '',
          carddetailid: data[0].cardPackageDetailId ? data[0].cardPackageDetailId: ''
        })
        // if(this.data.status == 10) {
        //   this.setData({
        //     cardid: data[0].cardPackageId,
        //     carddetailid: data[0].cardPackageDetailId
        //   })
        // }
      }
    })
  },
  // 立即领取
  pullDown(e) {
    console.log(e)
    console.log(app.globalData.unionId)
    if (e) {
      if (e.detail.formId) {
        app.upFormId(e.detail.formId)
      }
    }
    console.log(app.globalData.step)
    //判断未登录
    if (app.globalData.step == 10) {
      this.setData({
        loginModal: true,
        item: e.detail.target.dataset.item
      })
    }
    else {
      app.record(
        {
          pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
          operationType: "10", // 用户操作行为-10:按钮,20:输入,30:页面进入
          operationObject: "19", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,19-实际领取,21-去卡包
          contentNo: this.data.id, // 内容ID:只有在点击快报和权益的时候才有
          contentType: this.data.qytype == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
        }
      )
      let udata;
      if (this.data.qytype == 11) {
        udata = {
          id: this.data.id
        }
      } else {
        udata = {
          skuId: this.data.skuId
        }
      }
      
      if (this.data.is_first_action == true) {
        this.setData({
          is_first_action: false
        })
        app.http.post("focus.nowGet", udata).then((res) => {
          if (res.code == 200) {
            console.log("========", res.data)
            this.setData({
              status: 10,
              loading: false,
              codeModal: true,
              cardid: res.data.cardPackageId,
              carddetailid: res.data.cardPackageDetailId
            })
            this.getListData()
          }
          if (res.code == 205) {
            wx.showToast({
              title: '库存不足',
              icon: 'none',
              duration: 1500,
              mask: false
            });
          }
          if (res.code == 207) {
            wx.showToast({
              title: '当月已领取',
              icon: 'none',
              duration: 1500,
              mask: false
            });
          }
          if (res.code == 400) {
            wx.showToast({
              title: '请不要重复领取',
              icon: 'none',
              duration: 1500,
              mask: false
            });
          }
        })
      }
      
    }
  },
  // 显示分享模态框
  showShareModal() {
    app.globalData.page = 'details'
    wx.setStorageSync('page', 'details')
    console.log(11111111)
    let animation = wx.createAnimation({
      // 动画持续时间
      duration: 200,
      // 定义动画效果，当前是匀速
      timingFunction: 'linear'
    })
    // 先在y轴偏移，然后用step()完成一个动画
    animation.translate('-50%', 150).step();
    this.setData({
      modalShareShow: true,
      floatUp: animation.export()
    })
    // 设置setTimeout来改变y轴偏移量，实现有感觉的滑动
    setTimeout(() => {
      animation.translate('-50%', 0).step();
      this.setData({
        floatUp: animation.export()
      })
    }, 0)
  },
  onShareAppMessage: function (res) {
    console.log(this.data.num)
    console.log(66666666)
    this.setData({
      modalShareShow: false
    })
    return {
      title: app.globalData.nickName + '邀您一起领' + this.data.pageTitle,
      // path: '/pages/get-details/get-details?shared = true&id=' + this.data.id + '&qytype=' + this.data.qytype + '&status=' + this.data.status + '&skuId=' + this.data.skuId,
      path: '/pages/index/index?shared=true&id=' + this.data.id + '&qytype=' + this.data.qytype,
      imageUrl: this.data.topPicture
    }
  },
  getUserInfoSuccess: function (e) {
    console.log(111111111)
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
          // app.pageFunc.replacePage('bind-index')
          let data = {}
          app.http.post("focus.publicParams", data).then((res) => {
            if (res.code == 200) {
              wx.setStorageSync('step', res.data.userInfo)
              app.globalData.step = res.data.userInfo
              app.globalData.userId = res.data.userId
              wx.setStorageSync('userId', res.data.userId)
              this.pullDown()
              this.setData({
                loginModal: false,
                codeModal: true
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
  },
  closeModal() {
    this.setData({
      codeModal: false
    })
  },
  closeLoginModal() {
    this.setData({
      loginModal: false
    })
  },
  closeLoginModal1() {
    this.setData({
      noPhoneModal: false
    })
  },
  closeLoginModal2() {
    this.setData({
      noCompanyModal: false
    })
  },
  confirm() {
    this.setData({
      noModal: false
    })
  },
  closeLoginModal() {
    this.setData({
      loginModal: false
    })
  },
  // 去使用
  goUse(e) {
    console.log("========", e)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    app.record(
      {
        pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
        operationType: "10", // 用户操作行为-10:按钮,20:输入,30:页面进入
        operationObject: "21", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,19-实际领取,21-去卡包
        contentNo: this.data.id, // 内容ID:只有在点击快报和权益的时候才有
        contentType: this.data.qytype == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
      }
    )
    let bindData = this.data.item ? this.data.item : e.detail.target.dataset
    console.log("=-==========", this.data.qytype, this.data.cardid, this.data.carddetailid)
    if (this.data.qytype == 10) { // 优惠券
      if (bindData.discountscope == 10) { // 全场
        this.toCard({
          optType: '3'
        })
      } else { // 非全场，跳转到适用商品页
        wx.navigateTo({
          url: '/pages/discount/discount?id=' + bindData.id
        })
      }
    } else if (this.data.qytype == 11) { // 已领取，去使用状态
      wx.navigateTo({
        url: '/pages/link-detail/link-detail?cardId=' + this.data.cardid + '&cardDetailId=' + this.data.carddetailid
      })
    } else if (this.data.qytype == 40) { // 已领取，去使用状态
      if (app.globalData.step == 20) {
        wx.navigateTo({
          url: '/pages/bind-index/bind-index?cardId=' + this.data.cardid + '&cardDetailId=' + this.data.carddetailid + "&page=" + 'details' + "&id=" + this.data.id + "&qytype=" + this.data.qytype
        })
      } else {
        wx.navigateTo({
          url: '/pages/code-detail/code-detail?cardId=' + this.data.cardid + '&cardDetailId=' + this.data.carddetailid
        })
      }
      
    }
    // let data = {
    //   userId: app.globalData.userId,
    //   qyType: this.data.qytype
    // };
    // if (this.data.qytype == 11) {
    //   data.qyId = this.data.id
    // } else {
    //   data.qyId = this.data.skuId
    // }
    // console.log(data)
    // app.http.post("focus.toUseSaveData", data).then((res) => {
    //   if (res.code == 200) {
    // this.toCard()
    this.setData({
      codeModal: false
      //   })
      // }
    })
  },
  // 监听滚动
  bindscroll: function (e) {
    console.log(e)
    console.log(111111)
    if (e.detail.scrollTop >= 50) {
      this.setData({
        navBgColor: '#000',
        navOpcity: 1,
        leftBtn: 'black',
        navTitle: '领取权益'
      })
    } else {
      this.setData({
        navBgColor: '#fff',
        navOpcity: 0,
        leftBtn: 'white-bg',
        navTitle: ''
      })
    }
  },
  onPageScroll: function (e) {
    console.log(e)

  },
  onPulling() {
    console.log('onPulling')
  },
  onRefresh() {
    console.log('onRefresh')
    setTimeout(() => {
      this.onShow()
      $stopWuxRefresher()
    }, 2000)
  },
  onHide() {
    console.log(5555555555555)
    // if (app.globalData.pull == 'isPull') {
    //   app.globalData.pull = 'noPull'
    // }
  },
  onPullDownRefresh() {
    setTimeout(() => {
      this.onShow()
    }, 2000)
    // wx.stopPullDownRefresh()
  }
})