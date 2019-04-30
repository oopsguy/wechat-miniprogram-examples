const app = getApp();
const API_BASE = 'http://news-at.zhihu.com/api';
const API_V4 = API_BASE + '/4';
const API_V3 = API_BASE + '/3';
const API_NEWS = API_V4 + '/news';
const API_STORY = API_V4 + '/story';

/**
 * 网络请求方法
 * @param url {string} 请求url
 * @param data {object} 参数
 * @returns {Promise}
 */
function requestData(url, data) {
  if (app.debug) {
    console.log('requestData url: ', url);
  }
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      data: data || {},
      header: {
        'Content-Type': 'application/json'
      },
      success: function (res) {
        if (app.debug) {
          console.log('response data: ', res);
        }
        if (res.statusCode == 200) {
          resolve(res.data);
        } else {
          reject();
        }
      },
      fail: function () {
        reject();
      }
    });
  });
}

module.exports = {
  getNewsLatest() {
    return requestData(`${API_NEWS}/latest`);
  },
  getBeforeNews(date) {
    return requestData(`http://news.at.zhihu.com/api/4/news/before/${date}`);
  },
  getNewsDetail(newsId) {
    return requestData(`${API_NEWS}/${newsId}`);
  },
  getTheme() {
    return requestData(`${API_V4}/themes`);
  },
  getStoryExtraInfo(storyId) {
    return requestData(`${API_STORY}-extra/${storyId}`);
  },
  getThemeStories(themeId) {
    return requestData(`${API_V4}/theme/${themeId}`);
  },
  getStoryLongComments(storyId) {
    return requestData(`${API_STORY}/${storyId}/long-comments`);
  },
  getStoryShortComments(storyId) {
    return requestData(`${API_STORY}/${storyId}/short-comments`);
  },
  getSplashCover(size) {
    return requestData(`${API_V4}/start-image/${size}`);
  }
};