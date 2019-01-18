import Utils from '../../utils/util';
import Api from '../../utils/api';

Page({
  data: {
    storyId: null,
    longCommentData: [],
    shortCommentData: null,
    shortCommentCount: 0,
    longCommentCount: 0
  },

  //获取传递过来的日报id 和 评论数目
  onLoad: function(options) {
    let storyId = options.id;
    let longCommentCount = parseInt(options.lcount) || 0;
    let shortCommentCount = parseInt(options.scount) || 0;
    this.setData({
      storyId: storyId,
      longCommentCount: longCommentCount,
      shortCommentCount: shortCommentCount
    });
  },

  //加载长评列表
  onReady: function() {
    let storyId = this.data.storyId;
    //如果长评数量大于0，则加载长评，否则加载短评
    if (this.data.longCommentCount > 0) {
      wx.showLoading({
        title: '加载中'
      });
      Api.getStoryLongComments(storyId).then((data) => {
        this.setData({
          longCommentData: covertData(data.comments)
        });
        wx.hideLoading();
      }).catch(() => {
        wx.hideLoading();
        wx.showToast({
          title: '加载长评失败',
          icon: 'none',
          duration: 2000
        })
      });
    } else {
      loadShortComments.call(this);
    }
  },

  //加载短评列表
  loadShortCommentEvent: function() {
    //已经夹在过就无需再次加载 判断是否为null
    if (!this.data.shortCommentData) {
      loadShortComments.call(this);
    }
  }
});

/**
 * 加载短评列表
 */
function loadShortComments() {
  wx.showLoading({
    title: '加载中'
  });
  let storyId = this.data.storyId;
  Api.getStoryShortComments(storyId).then(data => {
    this.setData({
      shortCommentData: covertData(data.comments)
    });
    wx.hideLoading();
  }).catch(() => {
    wx.hideLoading();
    wx.showToast({
      title: '加载短评失败',
      icon: 'none',
      duration: 2000
    });
  });
}

function covertData(comments) {
  if (comments) {
    for (let i = 0, len = comments.length; i < len; i++) {
      comments[i].avatar = Utils.fixImgPrefix(comments[i].avatar);
      comments[i].time = getDateDesc(comments[i].time);
    }
  }
  return comments;
}

function getDateDesc(timstamp) {
  let date = new Date(timstamp * 1000);
  return (date.getMonth() + 1) + '-' + date.getDate() + '  ' + date.getHours() + ':' + date.getMinutes();
}