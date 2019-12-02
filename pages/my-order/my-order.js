//index.js
//获取应用实例
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    activeSelect: 1,
    listData1: [],
    listData2: [],
    listData3: [],
    page1: 1,
    page2: 1,
    page3: 1,
    rows: 10,
    totalPage1: 1,
    totalPage2: 1,
    totalPage3: 1,
    noData: false,
    noData2: false,
    noData3: false,
  },
  onLoad: function (options) {
    this.getOrderList()
  },
  changeSelect() {
    this.setData({
      activeSelect: 1,
      listData1: [],
      page1: 1
    })
    this.getOrderList()
  },
  changeSelect1() {
    this.setData({
      activeSelect: 2,
      listData2: [],
      page2: 1
    })
    this.getOrderList1()
  },
  changeSelect2() {
    this.setData({
      activeSelect: 3,
      listData3: [],
      page3: 1
    })
    this.getOrderList2()
  },
  getOrderList() {
    if ((this.data.page1 > this.data.totalPage1) || this.data.loading) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      status: 0,
      page: this.data.page1,
      rows: this.data.rows,
    }
    app.http.post("focus.myBuyList", data).then((res) => {
      let arr = this.data.listData1
      arr = arr.concat(res.data.rows)
      arr.map((item) => {
        console.log(typeof item.gprice)
        item.gprice = Number(item.gprice).toFixed(2)
      })
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        console.log(arr)
        this.setData({
          listData1: arr,
          page1: res.data.page + 1,
          rows: this.data.rows,
          totalPage1: res.data.totalPage
        })
      }
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
    })
  }, 
  getOrderList1() {
      if ((this.data.page2 > this.data.totalPage2) || this.data.loading) return false
      wx.showLoading({
        title: '',
        mask: true
      })
      this.setData({
        loading: true
      })
      let data = {
        status: 10,
        page: this.data.page2,
        rows: this.data.rows,
      }
      app.http.post("focus.myBuyList", data).then((res) => {
        let arr = this.data.listData2
        arr = arr.concat(res.data.rows)
        if (arr.length == 0) {
          this.setData({
            noData2: true
          })
        } else {
          console.log(arr)
          this.setData({
            listData2: arr,
            page2: res.data.page + 1,
            rows: this.data.rows,
            totalPage2: res.data.totalPage
          })
        }
        wx.hideLoading();
        this.setData({
          loading: false
        })
      }, (res) => {
        wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
      })
  }, 
  getOrderList2() {
      if ((this.data.page3 > this.data.totalPage3) || this.data.loading) return false
      wx.showLoading({
        title: '',
        mask: true
      })
      this.setData({
        loading: true
      })
      let data = {
        status: 20,
        page: this.data.page3,
        rows: this.data.rows,
      }
      app.http.post("focus.myBuyList", data).then((res) => {
        let arr = this.data.listData3
        arr = arr.concat(res.data.rows)
        if (arr.length == 0) {
          this.setData({
            noData3: true
          })
        } else {
          console.log(arr)
          this.setData({
            listData3: arr,
            page3: res.data.page + 1,
            rows: this.data.rows,
            totalPage3: res.data.totalPage
          })
        }
        wx.hideLoading();
        this.setData({
          loading: false
        })
      }, (res) => {
        wx.showToast({ title: "请求出错", icon: 'none', duration: 2000 })
      })
  }, 
  toOrderDetail(e) {
    console.log(e)
    console.log(e.currentTarget.target, 'jin lai le');
    let rechargeStatus = e.currentTarget.dataset.id.rechargeStatus
    let orderId = e.currentTarget.dataset.id.orderId
    // let orderDetailId = e.currentTarget.dataset.id.orderDetailId
    console.log("rechargeStatus", rechargeStatus)
    // console.log(orderDetailId)
    console.log(orderId)
    if (e.currentTarget.dataset.id.orderType == 50) {
      wx.navigateTo({
        url: '/pages/erweima/erweima?orderId=' + orderId
      })
    } 
    if (e.currentTarget.dataset.id.orderType == 30) {
      wx.navigateTo({
        url: '/pages/directPayDesc/directPayDesc?rechargeStatus=' + rechargeStatus + '&orderId=' + orderId
      })
    }
  },
  toToast() {
    wx.showToast({ title: "该商品未发货", icon: 'none', duration: 2000 })
  },
})