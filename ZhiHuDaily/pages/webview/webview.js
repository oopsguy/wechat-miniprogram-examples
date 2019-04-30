Page({
  data: {
    src: null
  },

  onLoad(options) {
    let src = options.src;
    if (!src) {
      this.onError();
      return;
    }
    this.setData({
      src: options.src
    });
  },

  onError() {
    wx.showModal({
      title: '错误',
      content: '页面加载失败'
    })
  }
})