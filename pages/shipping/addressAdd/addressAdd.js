var util = require('../../../utils/util.js');
var api = require('../../../config/api.js');
var area = require('../../../config/area.js');
import Dialog from '../../../vant-weapp/dialog/dialog';
import http from '@chunpu/http'
var app = getApp();
Page({
  data: {
    navH: getApp().globalData.navHeight,
    address: {
      receiverProvince:'',
      receiverCity:'',
      receiverDistrict:'',
      receiverAddress: '',
      addressCode:'',
      receiverName: '',
      receiverPhone: '',
      defaultAddress: 0
    },
    areaList: area,
    addressId: 0,
    openSelectRegion: false,
    regionType: 1,
    regionList: [],
    selectRegionDone: false
  },
  bindinputMobile(event) {
    let address = this.data.address;
    this.setData({
      address: { ...address, receiverPhone: event.detail.value}
    });
  },
  bindinputName(event) {
    let address = this.data.address;
    this.setData({
      address: { ...address, receiverName: event.detail.value }
    });
  },
  bindinputAddress (event){
    let address = this.data.address;
    this.setData({
      address: { ...address, receiverAddress: event.detail.value }
    });
  },
  getAddressDetail() {
    let that = this;
    http.get(`${api.ShippingDetail}/${that.data.addressId}`).then(function (res) {
      if (res.responseCode === 200) {
        that.setData({
          address: res.data
        });
      }
    });
  },
  
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数
    console.log(options)
    if (options.id && options.id > 0) {
      this.setData({
        addressId: options.id
      });
      this.getAddressDetail();
    }
  },
  onReady: function () {

  },
  chooseRegion:function(){
    this.setData({
      openSelectRegion: true
    });
  },
  
  doneSelectRegion(e) {
    console.log(e);
    const region = e.detail.values;
    this.setData({
      openSelectRegion: false,
      address: {...this.data.address,
        receiverProvince: region[0].name,
        receiverCity: region[1].name,
        receiverDistrict: region[2].name,
        addressCode: region[2].code
      },
    });
  },
  cancelSelectRegion(e) {
    console.log(e);
    this.setData({
      openSelectRegion: false
    });
  },
  cancelAddress(){
    wx.reLaunch({
      url: '/pages/shipping/address/address',
    })
  },
  bindIsDefault(){
    this.setData({
      address: {
        ...this.data.address,
        defaultAddress: this.data.address.defaultAddress === 0 ? 1 : 0
      },
    });
  },
  saveAddress(){
    console.log(this.data.address)
    let address = this.data.address;

    if (!address.receiverName) {
      util.showErrorToast('请输入姓名');
      return false;
    }

    if (!address.receiverPhone) {
      util.showErrorToast('请输入手机号码');
      return false;
    }

    if (!address.receiverAddress ) {
      util.showErrorToast('请输入详细地址');
      return false;
    }

    let that = this;
    http.post(`${api.ShippingSave}`,this.data.address).then(function (res) {
      if (res.responseCode === 200) {
        wx.navigateBack({ "delta": 1 });
      }
    });
  },
  deleteAddress(){
    let that = this;
    Dialog.confirm({
      title: '提示',
      message: '请确认是否删除地址'
    }).then(() => {
      http.post(`${api.ShippingDelete}`, [this.data.addressId]).then(function (res) {
        if (res.responseCode === 200) {
          wx.navigateBack({ "delta": 1 });
        }
      });
    }).catch(() => {
      // on cancel
    });
    
  },
  onShow: function () {
    // 页面显示

  },
  onHide: function () {
    // 页面隐藏

  },
  onUnload: function () {
    // 页面关闭

  }
})