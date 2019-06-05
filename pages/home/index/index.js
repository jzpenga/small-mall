//index.js
const util = require('../../../utils/util.js');
const api = require('../../../config/api.js');
import { $stopWuxRefresher, $stopWuxLoader } from '../../../components/vux-weapp/index';
import http from '@chunpu/http'
//获取应用实例
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
  },
  data: {
    scrollTop: 0,
    navH: app.globalData.navHeight,
    banner: [],
    productList:[],
    hotProductList:[],
    newProductList: [],
    pageNo:0,
    totalPages:0,
    currentIndex:0,
    showMenu:false,
    menuItemList:[
      { name: '个人信息', url:'../ucenter/info/info',icon:'my'},
      { name: '购物车', url: '../cart/index/index',icon: 'cart' },
      { name: '订单', url: '../ucenter/orders/order', icon: 'form' },
      { name: '收货地址', url: '../shipping/address/address?openType=list', icon: 'location' },
      { name: '客服中心', url: '', icon: 'service'},
      { name: '设置', url: '', icon: 'settings' }
      ]

  },

 
  lifetimes: {
    attached : function () {
      this.getBannerList();
      this.getProductHotList();
      this.getProductNewList();
      //this.getProductList(0);
    }
  },
  
  methods: {
    handleImgChange: function (e) {
      this.setData({
        currentIndex: e.detail.current
      })
    },
    addToCart:function(e){
      

      http.post(api.AddToCart, { productId: e.target.dataset.id, quantity: 1 }).then((res) => {
        let _res = res;
        if (_res.responseCode == 200) {
          wx.showToast({
            title: '添加成功'
          });
        } else {
          wx.showToast({
            image: '/static/images/icon_error.png',
            title: _res.responseMsg,
            mask: true
          });
        }
      })
    },
    getProductList: function (pageNo) {
      let that = this;
      http.get(`${api.ProductListUrl}?pageNo=${pageNo}&pageSize=${5}`).then(function (res) {
        if (res.responseCode === 200) {
          that.setData({
            productList: [...that.data.productList, ...res.data.content],
            pageNo: that.data.pageNo + 1,
            totalPages: res.data.totalPages
          });
        }
      });
    },
    getProductHotList: function () {
      let that = this;
      http.get(`${api.ProductHotList}`).then(function (res) {
        if (res.responseCode === 200) {
          that.setData({
            hotProductList: [...res.data.content]
          });
        }
      });
    },
    getProductNewList: function () {
      let that = this;
      http.get(`${api.ProductNewList}`).then(function (res) {
        if (res.responseCode === 200) {
          that.setData({
            newProductList: [...res.data.content]
          });
        }
      });
    },
    getBannerList: function () {
      let that = this;
      http.get(`${api.BannerList}`).then(function (res) {
        if (res.responseCode === 200) {
          console.log(res.data);
          that.setData({
            banner: [...res.data]
          });
        }
      });
    },
    closeMenu(e) {
      this.setData({
        showMenu: false
      })
    },
    toggerMenu(e) {
      this.setData({
        showMenu: !this.data.showMenu
      })
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
      this.getBannerList();
      this.getProductHotList();
      this.getProductNewList();
      setTimeout(() => {
        $stopWuxRefresher('#baokuan')      
      }, 2000)
    },
    onLoadmore() {
      console.log('onLoadmore')
    }
  },
  
  // onReachBottom(){
  //   if (this.data.pageNo <= this.data.totalPages){
  //     this.getProductList(this.data.pageNo);
  //   }
  // },
 
})
