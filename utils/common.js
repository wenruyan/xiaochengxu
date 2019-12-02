import dayjs from '../libs/dayjs.js'
const uuid = (len, radix) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  var uuid = [],
    i;
  radix = radix || chars.length;
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    var r;
    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';
    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }
  return uuid.join('');
}
const decodeURL = url => {
  return decodeURIComponent(url)
}
const encodeURL = url => {
  return encodeURIComponent(url)
}
const formatTime = date => { // 标准时间格式 YYYY-MM-DD HH:mm:ss
  return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
}
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const regMobile = mobile => {
  let reg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  return reg.test(mobile)
}
const common = {
  uuid,
  decodeURL,
  encodeURL,
  formatTime,
  formatNumber,
  regMobile
}
module.exports = {
  common
}