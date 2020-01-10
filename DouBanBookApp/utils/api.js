// 豆瓣似乎已经封禁了微信小程序，直接请求会返回 403
// 现阶段的解决方案为使用网友提供接口代理服务器
// https://github.com/zce/douban-api-proxy
const API_BASE = 'https://douban-api.uieee.com/v2/book';
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
      header: {
        'content-type': 'text/html'
      },
      success: function (res) {
        if (res.statusCode === 200) {
          resolve(res.data);
        } else
          if (res.statusCode === 403) {
            console.error('豆瓣接口请求发生认证失败，可能被官方屏蔽！');
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
