// pages/directPayDesc/directPayDesc.js
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  /**
   * 页面的初始数据
   */
  data: {
    ...app.pageData,
    navOpcity: 0,
    skuStatus: 30,
    accountNumber: "18752068270",
    description: "百度网盘是百度推出的一项云存储服务，已覆盖主流PC和手机操作系统，您可以通过百度网盘轻松地进行照片、视频、文档等文件的网络备份、同步和百度出度网盘是百度推出",
    createTime: "2019-10-10",
    failTime: "2019-07-01 12:00:00",
    orderNo: "1321654678798",
    price: 1500,
    data: null,
    orderstatus: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log("options", options)
    this.setData({
      orderstatus: options.rechargeStatus
    })
    app.http.post('focus.myBuyRechargeDetail', {
      orderId: options.orderId,
      orderItemDetailId: options.orderDetailId
    }).then(res => {
      console.log("====", res.data)
      res.data.create_date = app.moment(res.data.create_date).format('YYYY-MM-DD')
      res.data.productDescription = res.data.productDescription.split(",")
      res.data.mortgageamount = (Number(res.data.mortgageamount) / 100).toFixed(0)
      this.setData({
        data: res.data
      })
      console.log(this.data.data)

    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  onPageScroll: function(e) {
    console.log(e); //{scrollTop:99}
    if (e.scrollTop >= 50) {
      this.setData({
        navOpcity: 1,
      })
    } else {
      this.setData({
        navOpcity: 0,
      })
    }
  },
  getSkuImg(arr, pictype) {
    let url = [];
    if (!arr) {
      return false
    } else {
      arr.forEach(e => {
        if (e.pictype == pictype) {
          url.push(e.url);
        }
      });
    }
    return url;
  }
})