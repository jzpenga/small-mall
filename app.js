//app.js
import util from './utils/util'
import http from '@chunpu/http'
import Ready from 'min-ready'

const ready = Ready()

App({
  onLaunch: function () {
    this.getNavHeight();
    this.login();
  },
  getNavHeight(){
    wx.getSystemInfo({
      success: res => {
        //导航高度
        this.globalData.navHeight = res.statusBarHeight + 46;
      }, fail(err) {
        console.log(err);
      }
    })
  },
  login(){
    util.promisify(wx.checkSession)().then(() => {
      console.log('session 生效')
      return this.getUserInfo()
    }).then(userInfo => {
      console.log('登录成功', userInfo)
    }).catch(err => {
      console.log(`自动登录失败, 重新登录`, err);
      return this.loginServer();
    }).catch(err => {
      console.log(`手动登录失败`, err)
    })
  },
  loginServer() {
    console.log('登录')
    return util.promisify(wx.login)().then(({ code }) => {
      console.log(`code: ${code}`)
      return http.post('/app/session/auth', {
        code,
        type: 'wxapp'
      }).then((response) => {
        //授权成功保存用户信息
        const { data } = response;
        wx.setStorageSync('token', data.token);
        wx.setStorageSync('openid',data.openid);
      }).catch(err => {
        console.log(err)
      })
    }).then(() => {
      return this.getUserInfo()
    })
  },
  getUserInfo() {
    return http.get('/app/session/userInfo').then(response => {
      let { data } = response;
      if (data && typeof data === 'object') {
        this.globalData.userInfo = data
        ready.open()
        return data
      }
      return Promise.reject(response)
    })
  },
  ready(func) {
    ready.queue(func)
  },
  globalData: {
    userInfo: null,
    navHeight: 0
  }
})
