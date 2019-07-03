const ApiRootUrl = 'http://39.100.136.110:8010/mall';
module.exports = {  
  ApiRootUrl: ApiRootUrl,
  ProductHotList: '/app/product/list/hot', //爆款商品列表
  ProductNewList: '/app/product/list/new', //新品列表
  ProductSearch: '/app/product/search', //商品搜索
  ProductListUrl:'/app/product/list', //商品列表
  ProductDetailUrl:'/app/product',//商品详情
  BindUserInfo:'/app/session/bindUserInfo',//绑定用户信息
  AddToCart:'/app/cart',
  CartGoodsCount:'/app/cart/count',
  CartList:'/app/cart/all',
  CartChecked:'/app/cart/checked',
  CartUpdate:'/app/cart/update',
  CartDelete:'/app/cart/delete',
  BannerList:'/banner',
  CategoryList:'/app/category/list/child',
  ShippingSave: '/app/shipping',
  ShippingList: '/app/shipping',
  ShippingDetail: '/app/shipping',
  ShippingDelete: '/app/shipping/delete',
  OrderComfirm: '/app/order/confirmOrderInfo',
  OrderSubmit: '/app/order/generateOrder',
  OrderList: '/app/order/list',
  OrderDetail: '/app/order'

  
};