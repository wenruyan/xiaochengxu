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
    searchIcon: false,
    page: 1,
    rows: 15,
    totalPage: 1,
    noData: false,
    loading: false,
    listData:[]
  },
  onLoad: function (options) {
    // this.getListData()
    console.log(options, 'options')
  },
  shop_search_function: function (e) {
    var that = this;
    console.log(e)
    var discountName = e.detail.value['search - input'] ? e.detail.value['search - input'] : e.detail.value
    console.log(1111111111)
    console.log('e.detail.value', discountName)
    if (discountName != '') {
      this.setData({
        searchIcon: true,
        inputValue: discountName,
        listData: [],
        page: 1
      })
      this.getListData()
    }
    
    // this.setData({
    //   inputValue: discountName
    // })
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
      unionId: app.globalData.unionId,
      searchName: this.data.inputValue
    }
    app.http.post("focus.leyeCompanyInfo", data).then((res) => {
      let arr = this.data.listData
      arr = arr.concat(res.data.rows)
      console.log(arr, 'arr')
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData: arr,
          page: res.page + 1,
          rows: this.data.rows,
          totalPage: res.totalPage
        })
      }
      setTimeout(function () {
        wx.hideLoading()
      }, 1000)
      console.log(this.data.listData, 'list')
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
  bindInput(e) {
    console.log(e)
    this.setData({
      inputValue: e.detail.value,
      searchIcon: true
    })
    if (e.detail.value == '') {
      this.setData({
        searchIcon: false,
        // listData: []
      })
    }
  },
  // 搜索
  search() {
    console.log(this.data.inputValue)
    if (this.data.inputValue != '') {
      this.setData({
        searchIcon: true,
        inputValue: this.data.inputValue,
        listData: [],
        page: 1
      })
    }
    this.getListData()
  },
  clickIcon() {
    console.log(11111111)
    this.setData({
      inputValue: '',
      searchIcon: false,
      // listData: []
    })
    // this.getListData()
  },
  join(e) {
    console.log(e)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    // wx.showToast({
    //   title: '加入成功，请等待管理员审核',
    //   icon: 'none',
    //   duration: 1000
    // })
    wx.navigateTo({
      url: '/pages/complete-info/complete-info?companyNo=' + e.currentTarget.dataset.companyno
    })
  },
  apply(e) {
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
    }
    wx.navigateTo({
      url: '/pages/join-company/join-company'
    })
  },
  onShow: function (options) {
    // $stopWuxRefresher()
    // let that = this
    // if (app.globalData.unionId && app.globalData.bindPhone) {
    //   // app.http.all([that.getDrawList(), this.getAwardList(), this.getActivityList()])
    //   // .then(app.http.spread(function (records, projects) {
    //   //   console.log('都完成了', records, projects)
    //   //   wx.stopPullDownRefresh()
    //   // }))
    //   // .catch(function(error){
    //   //   console.log(error)
    //   // })
    // } else {
    //   // that.getActivityList(() => {
    //   //   wx.stopPullDownRefresh()
    //   // })
    // }
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