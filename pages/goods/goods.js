var app = getApp();
var WxParse = require('../../lib/wxParse/wxParse.js');
var util = require('../../utils/util.js');
var api = require('../../config/api.js');
import http from '@chunpu/http'
Page({
  data: {
    navH: getApp().globalData.navHeight,
    id: 0,
    goods: {},
    gallery: [],
    cartGoodsCount: 0,
    number: 1,
    checkedSpecText: '请选择规格数量',
    openAttr: false,
    imageApiPrefix: api.ImagePrefix,
    noCollectImage: "/static/images/icon_collect.png",
    hasCollectImage: "/static/images/icon_collect_checked.png",
    collectBackImage: "/static/images/icon_collect.png"
  },
  getGoodsInfo: function () {
    let that = this;
    http.get(`${api.ProductDetailUrl}/${that.data.id}`).then(function (res) {
        that.setData({
          goods: res.data,
          gallery: res.data.subImages,
        });
      WxParse.wxParse('goodsDetail', 'html', res.data.detail, that);
        //that.getGoodsRelated();
    });

  },
  getGoodsRelated: function () {
    let that = this;
    // util.request(api.GoodsRelated, { id: that.data.id }).then(function (res) {
    //   if (res.errno === 0) {
    //     that.setData({
    //       relatedGoods: res.data.goodsList,
    //     });
    //   }
    // });

  },

  //获取选中的规格信息
  getCheckedSpecValue: function () {
    let checkedValues = [];
    let _specificationList = this.data.specificationList;
    for (let i = 0; i < _specificationList.length; i++) {
      let _checkedObj = {
        nameId: _specificationList[i].specification_id,
        valueId: 0,
        valueText: ''
      };
      for (let j = 0; j < _specificationList[i].valueList.length; j++) {
        if (_specificationList[i].valueList[j].checked) {
          _checkedObj.valueId = _specificationList[i].valueList[j].id;
          _checkedObj.valueText = _specificationList[i].valueList[j].value;
        }
      }
      checkedValues.push(_checkedObj);
    }

    return checkedValues;

  },
  //根据已选的值，计算其它值的状态
  setSpecValueStatus: function () {

  },
  //判断规格是否选择完整
  isCheckedAllSpec: function () {
    return !this.getCheckedSpecValue().some(function (v) {
      if (v.valueId == 0) {
        return true;
      }
    });
  },
  getCheckedSpecKey: function () {
    let checkedValue = this.getCheckedSpecValue().map(function (v) {
      return v.valueId;
    });

    return checkedValue.join('_');
  },
  changeSpecInfo: function () {
    let checkedNameValue = this.getCheckedSpecValue();

    //设置选择的信息
    let checkedValue = checkedNameValue.filter(function (v) {
      if (v.valueId != 0) {
        return true;
      } else {
        return false;
      }
    }).map(function (v) {
      return v.valueText;
    });
    if (checkedValue.length > 0) {
      this.setData({
        'checkedSpecText': checkedValue.join('　')
      });
    } else {
      this.setData({
        'checkedSpecText': '请选择规格数量'
      });
    }

  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
      id: parseInt(options.id)
      // id: 1181000
    });
    var that = this;
    this.getGoodsInfo();
    http.get(api.CartGoodsCount).then((res)=>{
      that.setData({
          cartGoodsCount: res.data
        });
    })
  },
  onReady: function () {
    // 页面渲染完成

  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  },
  switchAttrPop: function () {
    if (this.data.openAttr == false) {
      this.setData({
        openAttr: !this.data.openAttr
      });
    }
  },
  closeAttr: function () {
    this.setData({
      openAttr: false,
    });
  },
  
  addCannelCollect: function () {
    let that = this;
    //添加或是取消收藏
    // util.request(api.CollectAddOrDelete, { typeId: 0, valueId: this.data.id }, "POST")
    //   .then(function (res) {
    //     let _res = res;
    //     if (_res.errno == 0) {
    //       if (_res.data.type == 'add') {
    //         that.setData({
    //           'collectBackImage': that.data.hasCollectImage
    //         });
    //       } else {
    //         that.setData({
    //           'collectBackImage': that.data.noCollectImage
    //         });
    //       }

    //     } else {
    //       wx.showToast({
    //         image: '/static/images/icon_error.png',
    //         title: _res.errmsg,
    //         mask: true
    //       });
    //     }
    //   });
  }, 
  toHome: function () {
    wx.reLaunch({
      url: '../index/index'
    })
  },
  shareGood: function () {

  },
  openCartPage: function () {
    wx.navigateTo({
      url: '../cart/index/index',
    })
  },
  addToCart: function () {
    var that = this;
    if (this.data.openAttr === false) {
      //打开规格选择窗口
      this.setData({
        openAttr: !this.data.openAttr
      });
    } else {
      //console.log({ productId: this.data.goods.id, quantity: this.data.number });
      if (this.data.goods.checkStock == 1 && this.data.goods.stock <= this.data.number){
        wx.showToast({
          title: '库存不足'
        });
        return;
      }
      http.post(api.AddToCart, { productId: this.data.goods.id, quantity: this.data.number }).then((res)=>{
        let _res = res;
          if (_res.responseCode == 200) {
            wx.showToast({
              title: '添加成功'
            });
            that.setData({
              openAttr: !that.data.openAttr,
              cartGoodsCount: _res.data
            });
          } else {
            wx.showToast({
              image: '/static/images/icon_error.png',
              title: _res.responseMsg,
              mask: true
            });
          }
      })
      
    }

  },
  cutNumber: function () {
    this.setData({
      number: (this.data.number - 1 > 1) ? this.data.number - 1 : 1
    });
  },
  addNumber: function () {
    this.setData({
      number: this.data.number + 1
    });
  }
})