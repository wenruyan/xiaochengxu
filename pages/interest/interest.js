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
    checked: false,
    id: [],
    showNext: true,
    showFinish: false,
    showLoading: false,
    listData1: [],
    page: 0,
    listData: []
  },
  onLoad: function (options) {
  },
  onShow: function (options) {
    this.getListData()
    $stopWuxRefresher()
    let that = this
    if (app.globalData.unionId && app.globalData.bindPhone) {
      // app.http.all([that.getDrawList(), this.getAwardList(), this.getActivityList()])
      // .then(app.http.spread(function (records, projects) {
      //   console.log('都完成了', records, projects)
      //   wx.stopPullDownRefresh()
      // }))
      // .catch(function(error){
      //   console.log(error)
      // })
    } else {
      // that.getActivityList(() => {
      //   wx.stopPullDownRefresh()
      // })
    }
  },
  // 请求数据
  getListData() {
    wx.showLoading({
      title: '',
      mask: true
    })
    let data = {
    }
    app.http.post("focus.initializePreferences", data).then((res) => {
      if(res.code == 200) {
        var data = res.data.rows
        console.log(data, 'data')
        data.map((item, i) => {
          console.log(item)
          item.checked = false
        })
        this.setData({
          listData: data
        })
        if (this.data.listData.length >5) {
          this.setData({
            listData1: this.SplitArray(5, this.data.listData)[0]
          })
        } else {
          this.setData({
            listData1: this.SplitArray(this.data.listData.length, this.data.listData)[0]
          })
        }
        if (this.data.listData.length <= 5) {
          this.setData({
            showFinish: true,
            showNext: false
          })
        }
        setTimeout(function () {
          wx.hideLoading()
        }, 1000)
      }
      console.log(this.data.listData)
    })
  },
  // 选择偏好
  changeCheck(e) {
    console.log(e)
    var listData1 = this.data.listData1;
    let arrId =[]
    var index = e.currentTarget.dataset.index;
    if (listData1[index].checked == false) {
      listData1[index].checked = true;
      console.log(listData1[index], '8888888')
      this.data.id.push(listData1[index])
      arrId = this.data.id
      console.log(arrId ,' 77777')
      // this.setData({
      //   id: arrId
      // })
    } else {
      console.log(this.data.id)
      console.log(listData1[index].id)
      this.data.id.map((item, index1) => {
        console.log(item)
        if (item == listData1[index]) {
          this.data.id.splice(index1, 1)
        }
      })
      console.log(this.data.id, '9999999')
      arrId = this.data.id
      listData1[index].checked = false;
    }
    this.setData({
      listData1: listData1,
      id: arrId
    });
  },
  // 点击下一步
  nextTep() {
    let arr = this.SplitArray(5, this.data.listData)
    this.data.page = this.data.page + 1
    console.log(this.data.page, '444444')
    if (this.data.page == arr.length -1) {
      this.setData({
        showFinish: true,
        showNext: false
      })
    }
      this.setData({
        listData1: arr[this.data.page]
      })
    if (this.data.page == arr.length) {
      this.setData({
        listData1: arr[arr.length],
        showFinish: true,
        showNext: false
      })
    }
  },
  // 选择完毕
  select() {
    console.log(11111)
    console.log(this.data.id)
    var id = this.data.id
    console.log(id)
    var arr=[]
    id.map((item, index) => {
      console.log(item)
      arr.push(item.qyId)
    })
    arr = arr.join(',')
    // app.record(
    //   {
    //     pageNo: "05", // 用户操作页面-10:登录页,20:注册页,30:产品页
    //     operationType: "10", // 用户操作行为-10:按钮,20:输入
    //     operationObject: "50", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心,
    //     contentNo: arr, // 内容ID:只有在点击快报和权益的时候才有
    //   }
    // );
    if(this.data.id.length != '') {
      this.setData({
        showLoading: true
      })
      // 请求接口
      let data = {
        data: id,
        openid: '200'
    }
      app.http.post("focus.choicePreferences", data).then((res) => {
        if(res.code == 200) {
          wx.showToast({
            title: '配置完成',
            icon: 'success',
            duration: 2000
          })
          this.setData({
            showLoading: false
          })
          wx.switchTab({
            url: '/pages/index/index'
          })
          app.globalData.isInterest = 'isInterest'
          wx.setStorageSync('isInterest', 'isInterest')
        }
      })
    }
  },
  SplitArray:function (N, Q) {
    var R = [], F;
    for (F = 0; F < Q.length;) R.push(Q.slice(F, F += N))
    return R
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
  },
  modalClick(event) {
    console.log(event)
    let index = event.detail.index
    if (index == 0) {
      // 去卡包
      this.goTab('my-card')
      this.setData({
        modalVisible: false
      })
    } else if (index == 1) {
      // 取消
      this.setData({
        modalVisible: false
      })
    }
  }
})