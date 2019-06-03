var util = require('../../utils/util.js');
var api = require('../../config/api.js');
import http from '@chunpu/http';
import { $stopWuxRefresher, $stopWuxLoader } from '../../components/vux-weapp/index';

const app = getApp();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    categoryParentId: {
      type: String,
      value: '-1'
    }
  },
  data: {
    scrollTop: 0,
    navH: app.globalData.navHeight,
    navList: [{ id: -1, name: '默认' }],
    categoryList: [],
    currentCategory: {},
    productList: [],
    scrollLeft: 0,
    goodsCount: 0,
    scrollHeight: 0,
    pageNo:0,
    totalPages:0
  },
  attached: function () {
    this.getCatalog();
    this.getProductList(0, '', this.properties.categoryParentId);
  },
  methods: {
    getCatalog: function () {
      //CatalogList
      let that = this;
      wx.showLoading({
        title: '加载中...',
      });
      http.get(`${api.CategoryList}?id=${this.properties.categoryParentId}`).then(function (res) {
        if (res.responseCode === 200) {
          that.setData({
            navList: [...that.data.navList, ...res.data],
            currentCategory: that.data.navList[0]
          });
          wx.hideLoading();
        }
      });

    },
    getProductList: function (pageNo, categoryId, categoryParentId) {
      let that = this;
      const param = {
        pageNo: pageNo,
        pageSize: 10,
        categoryId: categoryId,
        categoryParentId: categoryParentId
      }
      http.post(`${api.ProductListUrl}`, param).then(function (res) {
        if (res.responseCode === 200) {
          that.setData({
            productList: [...that.data.productList, ...res.data.content],
            pageNo: that.data.pageNo + 1,
            totalPages: res.data.totalPages
          });
        }
      });
    },
    switchCate: function (event) {
      var that = this;
      var currentTarget = event.currentTarget;
      var id = event.currentTarget.dataset.id;
      if (this.data.currentCategory.id == id) {
        return false;
      }
      this.setData({
        currentCategory: { id: id },
        productList: [],
        pageNo: 0,
        totalPages: 0
      })
      this.getProductList(0, id === -1 ? '' : id, this.properties.categoryParentId);
      //this.getCurrentCategory(event.currentTarget.dataset.id);
    },
    onPageScroll(e) {
      this.setData({
        scrollTop: e.scrollTop
      })
    },
    onPulling() {
      console.log('onPulling')
    },
    onRefresh() {
      //console.log('onRefresh')
      this.setData({
        navList: [{ id: -1, name: '默认' }],
        categoryList: [],
        currentCategory: {},
        productList: [],
        scrollLeft: 0,
        scrollTop: 0,
        goodsCount: 0,
        scrollHeight: 0
      });
      this.getCatalog();
      this.getProductList(0, '', this.properties.categoryParentId);
      setTimeout(() => {
        $stopWuxRefresher('#category')
      }, 2000)
    },
    onLoadmore() {
      console.log('onLoadmore')
    }
  }
  
})