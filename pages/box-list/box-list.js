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
    packageList: [],
    otherList: [],
    page: 1,
    rows: 10,
    totalPage: 1,
  },
  onShow: function(options) {
    this.setData({
      page: 1,
      rows: 10,
      totalPage: 1
    })
    this.getListData()
  },
  changePac(e) {
    console.log(e)
    let recordId = e.currentTarget.dataset.recordid
    let boxId = e.currentTarget.dataset.boxid
    let rewardDate = e.currentTarget.dataset.rewarddate
    wx.navigateTo({
      url: `/pages/box-detail/box-detail?recordId=${recordId}&boxId=${boxId}&rewardDate=${rewardDate}`
    })
    
  },
  getListData() {
    if (this.data.page > this.data.totalPage) return false
    wx.showLoading({
      title: '',
      mask: true
    })
    let data = {
      page: this.data.page,
      rows: this.data.rows,
      // companyNo: '1006004',
      companyNo: app.globalData.companyNo
    }
    app.http.post("focus.miniHrPushRecord", data).then((res) => {
      let arr = this.data.packageList
      arr = arr.concat(res.data.rows)
      console.log(arr, 'arr')
      arr.map((item, index) => {
        item.child = [];
        // item.hrQrStatus = 20
        item.setMealList.map((item1, index1) => {
          if (item1.isDefault == 10) {
            // item.child.push({
            //   type: 10,
            //   id: "2556598989734400",
            //   discountScope: "10", // 券 10 => 全场  20 => 指定 30 => 分类
            //   deductionNum: 20.01,
            //   quantity: 3
            // })
            // item.child.push({
            //   type: 10,
            //   id: "2556598989734400",
            //   discountScope: "20", // 券 10 => 全场  20 => 指定 30 => 分类
            //   deductionNum: 200,
            //   quantity: 3
            // })
            item1.equityList.map((item2, index1) => {
              item.child.push(item2);
            })
          }
        })
      })
      this.setData({
        packageList: arr,
        page: res.data.page + 1,
        rows: this.data.rows,
        totalPage: res.data.totalPage
      })
      wx.hideLoading()
    }, (res) => {
      wx.showToast({
        title: "请求出错",
        icon: 'none',
        duration: 2000
      })
    })
  }
})