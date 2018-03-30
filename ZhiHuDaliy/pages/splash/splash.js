var requests = require('../../requests/request.js');
var util = require('../../utils/util.js');

Page({
  data: {
    splash: {},
    screenHeight: 0,
    screenWidth: 0
  },
  onLoad: function (options) {
    var _this = this;
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
        });
      }
    });
  },
  onReady: function () {
    var _this = this;
    var size = this.data.screenWidth + '*' + this.data.screenHeight;
    requests.getSplashCover(size, (data) => {
      util.fixImgPrefix(data.img);
      _this.setData({ splash: data });
    }, null, () => {
      toIndexPage.call(_this);
    });
  },
  onShow: function () {
  },
  onHide: function () {
  },
  onUnload: function () {
  }
});

/**
 * 跳转到首页
 */
function toIndexPage() {
  setTimeout(function () {
    wx.redirectTo({
      url: '../index/index'
    });
  }, 2000);
}