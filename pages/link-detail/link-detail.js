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
    bgColor: '#F8F8F8',
    leftBtn: 'white-bg',
    link: '',
    modalShow: false,
    listData: [],
    cardid: '',
    carddetailid: '',
    cardDetailId: '',
    articleId: '',
    type: ''
  },
  onLoad: function (options) {
    console.log(options,'optios')
    this.setData({
      cardid: options.cardId ? options.cardId : '',
      carddetailid: options.cardDetailId ? options.cardDetailId : ''
    })
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
        var data = res.data.rows[0]
          data.description = data.description.split(',')
          data.endtime = app.moment(data.endtime).format('YYYY-MM-DD HH:mm:ss')
        this.setData({
          link: data.externallinks,
          cardId: data.cardId,
          cardDetailId: data.cardDetailId,
          type: data.type,
          listData: data
        })
      }
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
  goUser() {
    this.toCard({
      optType: '2',
      cardDetailId: this.data.cardDetailId,
      cardId: this.data.cardId,
      link: this.data.link,
      qyType: this.data.type
    })
  },
  onClick(e) {
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