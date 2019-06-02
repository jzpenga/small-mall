var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import http from '@chunpu/http'
var app = getApp();

Page({
  data: {
    navH: getApp().globalData.navHeight,
    addressList: [],
    openType: ''
  },
  onLoad: function(options) {
    // 页面初始化 options为页面跳转所带来的参数
    //this.getAddressList();
    this.setData({
      openType: options.openType
    })
  },
  onReady: function() {
    // 页面渲染完成
  },
  onShow: function() {
    // 页面显示
    this.getAddressList();
  },
  getAddressList() {
    let that = this;
    http.get(`${api.ShippingList}`).then(function(res) {
      if (res.responseCode === 200) {
        that.setData({
          addressList: [...res.data]
        });
      }
    });
  },
  addressAddOrUpdate(event) {
    wx.navigateTo({
      url: '/pages/shipping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
    })
  },
  selectAddress(event) {
    if (this.data.openType) {
      wx.navigateTo({
        url: '/pages/shipping/addressAdd/addressAdd?id=' + event.currentTarget.dataset.addressId
      })
      return false;
    } else {
      console.log(event.currentTarget.dataset.addressId);
      try {
        wx.setStorageSync('addressId', event.currentTarget.dataset.addressId);
      } catch (e) {

      }

      //选择该收货地址
      wx.redirectTo({
        url: '/pages/shipping/checkout/checkout'
      })
    }



  },
  onHide: function() {
    // 页面隐藏
  },
  onUnload: function() {
    // 页面关闭
  }
})