var util = require('../../utils/util.js');
var api = require('../../config/api.js');
import http from '@chunpu/http'

var app = getApp()
var lastFetchId = 0;
Page({
  data: {
    navH: getApp().globalData.navHeight,
    keywrod: '',
    searchStatus: false,
    goodsList:[],
    historyKeyword: []
  },
  onLoad: function () {
    let historyKeyword = wx.getStorageSync('historyKeyword');
    historyKeyword = historyKeyword ? historyKeyword : [];
    this.setData({
      historyKeyword: historyKeyword
    })
  },
  onSearch: function (){

  },
  onCancel: function (){

  },
  onChange: function (e){
    if(!e.detail){
      this.setData({
        goodsList: [],
        keywrod:'',
        searchStatus: false
      });
      return;
    }
    this.searchGoodList(e.detail);
  },
  searchGoodList: function (name){
    this.setData({
      keywrod: name,
      searchStatus: true
    });
    lastFetchId += 1;
    const fetchId = lastFetchId;
    let that = this;
    http.get(`${api.ProductSearch}?name=${name}`).then(function (res) {
      if (res.responseCode === 200) {
        if (fetchId !== lastFetchId) { // for fetch callback order
          return;
        }
        that.setData({
          goodsList: [...res.data],
          searchStatus: false
        });
      } else {
        that.setData({
          goodsList: [],
          searchStatus: false
        });
      }
    });
  },
  clearHistory:function(e){
    wx.removeStorageSync('historyKeyword')
    this.setData({
      historyKeyword: []
    })
  },
  onKeywordTap:function (e){
    this.searchGoodList(e.target.dataset.keyword)
  },
  toDetail:function(e){
    let item = e.currentTarget.dataset.keyword;
    let historyKeyword = wx.getStorageSync('historyKeyword');
    historyKeyword = historyKeyword ? historyKeyword : [];
    if (historyKeyword.indexOf(item.name)<0) {
      historyKeyword = [...historyKeyword, item.name]
      wx.setStorageSync("historyKeyword", historyKeyword);
      this.setData({
        historyKeyword: historyKeyword
      })
    }
    wx.navigateTo({
      url: `/pages/goods/goods?id=${item.id}`,
    })
  }
})
