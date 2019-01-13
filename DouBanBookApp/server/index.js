// 豆瓣图书接口代理服务端
// 打开命令行切换到当前目录，如果是第一次运行，请使用 npm install 安装依赖
// 之后使用 node index.js 运行即可
// 运行之前请确保 8081 端口没有被占用，或者你可以修改代码中的端口号
// 如果使用该服务端代理请求豆瓣接口，请把 api.js 中的接口路径指向本服务器地址

const express = require('express');
const request = require('request');
const app = express()

const API_BASE = 'https://api.douban.com/v2/book';
const API_BOOK_SEARCH = `${API_BASE}/search`;
const API_BOOK_DETAIL = `${API_BASE}/:id`;

/**
 * 代理搜索接口
 */
app.use('/v2/book/search', function(req, resp) {
  let {q, start} = req.query;
  proxy(`${API_BOOK_SEARCH}?q=${q}&start=${start}`, req, resp);
});

/**
 * 代理图书详情接口
 */
app.use('/v2/book/:id', function (req, resp) {
  proxy(API_BOOK_DETAIL.replace(':id', req.params['id']), req, resp);
});

function proxy(url, req, resp) {
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      resp.json(JSON.parse(response.body));
    } else {
      resp.status(response.statusCode).json({});
    }
  });
}

app.listen(8081);
