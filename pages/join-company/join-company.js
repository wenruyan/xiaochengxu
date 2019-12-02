//index.js
//获取应用实例
const app = getApp()
import { $stopWuxRefresher } from '../../libs/wux/index'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    inputValue1: "",
    inputValue2: "",
    inputValue3: "",
    inputValue4: "",
    agreeStatus: true,
    idDisabled: true
  },
  onLoad: function (options) {
    console.log(options, 'options')
    console.log(app.globalData.phone)
  },
  bindInput1(e) {
    console.log(e)
    this.setData({
      inputValue1: e.detail.value
    })
  },
  bindInput2(e) {
    console.log(e)
    this.setData({
      inputValue2: e.detail.value
    })
  },
  bindInput3(e) {
    console.log(e)
    this.setData({
      inputValue3: e.detail.value
    })
  },
  bindInput4(e) {
    console.log(e)
    this.setData({
      inputValue4: e.detail.value
    })
  },
  clickAgree() {
    this.data.agreeStatus = !this.data.agreeStatus
    this.setData({
      agreeStatus: this.data.agreeStatus
    })
  },
  onShow: function (options) {
    // $stopWuxRefresher()
    console.log(app.globalData.phone)
    this.setData({
      inputValue3: app.globalData.phone
    })
    let that = this
    if (app.globalData.unionId && app.globalData.bindPhone) {
      // app.http.all([that.getDrawList(), this.getAwardList(), this.getActivityList()])
      // .then(app.http.spread(function (records, projects) {
      //   console.log('都完成了', records, projects)
      //   wx.stopPullDownRefresh()
      // }))
      // .catch(function(error){
      //   console.log(error)
      // })
    } else {
      // that.getActivityList(() => {
      //   wx.stopPullDownRefresh()
      // })
    }
  },
  apply(e) {
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    var regu = "^[a-zA-Z\u4e00-\u9fa5]+$";
    var re = new RegExp(regu);
    console.log(this.data.inputValue1)
    if (this.data.inputValue1 == '') {
      console.log(11111111)
    }
    if (!this.data.inputValue1) {
      console.log(11111111)
    }
    if (this.data.inputValue2 == '') {
      console.log(22222222)
    }
    if (!this.data.inputValue2) {
      console.log(33333333)
    }
    console.log(this.data.inputValue1.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g, ''))
    if (this.data.inputValue1.trim() == '' ) {
      wx.showToast({
        title: '企业名称不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.inputValue1 != '' && !this.data.inputValue1.replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\ ]/g, '')) {
      wx.showToast({
        title: '企业名称格式不正确',
        icon: 'none',
        duration: 2000
      })
    } else if(this.data.inputValue2 != '' && (this.data.inputValue2.search(re) == -1)) {
      wx.showToast({
        title: '联系人格式不正确',
        icon: 'none',
        duration: 2000
      })
    } else if (!app.common.regMobile(this.data.inputValue3)) {
          wx.showToast({
            title: '请输入正确的联系方式',
            icon: 'none',
            duration: 1500,
            mask: false
          });
    } else if (this.data.inputValue4 <= 0) {
      wx.showToast({
        title: '企业人数不能小于1',
        icon: 'none',
        duration: 1500,
        mask: false
      });
    }else {
      this.setData({
        idDisabled: false
      })
      console.log('请求接口')
      let data = {
        companyName: this.data.inputValue1,
        contactName: this.data.inputValue2,
        phone: this.data.inputValue3,
        staffNum: this.data.inputValue4,
        userId: app.globalData.userId
      }
      app.http.post("focus.enterpriseRegister", data).then((res) => {
        if (res.code == 200) {
          // app.globalData.check = res.data.inState
          // wx.setStorageSync('check', res.data.inState)
          // if (res.data.leyePer == 10) {
          //   wx.navigateTo({
          //     url: '/pages/complete-info/complete-info?companyNo=' + res.data.companyNo
          //   })
          // }
          // 手机号与登录时的号码相同
          // if (res.data.leyePer == 20) {
          //   wx.switchTab({
          //     url: '/pages/index/index',
          //   })
          // }
          wx.switchTab({
            url: '/pages/index/index',
          })
        }
        if (res.code == 206) {
          wx.showToast({
            title: '该手机号或该公司已存在',
            icon: 'none',
            duration: 2000,
            mask: false
          });
        }
      })
    }
  },
  goAgreement() {
    wx.navigateTo({
      url: '/pages/user-agreement/user-agreement'
    })
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

  },
  onPullDownRefresh() {
    setTimeout(() => {
      this.onShow()
    }, 2000)
    // wx.stopPullDownRefresh()
  }
})