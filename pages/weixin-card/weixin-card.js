// pages/weixin-card/weixin-card.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    ...app.pageData,
    isClose: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(9999999999999)
    // this.setData({ isClose: true })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log(666666666)
    this.setData({ isClose: true })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({ isClose: true })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log(1111111111111)
    this.setData({ isClose: false })
    wx.switchTab({
      url: '/pages/index/index'
    })
    
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

  }
})