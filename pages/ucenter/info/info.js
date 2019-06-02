import http from '@chunpu/http'

const app = getApp();

Page({
  data: {
    navH: app.globalData.navHeight,
    userInfo: null
  },
  onLoad:function(){
    this.getUserInfo();
  }, 
  getUserInfo() {
    const that = this;
   http.get('/app/session/userInfo').then(response => {
      let { data } = response;
      if (data && typeof data === 'object') {
        that.setData({
          userInfo:data
        })
      }
      
    })
  },
})