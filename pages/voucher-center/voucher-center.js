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
    page: 1,
    rows: 10,
    totalPage: 1,
    noData: false,
    loading: false,
    id: '',
    listData: []
  },
  onLoad: function (options) {
    console.log(options, '传值')
    this.setData({
      id: options.id
    })
    this.getListData()
  },
  onShow: function (options) {
  },
  // 请求数据
  getListData() {
    if ((this.data.page > this.data.totalPage) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      openid: app.globalData.openId,
      page: this.data.page,
      rows: this.data.rows,
      id: this.data.id,
      unionId: app.globalData.unionId
    }
    app.http.post("focus.goldenClickListType", data).then((res) => {
      let arr = this.data.listData
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData: arr,
          page: res.data.page + 1,
          rows: this.data.rows,
          totalPage: res.data.totalPage
        })
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({
        title: "请求出错",
        icon: 'none',
        duration: 2000
      })
    })
  },
  onPulling() {
    console.log('onPulling')
  },
  onRefresh() {
    console.log('onRefresh')
    setTimeout(() => {
      this.getListData()
      $stopWuxRefresher('#wux-refresher')
    }, 2000)
  },
})