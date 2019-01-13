const api = require('../../utils/api.js');
const utils = require('../../utils/util.js');

Page({
  data: {
    scrollHeight: 0, //scroll-view高度
    pageIndex: 0, //页码
    totalRecord: 0, //图书总数
    isInit: true, //是否第一次进入应用
    loadingMore: false, //是否正在加载更多
    pageData: [], //图书数据
    searchKey: null //搜索关键字
  },

  //页面显示获取设备屏幕高度，以适配scroll-view组件高度
  onShow() {
    wx.getSystemInfo({
      success: (res) => {
        //80为顶部搜索框区域高度 rpx转px 屏幕宽度/750
        this.setData({
          scrollHeight: res.windowHeight - (100 * res.windowWidth / 750)
        });
      }
    })
  },

  //搜索输入框输入取值
  searchInputEvent(e) {
    this.setData({
      searchKey: e.detail.value
    });
  },

  //搜索按钮点击事件
  searchClickEvent(e) {
    if (!this.data.searchKey) {
      wx.showToast({
        title: '请输出入书名',
        icon: 'none',
        duration: 1000
      });
      return;
    }
    this.setData({
      pageIndex: 0,
      pageData: []
    });
    requestData.call(this);
  },

  //下拉请求数据
  scrollLowerEvent(e) {
    !this.data.loadingMore && requestData.call(this);
  },

  //跳转到详细页面
  toDetailPage(e) {
    const bid = e.currentTarget.dataset.bid; //图书id [data-bid]
    wx.navigateTo({
      url: `../detail/detail?id=${bid}`
    });
  }

});

/**
 * 请求图书信息
 */
function requestData() {
  const q = this.data.searchKey;
  const start = this.data.pageIndex;

  this.setData({
    loadingMore: true,
    isInit: false
  });

  wx.showLoading({
    title: '加载中',
  });

  api.requestSearchBook({
    q: q,
    start: start
  }).then((data) => {
    wx.hideLoading();
    if (data.total == 0) {
      this.setData({
        loadingMore: false,
        totalRecord: 0
      });
    } else {
      this.setData({
        loadingMore: false,
        pageData: this.data.pageData.concat(data.books),
        pageIndex: start + 1,
        totalRecord: data.total
      });
    }
  }).catch(_ => {
    this.setData({
      loadingMore: false,
      totalRecord: 0
    });
    wx.hideLoading();
  });
}
