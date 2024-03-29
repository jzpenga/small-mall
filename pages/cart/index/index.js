var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
import http from '@chunpu/http'
var app = getApp();

Page({
  data: {
    navH: getApp().globalData.navHeight,
    cartGoods: [],
    cartTotal: {
      goodsCount: 0,
      goodsAmount: 0.00,
      checkedGoodsCount: 0,
      checkedGoodsAmount: 0.00
    },
    isEditCart: false,
    checkedAllStatus: true,
    editCartList: []
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数


  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示
    this.getCartList();
  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  getCartList: function () {
    let that = this;
    http.get(api.CartList).then(function (res) {
      if (res.responseCode === 200) {
        console.log(res.data);
        that.setData({
          cartGoods: res.data.cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  },
  isCheckedAll: function () {
    //判断购物车商品已全选
    return this.data.cartGoods.every(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });
  },
  checkedItem: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let that = this;

    if (!this.data.isEditCart) {
      http.post(api.CartChecked, { ids: [that.data.cartGoods[itemIndex].id], checked: that.data.cartGoods[itemIndex].checked ? 0 : 1 }).then(function (res) {
        if (res.responseCode === 200) {
          console.log(res.data);
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let tmpCartData = this.data.cartGoods.map(function (element, index, array) {
        if (index == itemIndex) {
          element.checked = !element.checked;
        }

        return element;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        cartTotal: { ...that.data.cartTotal, checkedGoodsCount: that.getCheckedGoodsCount()} 
      });
    }
  },
  getCheckedGoodsCount: function () {
    let checkedGoodsCount = 0;
    this.data.cartGoods.forEach(function (v) {
      if (v.checked === true) {
        checkedGoodsCount += v.quantity;
      }
    });
    console.log(checkedGoodsCount);
    return checkedGoodsCount;
  },
  checkedAll: function () {
    let that = this;

    if (!this.data.isEditCart) {
      var ids = this.data.cartGoods.map(function (v) {
        return v.id;
      });
      http.post(api.CartChecked, { ids:ids , checked: that.isCheckedAll() ? 0 : 1 }).then(function (res) {
        if (res.responseCode === 200) {
          console.log(res.data);
          that.setData({
            cartGoods: res.data.cartList,
            cartTotal: res.data.cartTotal
          });
        }

        that.setData({
          checkedAllStatus: that.isCheckedAll()
        });
      });
    } else {
      //编辑状态
      let checkedAllStatus = that.isCheckedAll();
      let tmpCartData = this.data.cartGoods.map(function (v) {
        v.checked = !checkedAllStatus;
        return v;
      });

      that.setData({
        cartGoods: tmpCartData,
        checkedAllStatus: that.isCheckedAll(),
        cartTotal: { ...that.data.cartTotal, checkedGoodsCount: that.getCheckedGoodsCount() } 
      });
    }

  },
  editCart: function () {
    var that = this;
    if (this.data.isEditCart) {
      this.getCartList();
      this.setData({
        isEditCart: !this.data.isEditCart
      });
    } else {
      //编辑状态
      let tmpCartList = this.data.cartGoods.map(function (v) {
        v.checked = false;
        return v;
      });
      this.setData({
        editCartList: this.data.cartGoods,
        cartGoods: tmpCartList,
        isEditCart: !this.data.isEditCart,
        checkedAllStatus: that.isCheckedAll(),
        cartTotal: { ...that.data.cartTotal, checkedGoodsCount: that.getCheckedGoodsCount() } 
      });
    }

  },
  updateCart: function ( quantity, id) {
    let that = this;

    http.post(api.CartUpdate, {
      quantity: quantity,
      id: id
    }).then(function (res) {
      if (res.responseCode === 200) {
        console.log(res.data);
        that.setData({
          //cartGoods: res.data.cartList,
          //cartTotal: res.data.cartTotal
        });
      }
      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });

  },
  cutNumber: function (event) {

    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let quantity = (cartItem.quantity - 1 > 1) ? cartItem.quantity - 1 : 1;
    cartItem.quantity = quantity;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart(quantity, cartItem.id);
  },
  addNumber: function (event) {
    let itemIndex = event.target.dataset.itemIndex;
    let cartItem = this.data.cartGoods[itemIndex];
    let quantity = cartItem.quantity + 1;
    cartItem.quantity = quantity;
    this.setData({
      cartGoods: this.data.cartGoods
    });
    this.updateCart( quantity, cartItem.id);

  },
  checkoutOrder: function () {
    //获取已选择的商品
    let that = this;

    var checkedGoods = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (checkedGoods.length <= 0) {
      return false;
    }


    wx.navigateTo({
      url: '../../shipping/checkout/checkout'
    })
  },
  deleteCart: function () {
    //获取已选择的商品
    let that = this;
    
    let ids = this.data.cartGoods.filter(function (element, index, array) {
      if (element.checked == true) {
        return true;
      } else {
        return false;
      }
    });

    if (ids.length <= 0) {
      return false;
    }

    ids = ids.map(function (element, index, array) {
      if (element.checked == true) {
        return element.id;
      }
    });


    http.post(api.CartDelete, [...ids]).then(function (res) {
      if (res.responseCode === 200) {
        console.log(res.data);
        let cartList = res.data.cartList.map(v => {
          console.log(v);
          v.checked = false;
          return v;
        });

        that.setData({
          cartGoods: cartList,
          cartTotal: res.data.cartTotal
        });
      }

      that.setData({
        checkedAllStatus: that.isCheckedAll()
      });
    });
  }
})