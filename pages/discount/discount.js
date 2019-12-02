//index.js
//获取应用实例
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    salePriceArr: '',
    page: 1,
    rows: 12,
    totalPage: 1,
    noData: false,
    id: '',
    cardDetailId: '',
    topData:[],
    listData: [],
    type: ''
  },
  onLoad: function (options) {
    this.setData({
      id: options.id ? options.id : '',
      cardDetailId: options.cardDetailId ? options.cardDetailId: ''
    })
    this.getList()
  },
  onShow: function (options) {
  },
  getList() {
    console.log(this.data.id, 'id')
    // if ((this.data.page > this.data.totalPage) || this.data.loading) return false
    wx.showLoading({
      name: '',
      mask: true
    })
    this.setData({
      loading: true
    })
    let data = {
      discountId: this.data.id,
      cardDetailId: this.data.cardDetailId,
      page: this.data.page,
      rows: this.data.rows,
    }
      app.http.post("focus.couponsForGoods", data).then((res) => {
      let arr = this.data.listData
        arr = arr.concat(res.data.productlists)
      if (arr.length == 0) {
        this.setData({
          noData: true
        })

      } else {
        this.setData({
          listData: arr,
          page: res.data.page + 1,
          rows: this.data.rows,
          totalPage: res.data.totalPage
        })
        
      }
        this.setData({
          topData: res.data.discounts,
        })
        console.log(this.data.listData)
      wx.hideLoading();
      this.setData({
        loading: false
      })
    }, (res) => {
      wx.showToast({ name: "请求出错", icon: 'none', duration: 2000 })
    })
  }, 
  goCard(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
      if(item.type == 30) {
        this.toCard({
          optType: '4',
          goodsId: item.productId,
          qyType: item.type
        })
      }
      if (item.type == 50) {
        this.toCard({
          optType: '5',
          goodsId: item.productId,
          qyType: item.type
        })
      }
    
  }
})