import Data from '../../utils/data';

Page({
  data: {
    dataSource: []
  },

  onReady: function () {
    wx.showLoading({
      title: '加载中'
    });
    loadData.call(this);
  },

  onShow: function () {

  },

  onHide: function () {

  },

  toDetailPage(e) {
    const id = e.detail.data.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },

  onLongTapEvent(e) {
    const id = e.detail.data.id;
    wx.showModal({
      title: '提示',
      content: '是否删除所选内容',
      success: (res) => {
        if (!res.confirm) {
          return;
        }
        Data.removeOneById(id).then(() => {
          wx.showToast({
            title: '删除成功',
            icon: 'success',
            duration: 2000
          });
          loadData.call(this);
        }).catch(() => {
          wx.showToast({
            title: '删除失败',
            icon: 'none',
            duration: 2000
          });
        });
      }
    });
  }

});

function loadData() {
  Data.findAll().then(data => {
    data = data || [];
    console.log(data);
    wx.hideLoading();
    this.setData({
      dataSource: data
    });
  }).catch(() => {
    wx.hideLoading();
    wx.showToast({
      title: '获取数据失败',
      icon: 'none',
      duration: 2000
    })
  });
}