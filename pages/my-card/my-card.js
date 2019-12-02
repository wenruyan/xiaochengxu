// pages/my-card/my-card.js
const app = getApp()
import {
	$stopWuxRefresher
} from '../../libs/wux/index'
Page({
	...app.pageFunc, // 引入页面跳转的方法
	/**
	 * 页面的初始数据
	 */
	data: {
		...app.pageData,
		currentTab: true,
		myBuy10: [],
		myBuy20: [],
		myBuy30: [],
		myGet20: [],
		myGet30: [],
		buyPage: 1,
		getPage: 1,
		rows: 10,
		totalBuyPage: 1,
		totalGetPage: 1,
		myBuyTotal: 0,
		myGetTotal: 0,
		ispulling: false,
		ispullingBuy: false,
		right: [{
			text: '标记已使用',
			style: 'background-color: #FF4E47; color: white;margin-left:32rpx',
		}],
		actions: [{
			name: '标记已使用',
			color: '#fff',
			fontsize: '20',
			width: 74,
			background: '#FF4E47'
		}],
		modalShow: false,
		selectObj: {},
		tabbar: {}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		app.editTabbar();
    wx.hideTabBar();
	},
	onHide: function () {
		console.log(123)
		// if (app.globalData.pull == 'isPull') {
		//   app.globalData.pull = 'noPull'
		// }
	},
	onShow: function (options) {
		this.setData({
			buyPage: 1,
			getPage: 1,
			totalBuyPage: 1,
			totalGetPage: 1,
		})
		this.loadmyBuy()
		this.loadmyGet()
	},
	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady: function () {
		// wx.startPullDownRefresh()
	},
	/**
	 * 生命周期函数--监听页面隐藏
	 */

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload: function () {

	},
	onPulling() {
		console.log('onPulling')
	},
	onRefresh() {
		console.log('onRefresh')
		this.setData({
			buyPage: 1,
			getPage: 1,
			totalBuyPage: 1,
			totalGetPage: 1,
		})
		setTimeout(() => {
			this.onShow()
			$stopWuxRefresher('#wux-refresher')

		}, 400)
	},
	click() {
		console.log(1);
	},
	// 我买的 我领的切换
	myGet() {
		this.setData({
			currentTab: true
		})
	},
	myBuy() {
		this.setData({
			currentTab: false
		})
	},
	showModal(e) {
		this.setData({
			modalShow: true,
			selectObj: e.currentTarget.dataset['item']
		})
	},
	hideModal(){
		this.setData({
			modalShow: false
		})
	},
	onClick(e) {
		console.log(1);
		console.log(e.currentTarget.dataset['item'], 'item');
		let item = this.data.selectObj;
		app.http.post("focus.updateIsUsed", {
			orderDetailId: item.orderDetailId ? item.orderDetailId : "",
			carddetailid: item.carddetailid ? item.carddetailid : "",
			operation: "10" // 10修改状态为已使用   20 删除
		}).then((res) => {
			console.log(res, 'updateIsUsed');
			this.setData({
				buyPage: 1,
				getPage: 1,
				totalBuyPage: 1,
				totalGetPage: 1,
				modalShow: false
			})
			this.loadmyGet();
			this.loadmyBuy()
		})
	},
	join(e) {
		console.log(e.detail.target, 'jin lai le');
		if (e.detail.formId) {
			app.upFormId(e.detail.formId)
		}
		let rechargeStatus = e.detail.target.dataset.id.rechargeStatus
		let orderId = e.detail.target.dataset.id.orderId
		let orderDetailId = e.detail.target.dataset.id.orderDetailId
		console.log("rechargeStatus", rechargeStatus)
		console.log(orderDetailId)
		console.log(orderId)
		if (e.detail.target.dataset.id.orderType == 50 || e.detail.target.dataset.id.orderType == 30) {
			app.record({
				pageNo: "80", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
				operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
				operationObject: "34", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
				contentNo: orderId, // 内容ID:只有在点击快报和权益的时候才有
				contentType: "20" // 内容类型10-文章20-虚拟商品SKU
			})
		}
		if (e.detail.target.dataset.id.orderType == 50) {
			wx.navigateTo({
				url: '/pages/erweima/erweima?orderId=' + orderId + '&orderDetailId=' + orderDetailId
			})
		} else if (e.detail.target.dataset.id.orderType == 30) {
			wx.navigateTo({
				url: '/pages/directPayDesc/directPayDesc?rechargeStatus=' + rechargeStatus + '&orderId=' + orderId
			})
		} else {
			app.record({
				pageNo: "80", // 用户操作页面-10:登录页,20:注册页,30:产品页,60:小程序首页
				operationType: "30", // 用户操作行为-10:按钮,20:输入,30:页面进入
				operationObject: "21", // 用户操作对象10-点击金刚区(限时特惠,每日免单,员工内买),20-登录信息,30-确认登录,40-注册信息,50-确认注册,60-点击快报,70-点击权益,80-点击个人中心
				contentNo: e.detail.target.dataset.id.skuid, // 内容ID:只有在点击快报和权益的时候才有
				contentType: e.detail.target.dataset.id.type == 11 ? "10" : "20" // 内容类型10-文章20-虚拟商品SKU
			})
			let data = {
				userId: app.globalData.userId,
				qyId: e.detail.target.dataset.id.skuid,
				qyType: e.detail.target.dataset.id.type
			}
			app.http.post("focus.toUseSaveData", data).then((res) => {
				if (res.code == 200) {
					// wx.navigateTo({
					// 	url: '/pages/weixin-card/weixin-card'
					// })
					this.toCard()
				}
			})
		}
	},
	sortByKey(array, key) {
		return array.sort(function (b, a) {
			var x = a[key]
			var y = b[key]
			return x < y ? -1 : x > y ? 1 : 0
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage: function () {

	},
	onPullDownRefresh: function () {
		wx.showNavigationBarLoading();
		this.loadmyBuy()
	},
	onLoadmore: function () {
		console.log(123)
		if (this.currentTab) {
			this.loadmyBuy()
		} else {
			this.loadmyGet()
		}
	},
	loadmyBuy: function () {
		// console.log('=====',app.globalData.userId)
		// app.globalData.userId = '2554606506312198'  // 忠义
		// app.globalData.userId = '2554606506312195' // 李亮
		// app.globalData.userId = '2566643276644864' // 崔龙龙
		// 我买的接口查询
		if (this.data.buyPage > this.data.totalBuyPage) return false
		if (this.data.ispullingBuy) {
			return false
		} else {
			this.setData({
				ispullingBuy: true
			})
			setTimeout(() => {
				ispullingBuy: false
			}, 5000)
		}
		console.log(1)
		let params = {
			page: this.data.buyPage,
			rows: this.data.rows,
			companyNo: ""
		}
		app.http.post("focus.myBuy", params).then(res => {
			console.log(' this.data.page', this.data.buyPage, res.total)
			// res.data.rows.map(item => {
			// 	item.url = this.getSkuImg(item.picList, "40")[0]
			// })
			console.log("data", res)
			if (this.data.buyPage == 1) {
				this.setData({
					myBuy10: [],
					myBuy20: [],
					myBuy30: [],
				})
			}
			res.data.rows.map(_ => {
				_.endTime = app.moment(_.endtime).format('YYYY-MM-DD HH:mm:ss')

				if (_.orderType == 30) {
					if (_.rechargeStatus == 30) {
						_.statusTxt = "充值失败"
						this.data.myBuy30.push(_)
					} else if (_.rechargeStatus == 40) {
						_.statusTxt = "正在充值中"
						this.data.myBuy20.push(_)
					} else if (_.rechargeStatus == 10) {
						_.statusTxt = "已到账"
						this.data.myBuy10.push(_)
					}

				} else if (_.orderType == 50) {
					if (_.codeStatus == 10 && _.status == 20) {
						_.statusTxt = "已到账";
						this.data.myBuy10.push(_)
					} else if (_.codeStatus == 20) {
						_.statusTxt = "未到账";
						this.data.myBuy20.push(_)
					} else if (_.codeStatus == 30) {
						_.statusTxt = "充值失败";
						this.data.myBuy30.push(_)
					}
				}

				if (_.status == 10) {
					_.statusTxt = "快过期";
					this.data.myBuy10.push(_)
				} else if (_.status == 30) {
					_.statusTxt = "已失效";
					this.data.myBuy30.push(_)
				} else if (_.status == 40) {
					_.statusTxt = "已使用";
					this.data.myBuy30.push(_)
				}
				this.sortByKey(this.data.myBuy10, "status")
			})
			this.setData({
				myBuy10: this.data.myBuy10,
				myBuy20: this.data.myBuy20,
				myBuy30: this.data.myBuy30,
				buyPage: this.data.buyPage + 1,
				myBuyTotal: res.total,
				totalBuyPage: res.totalPage,
				ispullingBuy: false
			})
		})

	},
	loadmyGet: function () {
		// 我领的接口查询
		if (this.data.getPage > this.data.totalGetPage) return false
		if (this.data.ispulling) {
			return false
		} else {
			this.setData({
				ispulling: true
			})
			setTimeout(() => {
				ispulling: false
			}, 5000)
		}
		let params = {
			page: this.data.getPage,
			rows: this.data.rows
		}
		console.log('shen me gui');
		app.http.post("focus.LeyeMiniCardPackageList", params).then(res => {
			res.data.rows.map(item => {
				item.url = this.getSkuImg(item.picList, "40")[0]
			})
			console.log("我领的", res)
			if (!res.data.rows) {
				return false
			} else {
				if (this.data.getPage == 1) {
					this.setData({
						myGet20: [],
						myGet30: [],
					})
				}
				res.data.rows.map(_ => {
					_.endTime = app.moment(_.endtime).format('YYYY-MM-DD HH:mm:ss')
					_.create_date = app.moment(_.create_date).format('YYYY-MM-DD HH:mm:ss')
					if (_.usestatus == 100) {
						_.statusTxt = '已使用'
					} else if (_.status == 10) {
						_.statusTxt = '快过期'
					} else if (_.status == 20) {
						_.statusTxt = '已到账'
					} else {
						_.statusTxt = '已过期'
					}

					if (_.status == 30) {
						this.data.myGet30.push(_)
					} else {
						this.data.myGet20.push(_)
					}
				})
				this.setData({
					myGet20: this.data.myGet20,
					myGet30: this.data.myGet30,
					getPage: this.data.getPage + 1,
					myGetTotal: res.data.total,
					totalGetPage: res.data.totalPage,
					ispulling: false
				})
			}

		})
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