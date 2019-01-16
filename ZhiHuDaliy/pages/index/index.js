import utils from '../../utils/util';
import requests from '../../requests/request';

const weekdayStr = ['日', ' 一', '二', '三', '四', '五', '六'];

Page({
  data: {
    pageData: {}, //列表数据
    themeData: {}, //主题菜单数据
    sliderData: {}, //轮播图数据
    currentDate: new Date(),
    refreshAnimation: {}, //加载更多旋转动画数据
    loadingMore: false, //是否正在加载

    loading: false,
    loadingMsg: '加载中...',
    pageShow: 'none',

    maskDisplay: 'none',
    slideHeight: 0,
    slideRight: 0,
    slideWidth: 0,
    slideDisplay: 'block',
    screenHeight: 0,
    screenWidth: 0,
    slideAnimation: {},

    ballBottom: 20,
    ballRight: 20,
    ballOpacity: '.8',
    themeId: 0, //当前主题id

    id: null,
    //pageShow: 'display',
    background: '',
    //pageData: [], //列表数据源
    editorData: [], //主编数据
    description: '',
    //loading: false,
    //loadingMsg: '数据加载中...'
  },

  //获取设备信息，屏幕的高度宽度
  onLoad() {
    var _this = this;
    wx.getSystemInfo({
      success: function(res) {
        _this.setData({
          screenHeight: res.windowHeight,
          screenWidth: res.windowWidth,
          slideHeight: res.windowHeight,
          slideRight: res.windowWidth,
          slideWidth: res.windowWidth * 0.7
        });
      }
    });
  },

  //从详细页面返回时会刷新
  onShow() {
    if (this.data.themeId == -1) {
      var pageData = wx.getStorageSync('pageData') || []
      this.setData({
        pageData: pageData
      })
    }
  },

  onReady() {
    var _this = this;
    _this.setData({
      loading: true
    });
    requests.getNewsLatest((data) => {
      data = utils.correctData(data);
      _this.setData({
        sliderData: data.top_stories,
        pageData: data.stories
      });
      _this.setData({
        pageShow: 'block'
      });
    }, null, () => {
      _this.setData({
        loading: false
      });
    });

    // //获取主题日报列表
    // requests.getTheme((data) => {
    //   _this.setData({
    //     themeData: data.others
    //   });
    // });
  },

  //列表加载更多
  loadingMoreEvent(e) {
    if (this.data.loadingMore) return;

    console.log(this.data.currentDate);
    var date = new Date(Date.parse(this.data.currentDate) - 1000 * 60 * 60 * 24);
    var _this = this;
    var pageData = [];

    this.setData({
      loadingMore: true
    });
    updateRefreshIcon.call(this);
    var y = date.getFullYear();
    var m = (date.getMonth() + 1);
    var d = date.getDate();
    m = m > 9 ? m : '0' + m;
    d = d > 9 ? d : '0' + d;
    var dateStr = [y, m, d].join('');
    requests.getBeforeNews(dateStr, (data) => {
      data = utils.correctData(data);
      console.log(data);
      pageData = _this.data.pageData;
      pageData.push({
        type: '3',
        title: ([y, m, d].join('.') + '  星期' + weekdayStr[date.getDay()])
      });
      pageData = pageData.concat(data.stories);

      _this.setData({
        currentDate: date,
        pageData: pageData
      });
    }, null, () => {
      _this.setData({
        loadingMore: false
      });
    });
  },

  toDetailPage(e) {
    var id = e.detail.data.id;
    wx.navigateTo({
      url: '../detail/detail?id=' + id
    });
  },
  toSettingPage() {
    wx.navigateTo({
      url: '../setting/setting'
    });
  },
  //toCollectPage: function() {
  //  wx.redirectTo( {
  //    url: '../collect/collect'
  //  });
  //},

  toHomePage(e) {
    var _this = this;
    _this.setData({
      loading: true,
      themeId: 0
    });
    console.log('themeId', _this.data.themeId);
    requests.getNewsLatest((data) => {
      data = utils.correctData(data);
      console.log(data);
      _this.setData({
        sliderData: data.top_stories,
        pageData: data.stories
      });
      slideSwitch.call(this, false);
      _this.setData({
        pageShow: 'block'
      });
    }, null, () => {
      _this.setData({
        loading: false
      });
    });
  },

  toThemePage(e) {
    var _this = this;
    _this.setData({
      loading: true,
      themeId: e.currentTarget.dataset.id
    });
    requests.getThemeStories(_this.data.themeId, (data) => {
      data['background'] = utils.fixImgPrefix(data['background']);
      for (var i = 0; i < data.editors.length; i++) {
        data.editors[i]['avatar'] = utils.fixImgPrefix(data.editors[i]['avatar']);
      }
      data = utils.correctData(data);
      _this.setData({
        pageData: data.stories,
        background: data.background,
        description: data.description,
        editorData: data.editors
      });
      slideSwitch.call(this, false);
      //wx.setNavigationBarTitle( { title: data.name }); //设置标题
    }, null, () => {
      _this.setData({
        loading: false
      });
    });
  },

  toCollectPage() {
    var _this = this;
    _this.setData({
      themeId: -1
    });
    var pageData = wx.getStorageSync('pageData') || []
    _this.setData({
      themeId: -1,
      pageData: pageData
    })
    //_this.setData( {
    //  pageData: data.stories,
    //  background: data.background,
    //  description: data.description,
    //  editorData: data.editors
    slideSwitch.call(this, false);
    //wx.setNavigationBarTitle( { title: data.name }); //设置标题

  },
  //toThemePage: function( e ) {
  //  var themeId = e.currentTarget.dataset.id;
  //  console.log( 'themeId', themeId );
  //  wx.navigateTo( {
  //    url: '../theme/theme?themeId=' + themeId
  //  });
  //},

  //浮动球点击 侧栏展开
  ballClickEvent() {
    slideSwitch.call(this, true);
  },

  //遮罩点击  侧栏关闭
  slideCloseEvent() {
    slideSwitch.call(this, false);
  },

  onPullDownRefreash(e) {
    console.log(1);
  }
});

//侧栏 drawer 展开收缩
function slideSwitch(isShow) {
  let animation = wx.createAnimation({
    duration: 200
  });
  this.setData({
    maskDisplay: isShow ? 'block' : 'none'
  });
  animation.translateX(isShow ? '100%' : '-100%').step();
  this.setData({
    slideAnimation: animation.export()
  });
}

/**
 * 旋转上拉加载图标
 */
function updateRefreshIcon() {
  var deg = 360;
  var _this = this;

  var animation = wx.createAnimation({
    duration: 1000
  });

  var timer = setInterval(function() {
    if (!_this.data.loadingMore)
      clearInterval(timer);
    animation.rotateZ(deg).step();
    deg += 360;
    _this.setData({
      refreshAnimation: animation.export()
    })
  }, 1000);
}