const config = {
  mid: '2510005310975000', // 该小程序在focus数据库中对应的mid,需要更换为乐业权益的小程序mid
  env: "dev", // dev => 测试/开发环境   prd => 生产环境
  apiHost: "https://procedure.leyeka.com/api/",  // 生产环境的api地址，尽量别修改
  devApiHost: "http://procedureuat.leyeka.com/api/",
  // devApiHost: "http://210.22.122.126:13000/",
  // devApiHost: "https://dietcoke.focus-base.com/",
  // devApiHost: "http://procedureuat.leyeka.com/api/",
  // devApiHost: "http://erikdeleyeuat.focus-base.com:3101",
  // devApiHost: "http://192.168.31.201:3000/" // 于哲
  // devApiHost: "http://192.168.31.248:3000/" // 李亮
  // devApiHost: "http://192.168.33.202:3000/" // 测试
  // devApiHost: "http://192.168.31.174:3000/" // 杨林
}
module.exports = { config }