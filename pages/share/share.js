//index.js
//获取应用实例
import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
const app = getApp()
Page({
  ...app.pageFunc, // 引入页面跳转的方法
  data: {
    ...app.pageData,
    userInfo: null,
    sharePicPath: '',
    remoteKey: '',
    erCodeUrl: 'http://test-qn.zht87.com/focus/erCode.jpg',
    baseData: {
      time: '',
      bg: '',
      title: '',
      endTime: '',
      allPerson: 0,
      nowPerson: 0,
      personImg: [
        // {
        //   url: 'http://test-qn.zht87.com/focus/mobike.png',
        //   me: 1 // 1 => 我
        // }, {
        //   url: 'http://test-qn.zht87.com/focus/mobike.png',
        //   me: 0
        // }
      ]
    }
  },
  onLoad: async function(options) {
    let that = this
    let info = {
      openId: app.globalData.openId,
      activityId: options.activityId,
      openingConfigId: options.openingConfigId
    }
    let key = await app.saveStrToRemote(JSON.stringify(info))
    console.log('key', key)
    this.setData({
      remoteKey: key.data.param
    })
    // let data = await app.getStrFromRemote(key.data.param)
    // console.log('data', data.data.param)
    app.http.all([this.getActivityDetail(info.activityId), this.getGroupDetail(info.openingConfigId), this.getErcode()])
    .then(app.http.spread(function (records, projects) {
      //两个请求都完成
      console.log('都完成了', records, projects)
      let baseData = that.data.baseData
      let maxPerson = baseData.allPerson < 6 ? baseData.allPerson : 6
      let nowPerson = baseData.nowPerson
      if (nowPerson < maxPerson) {
        for (let i = 0; i < maxPerson - nowPerson; i++) {
          baseData.personImg.push({
            url: "../../images/share/user-add.png",
            me: 0,
            isLocal: 1
          })
        }
      }
      that.setData({
        baseData: baseData
      })
      that.drawCanvas()
    }))
    .catch(function(error){
      console.log(error)
    })
    // this.getActivityDetail('1')
    // this.getGroupDetail('1')
    // this.drawCanvas()
  },
  getActivityDetail (id) {
    let param = {
      openingConfigId: id
    }
    return app.http.post("focus.awardDetail", param).then((res)=>{
      // console.log('111111', res)
      let data = this.data.baseData
      data.bg = res.data.skuimage || 'http://test-qn.zht87.com/focus/activity-1.png'
      data.title = res.data.name
      // data.endTime = app.moment(res.data.endtime).format("YYYY-MM-DD HH:mm:ss")
      data.allPerson = res.data.numberoflimit
      this.setData({
        baseData: data
      })
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  },
  getGroupDetail (id) {
    let param = {
      openingId: id
    }
    return app.http.post("focus.attendOpeningList", param).then((res)=>{
      // console.log('222222', res)
      let data = this.data.baseData
      data.endTime = app.moment(res.data.endtime).format("YYYY-MM-DD HH:mm:ss")
      data.nowPerson = res.data.url.length
      data.personImg = res.data.url.map(item => {
        return {
          url: item,
          me: 0
        }
      })
      this.setData({
        baseData: data
      })
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  },
  getErcode() {
    return app.http.post('focus.getPraiseQRCode', {
      scene: this.data.remoteKey,
      width: 5,
      // page: 'pages/activity-details/activity-details',
      page: 'pages/index/index',
      is_hyaline: false
    }).then((res)=>{
      console.log('pathr', res)
      this.setData({
        erCodeUrl: res.data.path
      })
    }).catch(err=>{
      console.log(err.status,err.message)
    })
  },
  getImageTmpPath(url) {
    let that = this;
    return new Promise((resolve, reject) => {
      if (url.substr(0, 4) == 'http') {
        wx.getImageInfo({
          src: url, //服务器返回的带参数的小程序码地址
          success: (res) => {
            //res.path是网络图片的本地地址
            resolve(res.path)
          },
          fail: function(res) {
            //失败回调
            reject(res.errMsg)
          }
        });
      } else {
        resolve(url)
      }
    })
  },
  async drawCanvas () {
    wx.showLoading({
      title: '',
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    const that = this
    const ctx = wx.createCanvasContext('myCanvas')

    ctx.setFillStyle('#FFFFFF')
    ctx.fillRect(0, 0, 750, 1334)
    ctx.drawImage('../../images/share/bg.png', 0, 0, 750, 1334) // 被背景图

    ctx.drawImage('../../images/share/bg-top.png', 8, 270, 732, 594) // 上面白色
    ctx.drawImage('../../images/share/bg-bottom.png', 8, 842, 732, 324) // 下面白色
    ctx.drawImage('../../images/share/bg-middle.png', 175, 812, 8, 71) // 左竖条
    ctx.drawImage('../../images/share/bg-middle.png', 565, 812, 8, 71) // 又竖条

    const mainTmpPath = await this.getImageTmpPath(this.data.baseData.bg)
    ctx.drawImage(mainTmpPath, 90, 350, 570, 254)
    
    ctx.font = 'normal bold 32px sans-serif';
    ctx.setFontSize(32)
    ctx.setTextAlign('left')
    ctx.setFillStyle('#3C2527')
    ctx.fillText(this.data.baseData.title.substr(0, 15), 90, 680)

    ctx.font = 'normal normal 26px sans-serif';
    ctx.fillText(this.data.baseData.endTime + '活动结束', 90, 728)

    ctx.font = 'normal bold 30px sans-serif';
    ctx.setTextAlign('left')
    ctx.fillText('已参团用户', 300, 921)

    ctx.font = 'normal normal 22px sans-serif';
    ctx.setTextAlign('center')
    ctx.setFillStyle('#8F7276')
    ctx.fillText(`当前参团用户人数：${this.data.baseData.nowPerson}/${this.data.baseData.allPerson}`, 375, 1082)

    ctx.setFontSize(24)
    ctx.setFillStyle('#FFFFFF')
    ctx.setTextAlign('left')
    ctx.fillText('扫描二维码加入我的战队', 184, 1197)
    ctx.fillText('这里礼品很多，一起来赢礼品吧', 184, 1241)
    // 二维码
    const erCodeTmpPath = await this.getImageTmpPath(this.data.erCodeUrl)
    ctx.drawImage(erCodeTmpPath, 40, 1164, 122, 122 )

    /** 参团用户头像 */
    function drawCircleAwatar (path, index) { // 绘制头像方法
      return new Promise(async (resolve) => {
        if (index !=5 ) {
          let avatarurl_width = 86;    //绘制的头像宽度
          let avatarurl_heigth = 86;   //绘制的头像高度
          let avatarurl_x = 90 + index * 114;   //绘制的头像在画布上的位置
          let avatarurl_y = 958;   //绘制的头像在画布上的位置
          ctx.save()
          ctx.beginPath()
          ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false);
          ctx.clip()
          let avatarTmpPath = await that.getImageTmpPath(path)
          ctx.drawImage(avatarTmpPath, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth)
          ctx.restore();
          ctx.beginPath()

          ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, 0, Math.PI * 2, false)
          ctx.setStrokeStyle('#D9D9D9')
          ctx.stroke()

          console.log('第' + index + '个圆结束了')
          resolve()
        } else {
          let avatarurl_width = 86;    //绘制的头像宽度
          let avatarurl_heigth = 86;   //绘制的头像高度
          let avatarurl_x = 90 + index * 114;   //绘制的头像在画布上的位置
          let avatarurl_y = 958;   //绘制的头像在画布上的位置
          ctx.save()
          ctx.beginPath()
          ctx.arc(avatarurl_width / 2 + avatarurl_x, avatarurl_heigth / 2 + avatarurl_y, avatarurl_width / 2, Math.PI * 0.455, Math.PI * 1.545, false);
          ctx.clip()
          let avatarTmpPath = await that.getImageTmpPath(path)
          ctx.drawImage(avatarTmpPath, avatarurl_x, avatarurl_y, avatarurl_width, avatarurl_heigth)
          ctx.restore();
          console.log('第' + index + '个圆结束了')
          resolve()
        }
      })
    }
    function draw2 (list, index) { // 递归判断逻辑
      return new Promise(async (resolve) => {
        index ++
        if (list.length > index && index < 6) {
          let m = await drawCircleAwatar(list[index].url, index)
          let mm = await draw2(list, index)
          resolve(mm)
        } else {
          resolve()
        }
      })
    }
    let m1 = await draw2(this.data.baseData.personImg, -1) // 使用递归循环画头像
    /** 用户头像绘制结束 */

    ctx.draw(true, () => {
      console.log('画完了')
      this.canvasToImage()
    })
  },
  canvasToImage () {
    let that = this
    wx.canvasToTempFilePath({
      x: 0,
      y: 0,
      width: 750,
      height: 1334,
      canvasId: 'myCanvas',
      success: function(res) {
        console.log('转换成功了')
        that.setData({
          sharePicTmpPath: res.tempFilePath
        })
        wx.hideLoading();
        // that.checkPermission()
      } 
    })
  },
  checkPermission () {
    let that = this
    wx.getSetting({
      success(res) {
        console.log(res.authSetting)
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              that.saveSharePic()
            },
            fail () {
              wx.showToast({
                title: '保存失败，需要在设置界面授予权限后方可保存图片！',
                icon: 'none',
                image: '',
                duration: 1500,
                mask: true,
                success: (result)=>{
                  // wx.openSetting({
                  //   success(res) {
                  //     console.log(res.authSetting)
                  //     // res.authSetting = {
                  //     //   "scope.userInfo": true,
                  //     //   "scope.userLocation": true
                  //     // }
                  //   }
                  // })
                }
              })
            }
          })
        } else {
          that.saveSharePic()
        }
      }
    })
  },
  saveSharePic () {
    let that = this
    wx.showLoading({
      title: "正在保存图片……",
      mask: true,
      success: (result)=>{
        
      },
      fail: ()=>{},
      complete: ()=>{}
    });
    wx.saveImageToPhotosAlbum({
      filePath: this.data.sharePicTmpPath,
      success(res) {
        wx.showToast({
          title: '保存成功,可以去发朋友圈啦！',
          icon: 'none',
          image: '',
          duration: 1500,
          mask: false,
          success: (result)=>{
            setTimeout(() => {
              wx.hideLoading();
            }, 1500)
          },
          fail: ()=>{},
          complete: ()=>{}
        });
      }
    })
  }
})