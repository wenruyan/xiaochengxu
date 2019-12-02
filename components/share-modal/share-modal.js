import regeneratorRuntime from '../../libs/regenerator-runtime/runtime'; // 使用async/await必须引入
const app = getApp()
Component({
  properties: {
    modalShow: {
      type: Boolean,
      value: false
    },
    floatUp: {
      type: Object,
      value: {}
    },
    openingConfigId: {
      type: String,
      value: ''
    },
    showStatus: {
      type: Boolean,
      value: false
    },
    activityId: {
      type: String,
      value: ''
    },
    showSave: {
      type: Boolean,
      value: false
    },
    myProperty: {
      type: String,
      value: ""
    },
    myTitle: {
      type: String,
      value: ""
    },
    myContent: {
      type: String,
      value: ""
    }
  },
  data: {
    sharePicTmpPath: '',
    height: '',
    ctx: '',
    remoteKey: ''
  },
  /**
   * 组件的方法列表
   */
  methods: {
    hideModal() {
      this.setData({
        modalShow: false
      })
    },
    // 显示分享模态框
    async showShareModal1() {
      console.log(22222222222)
      wx.showLoading({
      title: '加载中',
      mask: true
    })
    let page;
    let info;
      if (app.globalData.page == 'details') {
        this.setData({
          height: '1220px'
        })
        let str = {
          page: 'details',
          shareId: app.globalData.shareId,
          shareType: app.globalData.shareType
        }
        let key = await app.saveStrToRemote(JSON.stringify(str))
        // info = 'details' + ',' + app.globalData.shareId + ',' + app.globalData.shareType + ',' + app.globalData.shareSkuid + ',' + app.globalData.shareIndex;
        info = key.data.param
        if (this.data.ctx) {
          this.data.ctx.clearRect()
        }
      } else {
        // 主页
        this.setData({
          height: '1334px'
        })
        info = '11'
      }
      app.http.post('focus.getPraiseQRCode', {
        scene: info,
        width: 5,
        lineColor: '',
        page: 'pages/index/index',
        isHyaline: false,
      }).then((res) => {
        console.log('pathr', res)
        this.setData({
          erCodeUrl: res.data.path
        })
        if (app.globalData.page == 'details') {
          this.showDetailsImg()
        } else {
          this.showIndexImg()
        }
        
      }).catch(err => {
        console.log(err.status, err.message)
      })
    },
    closeSave() {
      this.setData({
        showStatus: false
      })
    },
    async showIndexImg() {
      console.log('首页分享')
      const that = this
      that.data.ctx = wx.createCanvasContext('myCanvas', that)
      that.data.ctx.drawImage('../../images/normal_share_large.png', 0, 0, 375 * 2, 667 * 2) // 被背景图

      // ctx.drawImage('../../images/erweima.png', 153 * 2, 559 * 2, 71 * 2, 71 * 2) // 二维码
      // 二维码
      const erCodeTmpPath = await this.getImageTmpPath(that.data.erCodeUrl)
      that.data.ctx.drawImage(erCodeTmpPath, 153 * 2, 559 * 2, 71 * 2, 71 * 2)

      that.data.ctx.setFontSize(36)
      that.data.ctx.fillText('长按识别查看福利并领取',98 * 2, 650 * 2)
      that.data.ctx.setFillStyle('#1D2023')  // 文字颜色：黑色
      
      that.data.ctx.draw(true, () => {
        console.log('画完了')
        that.canvasToImage()
      })
      console.log(666666666)
    },
    async showDetailsImg() {
      console.log('详情页分享')
      const that = this
      that.data.ctx = wx.createCanvasContext('myCanvas',that)
      // ctx.clearRect(0, 0, 750, 1220)
      that.data.ctx.drawImage('../../images/benifit_share.png', 0, 0, 375 * 2, 610 * 2) // 被背景图

      const dingImg = await this.getImageTmpPath(that.data.myProperty)
      that.data.ctx.drawImage(dingImg, 15 * 2, 29 * 2, 345 * 2, 184 * 2) // 顶图

      that.data.ctx.font = 'normal bold 48px sans-serif';
      that.data.ctx.setFontSize(48)
      that.data.ctx.setFillStyle('#1D2023')  // 文字颜色：黑色
      that.data.ctx.fillText(that.data.myTitle, 28 * 2, 248 * 2)

      that.data.ctx.font = 'normal normal 26px sans-serif';
      that.data.ctx.setFontSize(13 * 2)
      that.data.ctx.setFillStyle('#606972')
      that.drawText(that.data.ctx, that.data.myContent, 28 * 2, 276 * 2, 59, 310 * 2)

      // that.data.ctx.drawImage('../../images/erweima.png', 41 * 2, 342 * 2, 108 * 2, 108 * 2) // 二维码
      // 二维码
      const erCodeTmpPath = await this.getImageTmpPath(this.data.erCodeUrl)
      that.data.ctx.drawImage(erCodeTmpPath, 41 * 2, 342 * 2, 108 * 2, 108 * 2)

      that.data.ctx.font = 'normal bold 32px sans-serif';
      that.data.ctx.fillText('这张卡谁不爱', 186 * 2, 368 * 2)
      that.data.ctx.setFillStyle('#1D2023')  // 文字颜色：黑色
      that.data.ctx.setFontSize(32)

      

      that.data.ctx.setFillStyle('#FF580E')
      that.data.ctx.fillRect(186 * 2, 395 * 2, 148 * 2, 30 * 2);//添加一个长度为200px、宽度为为100px的矩形路径到当前路径

      that.data.ctx.font = 'normal normal 24px sans-serif';
      that.data.ctx.setFillStyle('#fff')  // 文字颜色：黑色
      that.data.ctx.fillText('长按识别查看福利并领取', 193 * 2, 415 * 2)

      that.data.ctx.draw(true, () => {
        console.log('画完了')
        that.canvasToImage()
      })
      console.log(666666666)
    },
    canvasToImage() {
      let that = this
      wx.canvasToTempFilePath({
        x: 0,
        y: 0,
        width: 750,
        height: app.globalData.page == 'index' ? 1334: 1220,
        canvasId: 'myCanvas',
        success: function (res) {
          console.log('转换成功了')
          console.log(res)
          that.setData({
            sharePicTmpPath: res.tempFilePath
          })
          that.setData({
            showStatus: true
          })
          wx.hideLoading()
        }
      },that)
    },
    checkPermission () {
      console.log('保存图片')
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
      success:(res) => {
        wx.showToast({
          title: '已保存到相册,可以去发图啦！',
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
        this.setData({
          modalShow: false,
          showStatus: false
        })
      }
    })
  },
    getImageTmpPath(url) {
      let that = this;
      return new Promise((resolve, reject) => {
        if (url.substr(0, 4) == 'http') {
          console.log(11111111)
          console.log(url)
          wx.getImageInfo({
            src: url, //服务器返回的带参数的小程序码地址
            success: (res) => {
              //res.path是网络图片的本地地址
              resolve(res.path)
            },
            fail: function (res) {
              //失败回调
              reject(res.errMsg)
            }
          });
        } else {
          resolve(url)
        }
      })
    },
    // canvs 文字换行
    drawText(ctx, str, leftWidth, initHeight, titleHeight, canvasWidth) {
      var lineWidth = 0;
      var lastSubStrIndex = 0; //每次开始截取的字符串的索引 
      for (let i = 0; i < str.length; i++) {
        lineWidth += ctx.measureText(str[i]).width;
        if (lineWidth > canvasWidth) {
          ctx.fillText(str.substring(lastSubStrIndex, i), leftWidth, initHeight); //绘制截取部分                
          initHeight += 25; //16为字体的高度                
          lineWidth = 0;
          lastSubStrIndex = i;
          titleHeight += 30;
        }
        if (i == str.length - 1) { //绘制剩余部分                
          ctx.fillText(str.substring(lastSubStrIndex, i + 1), leftWidth, initHeight);
        }
      }        // 标题border-bottom 线距顶部距离        
      titleHeight = titleHeight + 10;
      return titleHeight
    }
  }
})