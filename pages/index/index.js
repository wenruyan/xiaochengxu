//index.js
//获取应用实例
const app = getApp()
import {
  $stopWuxRefresher
} from '../../libs/wux/index'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    scrollTop: 0,
    navBgColor: '#fff',
    marginRight: '18',
    showContent: true,
    showContent1: true,
    noCheck: false,
    waitCheck: false,
    codeModal: true,
    noModal: false,
    showModal: false,
    loginModal: false,
    showGif: false,
    statusFurl: true,
    noStatusFurl: false,
    jingangModal: false,
    showIndex: false,
    isInterest: '',
    greetings: '',
    skuId: '',
    id: '',
    type: '',
    subtitle: "",
    title: '',
    listData: [],
    listLength: 0,
    weflareList: [],
    weflareName: '',
    weflareNum: '',
    otherWeflareList: [],
    just: true,
    userList: [],
    listData1: [],
    step: '',
    packIndex: '',
    index: '',
    arrIndex: [],
    staffCheck: '',
    check: '',
    userId: '',
    pull: 'noPull',
    status: 'is',
    canScroll: true,
    canRefresh: true,
    lastScrollTop: 0,
    scrollTop: 0,
    topPicture: '',
    name: '',
    companyLogo: '',
    companyName: '',
    loading: false,
    showsCard: false,
    is_first_action: false,
    noPhoneModal: false,
    noCompanyModal: false,
    modalShareShow: false,
    openingId: "",
    activityId: "",
    tabbar: {},
    optionId: '',
    optionStatus: '',
    index: '',
    num: '',
    optionIndex: '',
    giftModal: false,
    giftName: "",
    comboId: '1',
    userPushRecordId: '2',
    showRoleHr: false,
    recivedGift: false,
    giftList: [],
    newBox: true,
    qyTitle: '',
    userUrl: '',
    instate: '',
    verifyStatus: ''
  },
  onLoad: async function (options) {
    app.editTabbar();
    wx.hideTabBar();
    this.setData({
      staffCheck: app.globalData.staffCheck,
      check: app.globalData.check
    })
    console.log('小程序分享');
    console.log(options)
    // 小程序链接分享
    if (options.shared) {
      console.log('分享进来');
      console.log(options)
      if (app.globalData.openId) {
        this.getPublicParams(() => {
          wx.navigateTo({
            url: '/pages/get-details/get-details?id=' + options.id + '&qytype=' + options.qytype
          })
        })
      } else {
        app.checkLogin(() => {
          this.getPublicParams(() => {
            wx.navigateTo({
              url: '/pages/get-details/get-details?id=' + options.id + '&qytype=' + options.qytype
            })
          })
        })
      }
    }
    if (options.from == 'mp') { // 从小程序进入
      function toNextFunc(options) {
        if(options.to == 'awardList') { // 前往奖品列表
          wx.redirectTo({
            url: '/pages/my-welfare/my-welfare?fromAward=true'
          })
        } else if (options.to == 'address') {
          let nDate = new Date()
          if (nDate.getTime() > 1570809600000) { // 2019年10月11日以后，无法进入发货页面
            wx.redirectTo({
              url: '/pages/send-success/send-success?end=true'
            })
          } else {
            wx.redirectTo({
              url: '/pages/address/address'
            })
          }
        }
      }
      if (app.globalData.openId) {
        this.getPublicParams(() => {
          toNextFunc(options)
        })
      } else {
        app.checkLogin(() => {
          this.getPublicParams(() => {
            toNextFunc(options)
          })
        })
      }
      return
    }
    // 扫描二维码进来
    if (options.scene) {
      let str = await app.getStrFromRemote(options.scene);
      // 拿到三个id的对象
      try {
        let obj = JSON.parse(str.data.param);
        if (obj.page == 'details') {
          if (app.globalData.openId) {
            this.getPublicParams(() => {
              wx.navigateTo({
                url: '/pages/get-details/get-details?id=' + obj.shareId + '&qytype=' + obj.shareType
              })
            })
          } else {
            app.checkLogin(() => {
              this.getPublicParams(() => {
                wx.navigateTo({
                  url: '/pages/get-details/get-details?id=' + obj.shareId + '&qytype=' + obj.shareType
                })
              })
            })
          }
          this.setData({
            showIndex: false
          })
        }
      } catch (err) {
        console.log(err)
      }
    }
  },
  onShow: function (options) {
    console.log('分享图片进来');
    console.log(options)
    if (this.data.lastScrollTop >= 60) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
        animation: {
          duration: 300,
          timingFunc: 'easeIn'
        }
      })
    }
    if (app.globalData.pull) {
      this.setData({
        pull: app.globalData.pull
      })
    }
    if (app.globalData.openId) {
      this.getPublicParams(() => {
        this.getUserInfoList()
        this.getWelfareRightList()
        this.getGoldenRightList()
      })
    } else {
      app.checkLogin(() => {
        this.getPublicParams(() => {
          this.getUserInfoList()
          this.getWelfareRightList()
          this.getGoldenRightList()
        })
      })
    }
    this.setData({
      loginModal: false,
      showModal: false,
      noCompanyModal: false,
      noPhoneModal: false,
      is_first_action: true,
      showGif: false,
      giftModal: false,
      recivedGift: false,
    })
  },
  // 监听滚动
  onPageScroll: function (e) {
    this.setData({
      scrollTop: e.scrollTop
    })
    if (e.scrollTop >= 80) {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#000000'
      })
      this.setData({
        navBgColor: '#000',
        navOpcity: 1
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000'
      })
      this.setData({
        navBgColor: '#fff',
        navOpcity: 0
      })
    }
  },
  // 出现登录弹框
  showLogin() {
    this.setData({
      loginModal: true
    })
  },
  // 公共参数
  getPublicParams(cb) {
    let data = {}
    app.http.post("focus.publicParams", data).then((res) => {
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
          this.setData({
            step: res.data.userInfo,
            userId: res.data.userId ? res.data.userId: ''
          })
        }
        this.setData({
          greetings: res.data.careRemind,
          newBox: res.data.redDot == 'true',
          showRoleHr: res.data.role == '10',//先注释
          giftName: res.data.comboName
        })
        if (res.data.isInitial == 'isInitial') {
          this.setData({
            showIndex: true
          })
        }
        // 显示福利领取提示框
        if (res.data.userRecordId && res.data.comboId) {
          this.giftModal = true;
          this.setData({
            giftModal: true,
            comboId: res.data.comboId,
            userPushRecordId: res.data.userRecordId
          })
        }
        // 偏好设置跳转
        // if (app.globalData.isInterest && app.globalData.isInterest == 'isInterest') {
        //   wx.switchTab({
        //     url: '/pages/index/index'
        //   })
        // } else {
        // }
        if (res.data.isInitial == 'isInitial' && res.data.userInfo == 10) {
          // 微信授权登录
          this.setData({
            showIndex: true
          })
        } 
        else {
          this.setData({
            showIndex: true
          })
        }

      }
      cb && cb()
    })
  },
  // 用户个人数据
  getUserInfoList() {
    let data = {
      userId: app.globalData.userId || this.data.userId ? this.data.userId : ''
    }
    app.http.post("focus.selfInfo", data).then((res) => {
      if (res.code == 200) {
        var data = res.data
        this.setData({
          name: data.name,
          companyName: data.company ? data.company: '',
          companyLogo: data.companyLogo ? data.companyLogo:'',
          userUrl: data.userUrl,
          showsCard: true,
          instate: res.data.instate ? res.data.instate: '',
          verifyStatus: res.data.verifystatus ? res.data.verifystatus:""
        })
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
        if (this.data.step == 40) {                                                                                
          if (data.instate == 10) {
            // 官方审核中
            this.setData({
              waitCheck: true
            })
          }
          if (data.instate == 20) {
            // 官方审核通过
            this.setData({
              waitCheck: false
            })
            if (data.verifystatus == 10) {
              // 企业审核中(员工审核)
              this.setData({
                noCheck: true
              })
            }
            if (data.verifystatus == 30) {
              // 企业审核通过
              this.setData({
                noCheck: false
              })
            }
          }
        }
        if (this.data.step == 30) {
          if (data.instate == 10) {
            // 官方审核中
            this.setData({
              waitCheck: true
            })
          } else {
            this.setData({
              waitCheck: false
            })
          }
          // if (data.instate == 20) {
          //   // 官方审核通过
          //   this.setData({
          //     waitCheck: false
          //   })
          // }
          this.setData({
            noCheck: false
          })
        }
        
      }
    })
  },
  // 加入企业
  joinCompany() {
    console.log(this.data.step)
    if (this.data.step == 30) {
      // 已绑定手机号,跳搜索入驻公司
      wx.navigateTo({
        url: '/pages/apply-company/apply-company'
      })
    }
    if (this.data.step == 20) {
      // 已绑定手机号,跳搜索入驻公司
      wx.navigateTo({
        url: '/pages/bind-index/bind-index'
      })
    } 
    // if (this.data.verifyStatus == 20) {
    //   // 员工审核失败,已绑定手机号,跳搜索入驻公司
    //   wx.navigateTo({
    //     url: '/pages/apply-company/apply-company'
    //   })
    // }
  },
  // 金刚区权益数据
  getGoldenRightList() {
    let data = {}
    app.http.post("focus.goldenRightList", data).then((res) => {
      if (res.code == 200) {
        var data = res.data.rows
        this.setData({
          listData: data
        })
      }
    })
  },
  // 福利区权益数据
  getWelfareRightList(cb) {
    let data = {
    }
    app.http.post("focus.welfareRightList", data).then((res) => {
      if(res.code == 200) {
        var data = res.data.rows
        let ind = 0;
        data.forEach(item => {
          if (item.num) {
            ind++
          }
        });
        console.log(ind, 'ind');
        this.setData({
          listData1: data,
          listLength: ind
        })
        if (res.data.rows.length != 0) {
          this.setData({
            weflareList: this.data.listData1[0].weflareList,
            weflareName: this.data.listData1[0].name,
            weflareNum: this.data.listData1[0].num
          })
        }
        if (this.data.listData1.length > 1) {
          this.data.otherWeflareList = this.data.listData1.slice(1, this.data.listData1.length)
          // this.data.otherWeflareList = this.data.listData1
          this.data.otherWeflareList.map((item) => {
            item.show = 10
          })
          console.log(this.data.arrIndex, '8888888888')
          if (this.data.arrIndex.length > 0) {
            let arr = this.data.arrIndex
            console.log(this.data.pull, 'pull')
            arr.map((item, index) => {
              if (this.data.pull == 'isPull') {
                this.data.otherWeflareList.map((item) => {
                  item.show = 10
                })
                this.setData({
                  arrIndex: []
                })
              }
              if (this.data.pull == 'noPull') {
                this.data.otherWeflareList[item].show = 20
              }
            })
          }
          this.setData({
            otherWeflareList: this.data.otherWeflareList
          })
        }
        console.log(this.data.otherWeflareList, '5555555')
      }

    })
  },
  // 点击金刚区
  clickJingang(e) {
    console.log(e)
      let type = e.currentTarget.dataset.type
      if (type == 10) {
        // 记录
        app.record({
          pageNo: "60", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
          operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
          operationObject: "10", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
          contentNo: e.currentTarget.dataset.qyid, // 内容ID:只有在点击快报和权益的时候才有
          contentType: e.currentTarget.dataset.qytype == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
        })
        wx.navigateTo({
          url: '/pages/get-details/get-details?id=' + e.currentTarget.dataset.qyid + '&qytype=' + e.currentTarget.dataset.qytype
        })
      }
      if (type == 20) {
        wx.navigateTo({
          url: '/pages/voucher-center/voucher-center?id=' + e.currentTarget.dataset.id
        })
      }
      if (type == 30) {
        this.toCard()
      }
      if (type == 40) {
        this.setData({
          jingangModal: true
        })
      }
    // }
  },
  // 显示分享模态框
  showShareModal() {
    console.log(11111111)
    app.globalData.page = 'index'
    wx.setStorageSync('page', 'index')
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
    this.setData({
      modalShareShow: false
    })
    return {
      title: this.data.name + '呼唤大家一起加入乐业卡，一起享用福利',
      path: '/pages/index/index',
      imageUrl: '../../images/normal_share_small.png'
    }
  },
  // 点击卡片
  clickCard() {
    if (this.data.step == 10) {
      this.setData({
        loginModal: true
      })
    }
    if (app.globalData.check == 10 || app.globalData.check == 30 || app.globalData.staffCheck == 10) {
      this.setData({
        noModal: true
      })
    }
    if (app.globalData.staffCheck == 20) {
      wx.navigateTo({
        url: '/pages/apply-company/apply-company'
      })
    }
  },
  closeJingangModal() {
    this.setData({
      jingangModal: false
    })
  },
  confirm() {
    this.setData({
      noModal: false
    })
  },
  clickFurl(e) {
    console.log(e)
    console.log(this.data.is_first_action, 'this.data.is_first_action')
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    //判断未登录
    if (app.globalData.step == 10) {
      this.setData({
        loginModal: true
      })
    } else {
      let udata;
      app.record({
        pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
        operationType: "10", // 用户操作行为-10:按钮,20:输入,30:页面进入
        operationObject: "19", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,19-实际领取,21-去卡包
        contentNo: this.data.id, // 内容ID:只有在点击快报和权益的时候才有
        contentType: this.data.type == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
      })
      // if (this.data.type == 11) {
      //   udata = {
      //     id: this.data.id,
      //     userId: app.globalData.userId
      //   }
      // } else {
      //   udata = {
      //     skuId: this.data.skuId,
      //     userId: app.globalData.userId
      //   }
      // }
      // app.record(
      //   {
      //     pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
      //     operationType: "10", // 用户操作行为-10:按钮,20:输入,30:页面进入
      //     operationObject: "19", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,19-实际领取,21-去卡包
      //     contentNo: this.data.id, // 内容ID:只有在点击快报和权益的时候才有
      //     contentType: this.data.type ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
      //   }
      // )
      if (this.data.type == 11) {
        udata = {
          id: this.data.id,
          userId: app.globalData.userId
        }
      } else {
        udata = {
          skuId: this.data.skuId,
          userId: app.globalData.userId
        }
      }
      if (this.data.is_first_action == true) {
        this.setData({
          is_first_action: false
        })
        app.http.post("focus.nowGet", udata).then((res) => {
          if (res.code == 200) {
            this.setData({
              statusFurl: false,
              noStatusFurl: true,
              showModal: false
            })
            wx.showToast({
              title: '领取福利成功',
              icon: 'none',
              duration: 1500,
              mask: false
            });
            this.onShow()
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
  // 关闭弹框
  closeModal() {
    this.setData({
      showModal: false
    })
    // this.onShow()
  },
  login(e) {
    this.setData({
      loginModal: false
    })
  },
  // 立即领取
  immeGet(e) {
    console.log(e)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
      if (e.detail.target.dataset.week == 1) {
        app.record(
          {
            pageNo: "60", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
            operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
            operationObject: "31", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
            contentNo: e.detail.target.dataset.id, // 内容ID:只有在点击快报和权益的时候才有
            contentType: e.detail.target.dataset.type == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
          }
        )
      }
      if (e.detail.target.dataset.week == 2) {
        app.record(
          {
            pageNo: "60", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
            operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
            operationObject: "32", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
            contentNo: e.currentTarget.dataset.id, // 内容ID:只有在点击快报和权益的时候才有
            contentType: e.currentTarget.dataset.type == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
          }
        )
      }
      this.setData({
      statusFurl: true,
      noStatusFurl: false,
      showModal: true,
      skuId: e.detail.target.dataset.skuid,
      id: e.detail.target.dataset.id,
      type: e.detail.target.dataset.type,
      subtitle: e.detail.target.dataset.subtitle,
      qyTitle: e.detail.target.dataset.qytitle,
      packIndex: e.detail.target.dataset.index,
      topPicture: e.detail.target.dataset.toppicture
    })
  },
  // 去使用
  goUse(e) {
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    app.record(
      {
        pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
        operationType: "10", // 用户操作行为-10:按钮,20:输入,30:页面进入
        operationObject: "21", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,19-实际领取,21-去卡包
        contentNo: e.detail.target.dataset.id, // 内容ID:只有在点击快报和权益的时候才有
        contentType: e.detail.target.dataset.type ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
      }
    )
    console.log(e, '去使用')
    let bindData = e.detail.target.dataset
    if (bindData.type == 10) { // 优惠券
      if(bindData.discountscope == 10) { // 全场
        this.toCard({
          optType: '3'
        })
      } else { // 非全场，跳转到适用商品页
        wx.navigateTo({
          url: '/pages/discount/discount?id=' + bindData.id + '&cardDetailId=' + bindData.carddetailid
        })
      }
    } else if (bindData.type == 11) { // 已领取，去使用状态
      wx.navigateTo({
        url: '/pages/link-detail/link-detail?cardId=' + bindData.cardid + '&cardDetailId=' + bindData.carddetailid
      })
    } else if (bindData.type == 40) { // 已领取，去使用状态
      if (app.globalData.step == 20) {
        console.log(bindData,'bind')
        wx.navigateTo({
          url: '/pages/bind-index/bind-index?cardId=' + bindData.cardid + '&cardDetailId=' + bindData.carddetailid +"&page=" + 'index'
        })
      }  else {
        wx.navigateTo({
          url: '/pages/code-detail/code-detail?cardId=' + bindData.cardid + '&cardDetailId=' + bindData.carddetailid
        })
      }
      
    }
    return false
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
      app.record(
        {
          pageNo: "30", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
          operationType: "10", // 用户操作行为-10:按钮,20:输入,30:页面进入
          operationObject: "21", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,19-实际领取,21-去卡包
          contentNo: e.detail.target.dataset.id, // 内容ID:只有在点击快报和权益的时候才有
          contentType: e.detail.target.dataset.type ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
        }
      )
      this.setData({
        // statusFurl: false,
        // noStatusFurl: true,
        // showModal: true,
        id: e.detail.target.dataset.id,
        skuId: e.detail.target.dataset.skuid,
        type: e.detail.target.dataset.type,
        qyTitle: e.detail.target.dataset.qytitle,
        subtitle: e.detail.target.dataset.subtitle,
        packIndex: e.detail.target.dataset.index,
        status: 'no',
        topPicture: e.detail.target.dataset.toppicture
      })
      let data;
      if (this.data.id) {
        data = {
          userId: app.globalData.userId,
          qyId: this.data.id,
          qyType: this.data.type
        }
      }
      console.log(data)
      app.http.post("focus.toUseSaveData", data).then((res) => {
        if (res.code == 200) {
          this.toCard()
        }
      })
  },
  // 去详情页
  goDetails(e) {
    console.log(e)
    let bindData = e.currentTarget.dataset
    if (bindData.qytype == 10) { // 优惠券
      if(bindData.discountscope == 10) { // 全场
        this.toCard({
          optType: '3'
        })
      } else { // 非全场，跳转到适用商品页
        wx.navigateTo({
          url: '/pages/discount/discount?id=' + bindData.id + '&cardDetailId=' + bindData.carddetailid
        })
      }
      return false
    } else if (bindData.status == 10) { // 已领取，去使用状态
      if (bindData.qytype == 11) { // 文章
        wx.navigateTo({
          url: '/pages/link-detail/link-detail?cardId=' + bindData.cardid + '&cardDetailId=' + bindData.carddetailid
        })
      } else if (bindData.qytype == 40) { // 兑换码
        if (app.globalData.step == 20) {
          console.log(bindData, 'bind')
          wx.navigateTo({
            url: '/pages/bind-index/bind-index?cardId=' + bindData.cardid + '&cardDetailId=' + bindData.carddetailid + "&page=" + 'index'
          })
        } else {
          wx.navigateTo({
            url: '/pages/code-detail/code-detail?cardId=' + bindData.cardid + '&cardDetailId=' + bindData.carddetailid
          })
        }
        
      }
      return false
    }
    if (e.currentTarget.dataset.week == 1) {
      app.record({
        pageNo: "60", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
        operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
        operationObject: "31", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
        contentNo: e.currentTarget.dataset.id, // 内容ID:只有在点击快报和权益的时候才有
        contentType: e.currentTarget.dataset.qytype == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
      })
    }
    if (e.currentTarget.dataset.week == 2) {
      app.record({
        pageNo: "60", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
        operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
        operationObject: "32", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
        contentNo: e.currentTarget.dataset.id, // 内容ID:只有在点击快报和权益的时候才有
        contentType: e.currentTarget.dataset.qytype == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
      })
    }
          wx.navigateTo({
            url: '/pages/get-details/get-details?id=' + e.currentTarget.dataset.id + '&qytype=' + e.currentTarget.dataset.qytype
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
  joinPhone() {
    console.log(111111111)
    wx.navigateTo({
      url: '/pages/bind-index/bind-index'
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
  // 点击展开
  packUp(e) {
    let index = e.currentTarget.dataset.index
    app.globalData.packIndex = index
    wx.setStorageSync('packIndex', index)
    if (e.currentTarget.dataset.kai == 'kai') {
      if (this.data.arrIndex.length > 0) {
        if (this.data.arrIndex.indexOf(index)) {
          this.data.arrIndex.push(app.globalData.packIndex)
          this.setData({
            arrIndex: this.data.arrIndex
          })
        }
      } else {
        this.data.arrIndex.push(app.globalData.packIndex)
        this.setData({
          arrIndex: this.data.arrIndex
        })
      }

    }
    console.log(this.data.arrIndex, 'arrindex')
    this.data.otherWeflareList[index].show = 20
    this.setData({
      otherWeflareList: this.data.otherWeflareList,
      pull: 'noPull'
    })
  },
  // 点击收起
  packUp1(e) {
    let index = e.currentTarget.dataset.index
    app.globalData.packIndex = index
    wx.setStorageSync('packIndex', index)
    if (e.currentTarget.dataset.guan == 'guan') {
      let i = this.data.arrIndex.indexOf(index)
      this.data.arrIndex.splice(i, 1)
      this.setData({
        arrIndex: this.data.arrIndex
      })
    }
    this.data.otherWeflareList[index].show = 10
    this.setData({
      otherWeflareList: this.data.otherWeflareList
    })
  },
  onPulling() {
    console.log('onPulling')
    this.setData({
      canScroll: false
    })
    this.data.pull = 'isPull'
    this.setData({
      pull: this.data.pull
    })
    this.setData({
      showGif: true
    })
  },
  onRefresh() {
    console.log('onRefresh')
    this.onShow()
    setTimeout(() => {
      $stopWuxRefresher()
      this.setData({
        canRefresh: true,
        canScroll: true,
        showGif: false,
        scrollTop: 0
      })
    }, 300)
  },
  onHide() {},
  onReady() {
  },
  onPullDownRefresh() {
    setTimeout(() => {
      this.onShow()
    }, 2000)
  },
  nowScroll(e) {
    clearTimeout(this.data.scrollTimer)
    if (e.detail.scrollTop <= 0) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      this.setData({
        canRefresh: true,
        canScroll: false,
        navBgColor: '#fff',
        navOpcity: 0
      })
    } else if (e.detail.scrollTop <= 60) {
      wx.setNavigationBarColor({
        frontColor: '#ffffff',
        backgroundColor: '#ff0000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      this.setData({
        canRefresh: false,
        canScroll: true,
        navBgColor: '#fff',
        navOpcity: 0
      })
    } else {
      wx.setNavigationBarColor({
        frontColor: '#000000',
        backgroundColor: '#ff0000',
        animation: {
          duration: 400,
          timingFunc: 'easeIn'
        }
      })
      this.setData({
        canRefresh: false,
        canScroll: true,
        navBgColor: '#000',
        navOpcity: 1
      })
    }
    let t = setTimeout(() => {
      console.log('clear')
      this.setData({
        canScroll: true
      })
    }, 200)
    this.setData({
      scrollTimer: t,
      lastScrollTop: e.detail.scrollTop
    })
  },
  reciveGift() {
    wx.showLoading({
        title: '',
        mask: true
      });
    let data = {
      comboId: this.data.comboId,
      userPushRecordId: this.data.userPushRecordId
    }
    app.http.post("focus.fetchComboWelfare", data).then((res) => {
      console.log(res, 'fetchComboWelfare');
    })
    app.http.post("focus.comboDetail", {
      id: this.data.comboId
      // id: '2568466097848577'
    }).then((res) => {
      console.log(res.data.qyList, 'comboDetail');
      wx.hideLoading()
      this.setData({
        giftList: res.data.qyList.concat(res.data.discountList),
        recivedGift: true
      }) 
    })
  },
  useGift() {
    this.getWelfareRightList();
    this.setData({
      giftModal: false
    })
  },
  myCatchTouch() {
    // 阻止小程序滚动穿透问题
    return
  },
  goBoxList() {
    wx.navigateTo({
      url: `/pages/box-list/box-list`
    })
  }
})