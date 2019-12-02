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
    inputValue: "",
    companyNo: '',
    name: '',
    isDisabled: true
  },
  onLoad: function (options) {
    console.log(options, 'options')
    this.setData({
      companyNo: options.companyNo
    })
  },
  bindInput(e) {
    console.log(e)
    if (e.detail.value != '') {
      this.setData({
        isDisabled: false
      })
    } else {
      this.setData({
        isDisabled: true
      })
    }
    this.setData({
      inputValue: e.detail.value
    })
  },
  sure(e) {
    console.log(this.data.inputValue)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    var regu = "^[a-zA-Z\u4e00-\u9fa5]+$";
    var re = new RegExp(regu);
    console.log(this.data.inputValue.search(re) )
    if(this.data.inputValue == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (this.data.inputValue != '' && (this.data.inputValue.search(re) == -1)) {
      wx.showToast({
        title: '格式不正确',
        icon: 'none',
        duration: 2000
      })
    } else{
      let data = {
        companyNo: this.data.companyNo,
        name: this.data.inputValue,
        userId: app.globalData.userId
      }
      app.http.post("focus.leyeLoginInStatePerUser", data).then((res) => {
        console.log(res)
        let data = JSON.parse(res.data)
        if (res.code == 200) {
          wx.showToast({
            title: '您已成功加入该企业',
            icon: 'success',
            duration: 2000
          })
          // app.globalData.check = data.inState
          // wx.setStorageSync('check', data.inState)
          wx.switchTab({
            url: '/pages/index/index'
          })
        }
      })
    }
  },
  onShow: function (options) {
    $stopWuxRefresher()
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