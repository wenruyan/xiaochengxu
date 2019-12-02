//index.js
//获取应用实例
const app = getApp()
// import { $stopWuxRefresher } from '../../libs/wux/index'
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    scrollTop: 0,
    navBgColor: '#fff',
    marginRight: '18',
    leftBtn: 'white-bg',
    bgColor: '#F8F8F8',
    link: '',
    modalShow: false,
    listData: [],
    cardid: '',
    carddetailid: '',
    page: '',
    activeSelect: '',
    modalCopy: false,
    linkurl: '',
    cardId: '',
    cardDetailId: '',
    type: '',
    id: '',
    qytype: ''
  },
  onLoad: function (options) { 
    console.log(options)
    this.setData({
      cardid: options.cardId ? options.cardId : '',
      carddetailid: options.cardDetailId ? options.cardDetailId : '',
      page: options.page ? options.page : '',
      activeSelect: options.activeSelect ? options.activeSelect : '',
      id: options.id ? options.id : '',
      qytype: options.qytype ? options.qytype : ''
    })
    app.globalData.activeSelect = this.data.activeSelect
    wx.setStorageSync('activeSelect', this.data.activeSelect)
    app.globalData.id = options.id
    wx.setStorageSync('id', options.id)
    app.globalData.qytype = options.qytype
    wx.setStorageSync('qytype', options.qytype)
  },
  onShow: function (options) {
    this.getListData()
  },
  getListData() {
    let udata = {
      cardid: this.data.cardid,
      carddetailid: this.data.carddetailid
    }
    app.http.post("focus.lykMiniCardPackageDetail", udata).then((res) => {
      if (res.code == 200) {
        var data = res.data.rows
        data.map((item, index) => {
          item.description = item.description.split(',')
          item.endtime = app.moment(item.endtime).format('YYYY-MM-DD HH:mm:ss')
        })
        this.setData({
          listData: data[0],
          linkurl: data[0].linkurl,
          link: data[0].codestring,
          cardDetailId: data[0].cardDetailId,
          cardId: data[0].cardId,
          type: data[0].type
        })
      }
      console.log(this.data.listData)
    })
  },
  closeModalCopy() {
    this.setData({
      modalCopy: false,
    })
  },
  showModal(e) {
    this.setData({
      modalShow: true
    })
  },
  hideModal(e) {
    this.setData({
      modalShow: false
    })
  },
  goUse() {
    this.toCard({
      optType: '1',
      cardDetailId: this.data.cardDetailId,
      cardId: this.data.cardId,
      link: this.data.linkurl,
      qyType: this.data.type
    })
    this.setData({
      modalCopy: false
    })
  },
  onClick(e) {
    console.log(1);
    console.log(this.data.listData);
    // this.data.listData.map((item, index) => {
    //   item.status = 100
    // })
    this.setData({
      listData: this.data.listData,
      modalShow: false
    })
    console.log(this.data.listData, 'listData');
    let item = this.data.listData;
    app.http.post("focus.updateIsUsed", {
      orderDetailId: item.orderdetailid ? item.orderdetailid : "",
      carddetailid: item.cardDetailId ? item.cardDetailId : "",
      operation: "10" // 10修改状态为已使用   20 删除
    }).then((res) => {
      console.log(res, 'updateIsUsed');
      this.setData({
        modalShow: false
      })
      this.getListData();
    })
  },
  copyLink() {
    if (this.data.linkurl) {
      this.setData({
        modalCopy: true,
      })
      wx.setClipboardData({
        data: this.data.link,
        success: function (res) {
          wx.hideToast()
          wx.getClipboardData({
            success: function (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    } else {
      wx.showToast({
        title: '复制成功',
      })
      wx.setClipboardData({
        data: this.data.link,
        success: function (res) {
          wx.getClipboardData({
            success: function (res) {
              console.log(res.data) // data
            }
          })
        }
      })
    }
   },
  // 监听滚动
  bindscroll: function (e) {
    console.log(e)
    if (e.detail.scrollTop >= 50) {
      this.setData({
        navBgColor: '#000',
        navOpcity: 1,
        leftBtn: 'black',
        navTitle: '详情页'
      })
    } else {
      this.setData({
        navBgColor: '#fff',
        navOpcity: 0,
        leftBtn: 'white-bg',
        navTitle: ''
      })
    }
  },
  onPageScroll: function (e) {
    console.log(e)

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
  }
})