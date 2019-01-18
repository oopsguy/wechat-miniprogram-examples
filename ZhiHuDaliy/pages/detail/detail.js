import Utils from '../../utils/util';
import Api from '../../utils/api';
import Data from '../../utils/data';

Page({
  data: {
    id: null, //当前日报id
    news: {}, //日报详情
    extraInfo: null,
    isCollect: false //是否被收藏
  },

  //获取列表残过来的参数 id：日报id， theme：是否是主题日报内容（因为主题日报的内容有些需要单独解析）
  onLoad(options) {
    let id = parseInt(options.id);
    Data.findOneById(id).then(d => {
      if (d) {
        this.setData({
          isCollect: true
        });
      }
    });

    this.setData({
      id: id
    });
  },

  //加载日报数据
  onReady() {
    loadData.call(this);
  },

  collectOrNot() {
    if (this.data.isCollect) {
      Data.findOneById(this.data.id).then(() => {
        this.setData({
          isCollect: false
        });
      }).catch(() => {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000
        });
      });
    } else {
      Data.save(Object.assign(
        {
          createTime: new Date().getTime()
        },
        this.data.news
      )).then(() => {
        this.setData({
          isCollect: true
        });
        wx.showToast({
          title: '收藏成功',
          icon: 'success',
          duration: 2000
        });
      }).catch((err) => {
        wx.showToast({
          title: '操作失败',
          icon: 'none',
          duration: 2000
        });
      });
    }
  },
  //跳转到评论页面
  toCommentPage(e) {
    let storyId = e.currentTarget.dataset.id;
    let longCommentCount = this.data.extraInfo ? this.data.extraInfo.long_comments : 0; //长评数目
    let shortCommentCount = this.data.extraInfo ? this.data.extraInfo.short_comments : 0; //短评数目
    //跳转到评论页面，并传递评论数目信息
    wx.navigateTo({
      url: '../comment/comment?lcount=' + longCommentCount + '&scount=' + shortCommentCount + '&id=' + storyId
    });
  },

  //现在图片预览不支持调试显示，看不到效果
  //图片预览[当前是当前图片，以后会考虑整篇日报的图片预览]
  previewImgEvent(e) {
    let src = e.currentTarget.dataset.src;
    if (src && src.length > 0) {
      wx.previewImage({
        urls: [src]
      });
    }
  },
  //重新加载数据
  reloadEvent() {
    loadData.call(this);
  }
});

//加载页面相关数据
function loadData() {
  let id = this.data.id;
  wx.showLoading({
    title: '加载中'
  });
  Api.getNewsDetail(id).then(data => {
    data['image'] = Utils.fixImgPrefix(data['image']);
    data.body = Utils.parseStory(data.body, false);
    this.setData({
      news: data
    });
    wx.hideLoading();
    wx.setNavigationBarTitle({
      title: data.title
    });
  }).catch(() => {
    wx.hideLoading();
  });

  //请求日报额外信息（主要是评论数和推荐人数）
  Api.getStoryExtraInfo(id).then(data => {
    this.setData({
      extraInfo: data
    });
  }).catch(() => {
    wx.showToast({
      title: '评论点赞数据获取失败',
      icon: 'none',
      duration: 2000
    });
  });
}