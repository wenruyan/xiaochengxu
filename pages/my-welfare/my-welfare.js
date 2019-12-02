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
    actions: [{
      name: '标为已使用',
      color: '#fff',
      fontsize: '20',
      width: 65,
      background: '#FF4E47'
    }],
    selectObj: {},
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
    modalShow: false,
    toggle: false,
    deleteIndex: '',
    showModal: false,
    hasUserInfo: true,
    pageTitle: '我的福利'
  },
  onLoad: function (options) {
    // app.globalData.step = 20
    console.log(this.data.activeSelect, 'activeSelect')
    this.setData({
      activeSelect: options.activeSelect ? options.activeSelect: 1
    })
    if (this.data.activeSelect == 1) {
      this.getOrderList()
    }
    if (this.data.activeSelect == 2) {
      this.getOrderList1()
    }
    if (this.data.activeSelect == 3) {
      this.getOrderList2()
    }
    if (!app.globalData.unionId) {
      this.setData({
        showModal: true,
        hasUserInfo: false
      })
    }
    if (options.fromAward) {
      this.setData({
        pageTitle: '我的奖品'
      })
    }
  },
  onShow() {
    this.getOrderList()
  },
  changeSelect() {
    this.setData({
      activeSelect: 1,
      page1: 1,
      listData1: []
    })
    this.getOrderList()
  },
  changeSelect1() {
    this.setData({
      activeSelect: 2,
      page2: 1,
      listData2: []
    })
    this.getOrderList1()
  },
  changeSelect2() {
    this.setData({
      activeSelect: 3,
      page3: 1,
      listData3: []
    })
    this.getOrderList2()
  },
  showModal(e) {
    console.log(e)
    this.setData({
      modalShow: true,
      selectObj: e.currentTarget.dataset['item'],
      toggle: this.data.toggle ? true : false,
      deleteIndex: e.currentTarget.dataset.index
    })
  },
  hideModal() {
    this.setData({
      modalShow: false,
      toggle: this.data.toggle ? false : true,
    })
  },
  // 标为已使用
  onClick(e) {
    console.log(e);
    console.log(e.currentTarget.dataset['item'], 'item');
    let item = this.data.selectObj;
    console.log(item)
    app.http.post("focus.updateIsUsed", {
      orderDetailId: item.orderDetailId ? item.orderDetailId : "",
      carddetailid: item.carddetailid ? item.carddetailid : "",
      operation: "10" // 10修改状态为已使用   20 删除
    }).then((res) => {
      console.log(res, 'updateIsUsed');
      var deleteIndex = this.data.deleteIndex;
      var listData = this.data.listData1;
      listData.splice(deleteIndex, 1)
      this.setData({
        listData1: listData,
        toggle: this.data.toggle ? false : true,
        modalShow: false
      })
      // this.setData({
      //   page1: 1,
      //   modalShow: false
      // })
      // this.getOrderList;
    })
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
      type: 10,
      page: this.data.page1,
      rows: this.data.rows,
    }
    app.http.post("focus.LeyeMiniCardPackageList", data).then((res) => {
      let arr = this.data.listData1
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        arr.map((item) => {
          // item.endtime = app.moment(item.endtime).format('YYYY-MM-DD')
          // item.create_date = app.moment(item.create_date).format('YYYY-MM-DD')
        })
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
      type: 30,
      page2: this.data.page,
      rows: this.data.rows,
    }
    app.http.post("focus.LeyeMiniCardPackageList", data).then((res) => {
      let arr = this.data.listData2
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        arr.map((item) => {
          // item.endtime = app.moment(item.endtime).format('YYYY-MM-DD')
          // item.create_date = app.moment(item.create_date).format('YYYY-MM-DD')
        })
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
      type: 20,
      page: this.data.page3,
      rows: this.data.rows,
    }
    app.http.post("focus.LeyeMiniCardPackageList", data).then((res) => {
      let arr = this.data.listData3
      arr = arr.concat(res.data.rows)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })
      } else {
        arr.map((item) => {
          // item.endtime = app.moment(item.endtime).format('YYYY-MM-DD')
          // item.create_date = app.moment(item.create_date).format('YYYY-MM-DD')
        })
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
  goPage(e) {
    console.log(e)
    if (e.detail.formId) {
      app.upFormId(e.detail.formId)
      return false
    }
    console.log(this.data.step)
    // let bindDataset = e.detail.target.dataset
    let bindDataset = e.currentTarget.dataset
    let cardid = bindDataset.item.cardid
    let carddetailid = bindDataset.item.carddetailid
    let id = bindDataset.item.discountid
    let type = bindDataset.item.type
    let discountscope = bindDataset.item.discountscope
    if (bindDataset.item.type == 40) {
      if (app.globalData.step == 20) {
        console.log(this.data.activeSelect,'activeSelect')
        wx.navigateTo({
          url: '/pages/bind-index/bind-index?page=' + 'code-detail' + '&cardId=' + cardid + '&cardDetailId=' + carddetailid + '&activeSelect=' + this.data.activeSelect
        })
      } else {
        wx.navigateTo({
          url: '/pages/code-detail/code-detail?cardId=' + cardid + '&cardDetailId=' + carddetailid
        })
      }
      
    }
    if (bindDataset.item.type == 11) {
      wx.navigateTo({
        url: '/pages/link-detail/link-detail?cardId=' + cardid + '&cardDetailId=' + carddetailid
      })
    }
    if (bindDataset.item.type == 10) {
      if (discountscope == 10) { // 全场
        this.toCard({
          optType: '3'
        })
      } else { // 非全场，跳转到适用商品页
        wx.navigateTo({
          url: '/pages/discount/discount?id=' + id + '&cardDetailId=' + carddetailid
        })
      }
      
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
    this.onShow()
  }
})