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
    TabCur: 0,
    scrollLeft: 0,
    tabList: [
      {
        index:0,
        id: -1,
        name: '全部订单'
      }, {
        index: 1,
        id: 0,
        name: '待付款'
      }, {
        index: 2,
        id: 2,
        name: '待收货'
      },
      {
        index: 3,
        id: 3,
        name: '待评价'
      }
    ],
    orderList:[],
    pageNo:0,
    totalPages: 0
  },
  tabSelect(e) {
    if (e.currentTarget.dataset.id === this.data.TabCur) return false;
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60,
      orderList: [],
      pageNo: 0,
      totalPages: 0
    })
    this.getOrderList(this.data.pageNo);
  },
  getOrderList: function (pageNo) {
    let that = this;
    const status = this.data.tabList[this.data.TabCur].id;
    const param = {
      pageNo:pageNo,
      pageSize:10,
      status:status === -1 ? '' : status
    };
    http.post(`${api.OrderList}`,param).then(function (res) {
      if (res.responseCode === 200) {
        that.setData({
          orderList: [...that.data.orderList, ...res.data.content],
          pageNo: that.data.pageNo + 1,
          totalPages: res.data.totalPages
        });
      }
    });
  },
  payOrder() {
    wx.redirectTo({
      url: '/pages/pay/pay',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    this.getOrderList(this.data.pageNo)
  }


})