import Utils from '../../utils/util';
import Api from '../../utils/api';
const weekdayStr = ['日', ' 一', '二', '三', '四', '五', '六'];

Page({
  data: {
    pageData: {}, //列表数据
    siderData: {}, //轮播图数据
    currentDate: null,
    isDrawerShow: false
  },

  onReady() {
    wx.showLoading({
      title: '加载中',
    });
    Api.getNewsLatest().then(data => {
      data = Utils.correctData(data);
      let tData = handleStories(data.stories);
      tData.unshift({
        isLabel: true,
        title: '今日热文'
      });
      this.setData({
        siderData: data.top_stories,
        pageData: tData,
        currentDate: new Date()
      });
      wx.hideLoading();
    }).catch((err) => {
      console.log(err)
      wx.hideLoading();
      wx.showToast({
        title: '数据加载异常，下拉重新刷新',
        icon: 'none',
        duration: 5000
      });
    });
  },

  //从详细页面返回时会刷新
  onShow() {
    if (!this.data.pageData) {
      wx.getStorage({
        key: 'pageData',
        success: (res) => {
          this.setData({
            pageData: res.data
          });
        }
      });
    }

  },

  onHide() {
    wx.setStorage({
      key: 'pageData',
      data: this.data.pageData
    });
  },

  onDrawerChange(e) {
    this.setData({
      isDrawerShow: e.detail.show
    });
  },

  //列表加载更多
  loadingMoreEvent(e) {
    wx.showLoading({
      title: '加载中',
    });
    console.log(this.data.currentDate);
    let date = new Date(Date.parse(this.data.currentDate) - 1000 * 60 * 60 * 24);
    let pageData = [];
    let y = date.getFullYear();
    let m = (date.getMonth() + 1);
    let d = date.getDate();
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    let dateStr = [y, m, d].join('');
    Api.getBeforeNews(dateStr).then(data => {
      data = Utils.correctData(data);
      pageData = this.data.pageData;
      pageData.push({
        isLabel: true,
        title: ([y, m, d].join('.') + '  星期' + weekdayStr[date.getDay()])
      });
      pageData = pageData.concat(handleStories(data.stories));
      this.setData({
        currentDate: date,
        pageData: pageData
      });
      wx.hideLoading();
    }).catch(() => {
      wx.hideLoading();
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  },

  toDetailPage(e) {
    const id = e.detail.data.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },

  toSettingPage() {
    wx.navigateTo({
      url: '../setting/setting'
    });
  },

  toCollectPage() {
    slideSwitch.call(this, false);
    wx.navigateTo({
      url: '../favorite/favorite'
    });
  },

  toHomePage(e) {
    Api.getNewsLatest().then(data => {
      data = Utils.correctData(data);
      this.setData({
        siderData: data.top_stories,
        pageData: data.stories
      });
      slideSwitch.call(this, false);
    }).catch(() => {
      wx.showToast({
        title: '数据加载失败',
        icon: 'none',
        duration: 2000
      });
    });
  },

  //浮动球点击 侧栏展开
  ballClickEvent() {
    slideSwitch.call(this, !this.data.isDrawerShow);
  },

  //遮罩点击  侧栏关闭
  slideCloseEvent() {
    slideSwitch.call(this, false);
  },

  onPullDownRefreash(e) {
    console.log(1);
  }
});

function handleStories(stories) {
  if (!stories) {
    return stories;
  }
  for (let i = 0; i < stories.length; i++) {
    if (stories[i].images) {
      stories[i].image = stories[i].images[0];
    }
  }
  return stories
}

//侧栏 drawer 展开收缩
function slideSwitch(isShow) {
  this.setData({
    isDrawerShow: isShow
  });
  this.selectComponent('#drawer').drawerSwitch(isShow);
}
