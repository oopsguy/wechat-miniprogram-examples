var requests = require( '../../requests/request.js' );

Page( {
  data: {
    id: null,
    pageShow: 'display',
    background: '',
    pageData: [], //列表数据源
    editorData: [], //主编数据
    description: '',
    loading: false,
    loadingMsg: '数据加载中...'
  },

  //接受主页传递过来的主题日报id
  onLoad: function( options ) {
    this.setData( { id: options.themeId });
  },

  //获取主题日报列表
  onReady: function() {
    var _this = this;
    this.setData( { loading: true });
    requests.getThemeStories( _this.data.id, ( data ) => {
      _this.setData( {
        pageData: data.stories,
        background: data.background,
        description: data.description,
        editorData: data.editors
      });
      wx.setNavigationBarTitle( { title: data.name }); //设置标题
    }, null, () => {
      _this.setData( { loading: false });
    });
  },

  //跳转到日报详情页
  toDetailPage: function( e ) {
    var id = e.currentTarget.dataset.id;
    wx.navigateTo( {
      url: '../detail/detail?theme=1&id=' + id
    });
  },

  onShow: function() {

  },
  onHide: function() {

  },
  
  onUnload: function() {

  }
});