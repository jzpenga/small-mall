var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
const pay = require('../../../services/pay.js');
import http from '@chunpu/http'
var app = getApp();

Page({
  data: {
    navH: getApp().globalData.navHeight,
    checkedGoodsList: [],
    checkedAddress: {},
    goodsTotalPrice: 0.00, //商品总价
    orderTotalPrice: 0.00,  //订单总价
    actualPrice: 0.00,     //实际需要支付的总价
    addressId: 0
      },
  onLoad: function (options) {

    // 页面初始化 options为页面跳转所带来的参数

    try {
      var addressId = wx.getStorageSync('addressId');
      if (addressId) {
        this.setData({
          'addressId': addressId
        });
      }
    } catch (e) {
      // Do something when catch error
    }


  },
  getCheckoutInfo: function () {
    // let that = this;
    // util.request(api.CartCheckout, { addressId: that.data.addressId}).then(function (res) {
    //   if (res.errno === 0) {
    //     console.log(res.data);
    //     that.setData({
    //       checkedGoodsList: res.data.checkedGoodsList,
    //       checkedAddress: res.data.checkedAddress,
    //       actualPrice: res.data.actualPrice,
    //       checkedCoupon: res.data.checkedCoupon,
    //       freightPrice: res.data.freightPrice,
    //       goodsTotalPrice: res.data.goodsTotalPrice,
    //       orderTotalPrice: res.data.orderTotalPrice
    //     });
    //   }
    //   wx.hideLoading();
    // });


    let that = this;
    http.get(`${api.OrderComfirm}?shippingId=${this.data.addressId}`).then(function (res) {
      if (res.responseCode === 200) {
        that.setData({
          checkedAddress: res.data.shipping,
          actualPrice: res.data.payment,
          goodsTotalPrice: res.data.payment,
          orderTotalPrice: res.data.payment,
          checkedGoodsList: res.data.cartList
        });
      }
      wx.hideLoading();
    });
  },
  selectAddress() {
    wx.navigateTo({
      url: '/pages/shipping/address/address',
    })
  },
  addAddress() {
    wx.navigateTo({
      url: '/pages/shipping/addressAdd/addressAdd',
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    wx.showLoading({
      title: '加载中...',
    })
    this.getCheckoutInfo();

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  submitOrder: function () {
    if (this.data.addressId <= 0) {
      util.showErrorToast('请选择收货地址');
      return false;
    }

    let that = this;
    let param = {
      shippingId:this.data.addressId,
      payType:1
    }
    http.post(`${api.OrderSubmit}`,param).then(function (res) {
      if (res.responseCode === 200) {
        wx.redirectTo({
            url: '/pages/orders/order'
        });
      }
      wx.hideLoading();
    });

    // util.request(api.OrderSubmit, { addressId: this.data.addressId, couponId: this.data.couponId }, 'POST').then(res => {
    //   if (res.errno === 0) {
    //     const orderId = res.data.orderInfo.id;
    //     pay.payOrder(parseInt(orderId)).then(res => {
    //       wx.redirectTo({
    //         url: '/pages/payResult/payResult?status=1&orderId=' + orderId
    //       });
    //     }).catch(res => {
    //       wx.redirectTo({
    //         url: '/pages/payResult/payResult?status=0&orderId=' + orderId
    //       });
    //     });
    //   } else {
    //     util.showErrorToast('下单失败');
    //   }
    // });


  }
})