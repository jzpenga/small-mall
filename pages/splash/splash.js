// pages/ucenter/ucenter.js
import http from '@chunpu/http';
import * as api from '../../config/api.js';

//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: getApp().globalData.navHeight,
    userInfo: app.globalData.userInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    showAuthDialog:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    const that = this;
    wx.getSetting({
      success(res) {
        console.log(res);
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo)
              http.post(api.BindUserInfo, res.userInfo).then(() => {
                return app.getUserInfo().then(userInfo => {
                  that.setData({
                    userInfo: userInfo
                  })
                  wx.navigateTo({
                    url: '../index/index',
                  })
                })
              })
            }
          })
        }else{
          //
          console.log('需要授权');
          that.setData({
            showAuthDialog:true
          })
        }
      }
    })

    app.ready(() => {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    })
  },
  bindUserInfo(e) {
    var detail = e.detail
    if (detail.userInfo) {
      http.post(api.BindUserInfo, detail.userInfo).then(() => {
        return app.getUserInfo().then(userInfo => {
          this.setData({
            userInfo: userInfo
          })
          wx.navigateTo({
            url: '../index/index',
          })
        })
      })
    }
  },
  bindPhoneNumber(e) {
    var detail = e.detail
    console.log({ detail })
    if (detail.iv) {
      http.post('/user/bindphone', {
        encryptedData: detail.encryptedData,
        iv: detail.iv
      }).then(() => {
        return app.getUserInfo().then(userInfo => {
          this.setData({
            userInfo: userInfo
          })
        })
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  onShowAuthDialogClose(){
    this.setData({
      showAuthDialog:false
    })
  }

})