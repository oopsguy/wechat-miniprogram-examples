const utils = require('../utils/util.js');

// 豆瓣似乎已经封禁了微信小程序，直接请求会返回 403
// 建议使用代理来请求豆瓣 api，比如使用 nginx 代理转发请求
// const API_BASE = 'http://127.0.0.1:8081/v2/book';
const API_BASE = 'https://api.douban.com/v2/book';
const API_BOOK_SEARCH = `${API_BASE}/search`;
const API_BOOK_DETAIL = `${API_BASE}/:id`;

/**
 * 网路请求
 */
function request(url, data) {
  return new Promise(function (resolve, reject) {
    wx.request({
      url: url,
      method: 'GET',
      data: data,
      success: function (res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else
          if (res.statusCode === 403) {
            console.error('豆瓣接口请求被屏蔽，可尝试使用 server 文件夹里的代理服务器来请求接口，具体使用方法请看此文件夹中的 index.js 里的注释！');
          }
          reject();
      },
      fail: function () {
        reject();
      }
    });
  });
}

/**
 * 搜索图书
 */
function requestSearchBook(data) {
  return request(API_BOOK_SEARCH, data);
}

/**
 * 获取图书详细信息
 */
function requestBookDetail(id, data) {
  return request(API_BOOK_DETAIL.replace(':id', id), data);
}

/**
 * 关键字是否是tag
 */
function requestHasTag(tag) {
  return request(API_BOOK_SEARCH, { tag: tag, count: 1 });
}

module.exports = {
  requestSearchBook: requestSearchBook,
  requestBookDetail: requestBookDetail
}
