//index.js
//获取应用实例
const app = getApp()
import {
  $stopWuxRefresher
} from '../../libs/wux/index'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    title: '十一出游行福利盒',
    giveUpConfirm: false,
    sureConfirm: false,
    boxId: '',
    rewardDate: '',
    comboId: '',
    firstComboId: '',
    pushRecordId: '',
    swiperConfirm: false,
    packageList: [],
    detailSwiperCurrent: 0,
    qyList: []
  },
  onLoad: function (options) {
    this.setData({
      boxId: options.boxId,
      rewardDate: options.rewardDate,
      pushRecordId: options.recordId
    })
    this.getListData()
  },
  getListData() {
    wx.showLoading({
      title: '',
      mask: true
    })
    let data = {
      boxId: this.data.boxId
    }
    app.http.post("focus.boxDetail", data).then((res) => {
      let arr = res.data.comboList
      arr.map((item) => {
        if (item.isDefault == 10) {
          item.showQt = true
        } else {
          item.showQt = false
        }
      })
      this.setData({
        packageList: arr,
        title: res.data.boxName,
        firstComboId: arr[0].comboId
      })
      wx.hideLoading()
    }, (res) => {
      wx.showToast({
        title: "请求出错",
        icon: 'none',
        duration: 2000
      })
    })
  },
  sureBox(e) {
    console.log('确认套餐')
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    let data = {
      comboId: this.data.comboId ? this.data.comboId : this.data.firstComboId,
      pushId: this.data.pushRecordId,
      operateType: 10
    }
    app.http.post("focus.confirmCombo", data).then((res) => {
      console.log(res)
      if (res.code == 200) {
        this.setData({
          sureConfirm: true
        })
      } else if (res.code == 401) {
        wx.showToast({
          title: '该套餐已失效',
          icon: 'none',
          duration: 1500,
          mask: false
        });
      }
    })
  },
  cancelBox(e) {
    console.log('放弃套餐')
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    this.setData({
      giveUpConfirm: true
    })
  },
  giveUp() { // 确定放弃
    wx.showLoading()
    let data = {
      comboId: this.data.comboId ? this.data.comboId : this.data.firstComboId,
      pushId: this.data.pushRecordId,
      operateType: 20
    }
    app.http.post("focus.confirmCombo", data).then((res) => {
      console.log(res)
      wx.hdieLoading()
      if (res.code == 200) {
        this.setData({
          giveUpConfirm: false
        })
        wx.showToast({
          title: '该套餐已失效',
          icon: 'none',
          duration: 1000,
          mask: true
        });
        setTimeout(() => {
          wx.navigateBack({
            delta: 1
          });
        }, 1000)
      }
    })
  },
  notGiveUp() { // 再看看
    this.setData({
      giveUpConfirm: false
    })
  },
  sureSuccess() { // 确认套餐成功
    this.setData({
      sureConfirm: false
    })
    app.pageFunc.replacePage('box-list')
  },
  choosedPackage(e) { // 选择权益包
    console.log(e)
    let chIndex = e.currentTarget.dataset.index
    let comboId = e.currentTarget.dataset.comboid
    this.setData({
      comboId: comboId
    })
    this.data.packageList.map((item, index) => {
      if (chIndex == index) {
        item.isDefault = 10
      } else {
        item.isDefault = 20
      }
    })
    this.setData({
      packageList: this.data.packageList
    })
  },
  showQtList(e) {
    let chIndex = e.currentTarget.dataset.index
    this.data.packageList.map((item, index) => {
      if (chIndex == index) {
        item.showQt = true
      } else {
        item.showQt = false
      }
    })
    this.setData({
      packageList: this.data.packageList
    })
  },
  detailSwiperChange(e) {
    console.log(e)
    if (e.detail.source == 'touch') {
      this.setData({
        detailSwiperCurrent: e.detail.current
      })
    }
  },
  closeSwiper() {
    this.setData({
      swiperConfirm: false
    })
  },
  showQyList(e) {
    console.log(e)
    let pacIndex = e.currentTarget.dataset.index
    let qIndex = e.currentTarget.dataset.qindex
    // let id = e.currentTarget.dataset.id
    // let data = {
    //   id: id
    // }
    // app.http.post("focus.comboDetail", data).then((res) => {
    //   console.log(res)
    //   let data = res.data.qyList
    //   data.map((item, index) => {
    //     item.description = item.description.split(',')
    //   })
    //   this.setData({
    //     // detailSwiperCurrent: qIndex,
    //     qyList: res.data.qyList,
    //     swiperConfirm: true
    //   })
    // })
    let tmpArr = this.data.packageList[pacIndex].qyList.map(item => {
      try {
        item.description = item.description.split(',')
      } catch (err) {
        console.log(err)
      }
      return item
    })
    this.setData({
      detailSwiperCurrent: qIndex,
      qyList: tmpArr,
      swiperConfirm: true
    })
  },
  myCatchTouch() {
    // 阻止小程序滚动穿透问题
    return
  }
})