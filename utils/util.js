import http from '@chunpu/http'
import * as config from '../config/api.js';

const qs = http.qs

http.init({
  baseURL: config.ApiRootUrl,
  wx
})

http.interceptors.response.use(response => {
  // 展开 response.data 并处理错误 code
  var { data } = response
  if (data && typeof data === 'object') {
    Object.assign(response, data)
    const { responseCode } = data;
    if (responseCode !== 200) {
      return Promise.reject(new Error(data.message || 'error'))
    }
  }
  return response;
})



http.interceptors.request.use(config => {
  // 给请求带上 token
  return util.promisify(wx.getStorage)({
    key: 'token'
  }).catch(() => { }).then(res => {
    if (res && res.data) {
      Object.assign(config.headers, {
        Authorization: 'Bearer ' + res.data
      })
    }
    return config
  })
})

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const promisify = (original) => {
  return function (opt) {
    return new Promise((resolve, reject) => {
      opt = Object.assign({
        success: resolve,
        fail: reject
      }, opt)
      original(opt)
    })
  }
}


function redirect(url) {
  //判断页面是否需要登录
  if (false) {
    wx.redirectTo({
      url: '/pages/auth/'
    });
    return false;
  } else {
    wx.redirectTo({
      url: url
    });
  }
}

function showErrorToast(msg) {
  wx.showToast({
    title: msg,
    image: '/static/images/icon_error.png'
  })
}

var util = module.exports = {
  formatTime: formatTime,
  promisify,
  showErrorToast: showErrorToast
}
