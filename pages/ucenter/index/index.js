// pages/ucenter/ucenter.js
import http from '@chunpu/http';
import * as api from '../../../config/api.js'
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    navH: getApp().globalData.navHeight,
    iconList: [
      {
      icon: 'form',
      color: 'red',
      badge: 120,
      name: '我的订单'
    }, {
      icon: 'location',
      color: 'orange',
      badge: 1,
      name: '自提点'
    }, {
      icon: 'addressbook',
      color: 'yellow',
      badge: 0,
      name: '地址管理'
    }, {
      icon: 'service',
      color: 'olive',
      badge: 22,
      name: '联系客服'
    }, {
      icon: 'edit',
      color: 'cyan',
      badge: 0,
      name: '用户反馈'
    }],
    userInfo: app.globalData.userInfo,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    app.ready(() => {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    })
  },
  bindUserInfo: function (e) {
    var detail = e.detail
    if (detail.userInfo) {
      http.post(api.BindUserInfo, detail.userInfo).then(() => {
        return app.getUserInfo().then(userInfo => {
          this.setData({
            userInfo: userInfo
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})