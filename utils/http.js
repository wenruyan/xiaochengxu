import { config } from '../config.js'
import Fly from '../libs/flyio.js'

let fly = new Fly(); //创建fly实例
fly.config.baseURL = config.apiHost
if (config.env == 'dev') { // 测试/开发环境
  fly.config.baseURL = config.devApiHost
}
fly.interceptors.request.use((request)=>{
  //给所有请求添加自定义header
  if(request.method == 'POST') {
    request.headers["X-Tag"]="flyio";
    const openId = getApp().globalData.openId
    const unionId = getApp().globalData.unionId
    const userId = getApp().globalData.userId
    let lastOpenId = 'AAAA' // openId后四位
    if (openId) {
      lastOpenId = openId.substr(openId.length - 4, 4)
    }
    request.url += '/' + lastOpenId
    if (unionId) {
      request.body.unionId = unionId;
    }
    if (openId) {
      request.body.openid = openId;
    }
    if (userId) {
      request.body.userId = userId;
      // request.body.userId = '2570600471265794';
    }
    request.body.mid = config.mid;
  }
  //打印出请求体
  console.log(request.url + '接口请求报文', request.body);
  //终止请求
  //var err=new Error("xxx")
  //err.request=request
  //return Promise.reject(new Error(""))

  //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
  return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
  (response) => {
    console.log(response.request.url + '接口返回报文', response.data);
    //只将请求结果的data字段返回
    return response.data
  },
  (err) => {
    console.log('网络出错', err);
    // wx.showToast({
    //   icon: 'none',
    //   title: '网络出错'
    // });
    //发生网络错误后会走到这里
    //return Promise.resolve("ssss")
  }
)
module.exports = {
  fly
}
