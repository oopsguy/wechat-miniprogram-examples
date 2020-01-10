const api = require('../../utils/api.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    id: null,
    loadidngHidden: false,
    bookData: null
  },
  onLoad(option) {
    this.setData({
      id: option.id
    });
  },
  onReady() {
    wx.showLoading({
      title: '加载中',
    });

    api.requestBookDetail(
      this.data.id, {
        fields: 'image,summary,publisher,title,rating,pubdate,author,author_intro,catalog'
      }
    ).then((data) => {
      this.setData({
        loadidngHidden: true,
        bookData: data
      });
      wx.hideLoading();
    }).catch(_ => {
      this.setData({
        loadidngHidden: true
      });
      wx.hideLoading();
      wx.navigateBack();
    });
  },
  previewImage(e) {
    wx.previewImage({
      urls: [e.target.dataset.src]
    })
  }
});
