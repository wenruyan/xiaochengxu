// pages/erweima/erweima.js
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  /**
   * 页面的初始数据
   */
  data: {
    ...app.pageData,
    codeModal: false,
    codeStatus: 10,
    createNo: "12717827828288",
    price: 1500,
    description: "百度网盘是百度推出的一项云存储服务，已覆盖主流PC和手机操作系统，您可以通过百度网盘轻松地进行照片、视频、文档等文件的网络备份、同步和百度出度网盘是百度推出",
    slogan: "一张二维码",
    scrollTop: 0,
    navOpcity: 0,
    data: null,
    options: null,
    modalShow: false,
    usedModalShow: false,
    alreadyModal: false,
    useCode: '',
    useTime: '',
    noUseCode: '',
    noUseTime: '',
    noUseData: '',
    barCodeType: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("otions", options)
    this.setData({
      options: options
    })
    this.getData();


  },
  onPageScroll: function (e) {
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  openCode() {
    this.setData({
      codeModal: true
    })
  },
  closeModal() {
    this.setData({
      codeModal: false
    })
  },
  showModal(e) {
    this.setData({
      usedModalShow: true,
      noUseCode: e.currentTarget.dataset.item.codeUrl,
      noUseTime: e.currentTarget.dataset.item.endtime,
      noUseData: e.currentTarget.dataset.item
    })
  },
  hideModal() {
    this.setData({
      modalShow: false,
      usedModalShow: false
    })
  },
  showReadyModal(e) {
    console.log(e)
    if (e.currentTarget.dataset.item.status == 90) { // 弹出正常弹框
      this.setData({
        modalShow: true,
        noUseCode: e.currentTarget.dataset.item.codeUrl,
        noUseTime: e.currentTarget.dataset.item.endtime,
        noUseData: e.currentTarget.dataset.item
      })
    } else if (e.currentTarget.dataset.item.status == 100) { // 弹出已使用弹框
      this.setData({
        alreadyModal: true,
        useCode: e.currentTarget.dataset.item.codeUrl,
        useTime: e.currentTarget.dataset.item.endtime
      })
    }
  },
  closeAlready() {
    this.setData({
      alreadyModal: false
    })
  },
  getData(){
    let data = {
      orderId: this.data.options.orderId
    }
    app.http.post('focus.myBuyListDetail', data).then(res => {
      console.log("====", res.data)
      res.data.create_date = app.moment(res.data.create_date).format('YYYY-MM-DD')
      res.data.mortgageamount = (Number(res.data.mortgageamount) / 100).toFixed(0)
      console.log(res.data.orderDetail)
      res.data.productDescription = res.data.productDescription.split(',')
      res.data.orderDetail.map((item) => {
        item.endtime = app.moment(item.endtime).format('YYYY-MM-DD')
      })
      console.log(app.moment('2019-10-09T16:25:30.155Z').format('YYYY-MM-DD HH:mm:ss'))
      this.setData({
        data: res.data,
        barCodeType: res.data.barCodeType
      })
      console.log(this.data.data)

    })
  },
  onClick(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    app.http.post("focus.updateIsUsed", {
      orderDetailId: item.orderDetailId ? item.orderDetailId : "",
      operation: "10" // 10修改状态为已使用   20 删除
    }).then((res) => {
      console.log(res, 'updateIsUsed');
      this.setData({
        modalShow: false,
        usedModalShow: false
      })
      this.getData();
    })
  },
  useCode() {
    this.closeModal()
    this.data.data.twocode[0].usestatus = 95
    this.setData({
      data: this.data.data
    })
    app.http.post("focus.updateOrderDetailStatus", {
        orderItemDetailId: this.data.options.orderDetailId
      })
      .then(res => {
        console.log(res);
      });

  },
  useMore() {
    wx.switchTab({
      url: '/pages/my-card/my-card'
    })
    console.log(1111111)
  },
  clickCopy(e) {
    console.log(777777)
    console.log(e)
    let code = e.currentTarget.dataset.item.content
      wx.showToast({
        title: '复制成功',
      })
      wx.setClipboardData({
        data: code,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              console.log(res.data) // data
            }
          })
        }
      })
  },
  changeStatus(e) {
    console.log(e)
    let item = e.currentTarget.dataset.item
    app.http.post("focus.updateIsUsed", {
      orderDetailId: item.orderdetailid ? item.orderdetailid : "",
      orderDetailId: item.orderDetailId ? item.orderDetailId : "",
      operation: "10" // 10修改状态为已使用   20 删除
    }).then((res) => {
      console.log(res, 'updateIsUsed');
      this.getData();
    })
  },
  getSkuImg(arr, pictype) {
    let url = [];
    arr.forEach(e => {
      if (e.pictype == pictype) {
        url.push(e.url);
      }
    });
    return url;
  }

})