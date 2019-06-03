Page({
  data: {
    PageCur: 'baokuan'
  },
  NavChange(e) {
    this.setData({
      PageCur: e.currentTarget.dataset.cur
    })
  },
  onShareAppMessage() {
    return {
      title: '淘新鲜到家',
      imageUrl: '/images/share.jpg',
      path: '/pages/index/index'
    }
  },
})