//index.js
//获取应用实例
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    inputPhoneValue: '',
    inputCodeValue: '',
    time: 60,
    page: '',
    cardId: '',
    cardDetailId: '',
    pageMine: '',
    activeSelect: '',
    id: '',
    qytype: ''
  },
  onLoad: function(options) {
    console.log(options)
    this.setData({
      page: options.page ? options.page:'',
      cardId: options.cardId,
      cardDetailId: options.cardDetailId,
      pageMine: options.pageMine ? options.pageMine: '',
      activeSelect: options.activeSelect ? options.activeSelect: '',
      id: options.id ? options.id : '',
      qytype: options.qytype ? options.qytype : ''
    })
  },
  bindPhoneInput(e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  bindCodeInput(e) {
    this.setData({
      inputCodeValue: e.detail.value
    })
  },
  getCode () {
    if (!app.common.regMobile(this.data.inputPhoneValue)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false
    }
    wx.showLoading({
      title: '',
      mask: true
    });
    let udata = {
      phone: this.data.inputPhoneValue
    }
    app.http.post("focus.getPhoneVcode", udata).then((res)=>{
      wx.hideLoading()
      if (res.message == "请稍后重试") {
        wx.showToast({
          title: '请稍后重试',
          icon: 'none',
          duration: 1500,
          mask: false
        });
      } else if (res.message == "今天短信次数已达上限，请明天再试") {
        wx.showToast({
          title: '今天短信次数已达上限，请明天再试',
          icon: 'none',
          duration: 1500,
          mask: false
        });
      } else {
        wx.showToast({
          title: '验证码已发送',
          icon: 'none',
          duration: 1500,
          mask: false
        });
        this.intervalTime()
      }
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  },
  intervalTime () {
    if (this.data.time > 0) {
      this.setData({
        time: this.data.time - 1
      })
      setTimeout(() => {
        this.intervalTime()
      }, 1000)
    } else {
      this.setData({
        time: 60
      })
    }
  },
  sure (e) { 
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
    console.log(e)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    if (!this.data.inputCodeValue) {
      wx.showToast({
        title: '请输入验证码',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
      return false
    }
    wx.showLoading({
      title: '',
      mask: true
    });
    let udata = {
      phone: this.data.inputPhoneValue,
      vCode: this.data.inputCodeValue,
      loginType: '20'
    }
    app.http.post("focus.leyeBindingPhone", udata).then((res) => {
      wx.hideLoading()
      console.log(res)
      let data;
      console.log(data)
      if (res.code && res.code == 200) {
        data = JSON.parse(res.data)
        wx.showToast({
          title: '绑定成功',
          icon: 'none',
          duration: 1500,
          mask: true
        });
        app.globalData.bindPhone = true
        wx.setStorageSync('bindPhone', true)
        app.globalData.userId = data.userId
        wx.setStorageSync('userId', data.userId)
        app.globalData.phone = this.data.inputPhoneValue
        wx.setStorageSync('phone', this.data.inputPhoneValue)
        if (this.data.page) {
          wx.navigateTo({
            url: '/pages/code-detail/code-detail?cardId=' + this.data.cardId + '&cardDetailId=' + this.data.cardDetailId + '&page=' + this.data.page + '&activeSelect=' + this.data.activeSelect
          })
        } else if (this.data.pageMine == 'mine') { 
          wx.switchTab({
            url: '/pages/mine/mine'
          })
        } else {
          if (data.step == 30) {
            wx.navigateTo({
              url: '/pages/apply-company/apply-company'
            })
          }
          if (data.step == 40) {
            wx.switchTab({
              url: '/pages/index/index'
            })
          }
        }
        
        // setTimeout(() => {
        //   this.backPage(2)
        // }, 1500)
        // 记录
        // app.record(
        //   {
        //     pageNo: "20", // 用户操作页面-10:登录页,20:注册页,30:产品页
        //     operationType: "10", // 用户操作行为-10:按钮,20:输入
        //     operationObject: "50", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,
        //     TAG: this.data.inputPhoneValue + ',' + this.data.inputCodeValue
        //   },
        //   "",
        //   () => {
        //   }
        // );
      } else if (res.code && res.code == 1002) {
        wx.showToast({
          title: '验证码错误，请重新输入',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      } else if (res.code && res.code == 206) {
        console.log(11111111)
        wx.showToast({
          title: '手机号或验证码错误',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      } else {
        wx.showToast({
          title: '绑定失败，请重试',
          icon: 'none',
          duration: 1500,
          mask: true
        });
      }
    }).catch(err => {
      console.log(err.status, err.message)
    })
  }
})