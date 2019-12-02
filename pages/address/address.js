//index.js
//获取应用实例
const app = getApp()

Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    marginTop:'',
    motto: 'Hello World',
    userInfo: {},
    showTabbar: false,
    tabbar: {},
    inputNameValue: '',
    inputAddressValue: '',
    inputPhoneValue: '',
    region: ['', '', ''],
    setDefault: false,
    showModal: false,
    hasUserInfo: true,
    listData: []
  },
  onLoad: function (options) {
    if (!app.globalData.unionId) {
      this.setData({
        showModal: true,
        hasUserInfo: false
      })
    } else {
      this.getData()
    }
  },
  getData() {
    let data = {}
    app.http.post("focus.deliverAward", data).then((res) => {
      if (res.code == 200) {
        let data = res.data
        this.setData({
          listData: data.unget,
          inputNameValue: data.name || "",
          inputPhoneValue: data.phone || "",
          inputAddressValue: data.addressDetail	|| "",
          region: data.province ? [data.province, data.city, data.area] : []
        })
      }
    }).catch((err) => {})
  },
  getWxAddress(e) {
    console.log(e)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    let that = this
    wx.authorize({
      scope: 'scope.address',
      success() {
        console.log('授权成功')
        wx.chooseAddress({
          success: function (res) {
            // 获取收货地址成功
            console.log(res)
            console.log(res.userName)
            console.log(res.postalCode)
            console.log(res.provinceName)
            console.log(res.cityName)
            console.log(res.countyName)
            console.log(res.detailInfo)
            console.log(res.nationalCode)
            console.log(res.telNumber)
            that.setData({
              inputNameValue: res.userName,
              inputAddressValue: res.detailInfo,
              inputPhoneValue: res.telNumber,
              region: [res.provinceName, res.cityName, res.countyName]
            })
          }
        })
      },
      fail(res) {
        console.log('授权失败', res)
      }
    })
  },
  bindNameInput(e) {
    this.setData({
      inputNameValue: e.detail.value
    })
  },
  bindPhoneInput(e) {
    this.setData({
      inputPhoneValue: e.detail.value
    })
  },
  bindAddressInput(e) {
    this.setData({
      inputAddressValue: e.detail.value
    })
  },
  bindRegionChange(e) {
    console.log(e.detail)
    this.setData({
      region: [e.detail.value[0], e.detail.value[1], e.detail.value[2]]
    })
  },
  submitInfo(e) {
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    // 提交信息
    let chooseRegion;
    this.data.region.map((item) => {
      
      if(item == '') {
        chooseRegion = false
      } else {
        chooseRegion = true
      }
    })
    console.log(app.isPoneAvailable(this.data.inputPhoneValue))
    if (!this.data.inputNameValue || !this.data.inputPhoneValue || !this.data.inputAddressValue || chooseRegion == false) {
      wx.showToast({
        icon: 'none',
        title: '请填写完整信息',
      })
    } else if (app.isPoneAvailable(this.data.inputPhoneValue) == false) {
      wx.showToast({
        icon: 'none',
        title: '手机号格式错误',
      })
    } else {
      // wx.showLoading({
      //   title: '',
      //   mask: true
      // })
      // 请求接口
      let data = {
        name: this.data.inputNameValue,
        phone: this.data.inputPhoneValue,
        addressDetail: this.data.inputAddressValue,
        province: this.data.region[0],
        city: this.data.region[1],
        area: this.data.region[2]
      }
      app.http.post("focus.getCommodityEntity", data).then((res) => {
        if (res.code == 200) {
          wx.showToast({
            icon: 'none',
            title: '提交成功',
          })
          wx.redirectTo({
            url: '/pages/send-success/send-success'
          })
        }
      }).catch((err) => {})
    }
  },
  closeModal() {
    this.setData({
      showModal: false
    })
  },
  loginSuccess(e) {
    console.log(e)
    this.setData({
      showModal: false,
      hasUserInfo: true
    })
    this.getData()
  }
})