
Component({
  properties: {
    // 这里定义了innerText属性，属性值可以在组件使用时指定
    title: {
      type: String,
      value: '淘新鲜到家'
    },
    back:{
      type: Boolean,
      value: false
    },
    menu:{
      type: Boolean,
      value: false
    }
  },
  data: {
    // 这里是一些组件内部数据
  
    navH: getApp().globalData.navHeight
  },
 
  methods: {
    // 这里是一个自定义方法
    _navBack:function() {
      wx.navigateBack({ "delta": 1 });
    },
    _onMenuClick: function(){
      this.triggerEvent('onMenuClick', { "aa": "666传值成功" });
    }
  
  }
})