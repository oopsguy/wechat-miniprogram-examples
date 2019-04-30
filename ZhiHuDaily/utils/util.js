const HtmlParser = require('htmlParseUtil.js');

String.prototype.trim = function() {
  return this.replace(/(^\s*)|(\s*$)/g, '');
}

String.prototype.isEmpty = function() {
  return this.trim() == '';
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/**
 * 获取当前日期对象
 * @returns {object}
 */
function getCurrentData() {
  let date = new Date();
  return {
    date: date,
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    day: date.getDate(),
    weekday: date.getDay()
  };
}

/**
 * 快捷方法 获取HtmlParser对象
 * @param {string} html html文本
 * @return {object} HtmlParser
 */
function $(html) {
  return new HtmlParser(html);
}

/**
 * 解析story对象的body部分
 * @param {string} html body的html文本
 * @param {boolean} isDecode 是否需要unicode解析
 * @return {object} 解析后的对象
 */
function parseStory(html, isDecode) {
  let questionArr = $(html).tag('div').attr('class', 'question').match();
  let stories = [];
  let $story;
  if (questionArr) {
    for (let i = 0, len = questionArr.length; i < len; i++) {
      $story = $(questionArr[i]);
      let mavatar = getArrayContent(getArrayContent($story.tag('div').attr('class', 'meta').match()).jhe_ma('img', 'src'));
      mavatar = fixImgPrefix(mavatar);
      stories.push({
        index: i,
        title: getArrayContent($story.tag('h2').attr('class', 'question-title').match()),
        avatar: mavatar,
        author: getArrayContent($story.tag('span').attr('class', 'author').match()),
        bio: getArrayContent($story.tag('span').attr('class', 'bio').match()),
        content: parseStoryContent($story, isDecode),
        more: getArrayContent(getArrayContent($(html).tag('div').attr('class', 'view-more').match()).jhe_ma('a', 'href'))
      });
    }
  }
  return stories;
}

/**
 * 解析文章内容
 * @param {string} $story htmlparser对象
 * @param {boolean} isDecode 是否需要unicode解析
 * @returb {object} 文章内容对象
 */
function parseStoryContent($story, isDecode) {
  let content = [];
  let ps = $story.tag('p').match();
  let p, strong, img, blockquote, em;
  if (ps) {
    for (let i = 0, len = ps.length; i < len; i++) {
      p = transferSign(ps[i]); //获取<p>的内容 ,并将特殊符号转义
      if (!p || p.isEmpty())
        continue;

      img = getArrayContent((p.jhe_ma('img', 'src')));
      strong = getArrayContent(p.jhe_om('strong'));
      em = getArrayContent(p.jhe_om('em'));
      blockquote = getArrayContent(p.jhe_om('blockquote'));

      if (!img.isEmpty()) { //获取图片
        img = fixImgPrefix(img);
        content.push({
          index: i,
          type: 'img',
          value: img
        });
      } else if (isOnly(p, strong)) { //获取加粗段落<p><strong>...</strong></p>
        strong = decodeHtml(strong, isDecode);
        if (!strong.isEmpty())
          content.push({
            index: i,
            type: 'pstrong',
            value: strong
          });
      } else if (isOnly(p, em)) { //获取强调段落 <p><em>...</em></p>
        em = decodeHtml(em, isDecode);
        if (!em.isEmpty())
          content.push({
            index: i,
            type: 'pem',
            value: em
          });
      } else if (isOnly(p, blockquote)) { //获取引用块 <p><blockquote>...</blockquote></p>
        blockquote = decodeHtml(blockquote, isDecode);
        if (!blockquote.isEmpty())
          content.push({
            index: i,
            type: 'blockquote',
            value: blockquote
          });
      } else { //其他类型 归类为普通段落 ....太累了 不想解析了T_T
        p = decodeHtml(p, isDecode);
        if (!p.isEmpty())
          content.push({
            index: i,
            type: 'p',
            value: p
          });
      }
    }
  }
  return content;
}

/**
 * 取出多余或者难以解析的html并且替换转义符号
 */
function decodeHtml(value, isDecode) {
  if (!value) return '';
  value = value.replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&ldquo;/g, '"')
    .replace(/&rdquo;/g, '"').replace(/&middot;/g, '·');
  if (isDecode)
    return decodeUnicode(value.replace(/&#/g, '\\u'));
  return value;

}

/**
 * 解析段落的unicode字符，主题日报中的内容又很多是编码过的
 */
function decodeUnicode(str) {
  let ret = '';
  let splits = str.split(';');
  for (let i = 0; i < splits.length; i++) {
    ret += spliteDecode(splits[i]);
  }
  return ret;
};

/**
 * 解析单个unidecode字符
 */
function spliteDecode(value) {
  let target = value.match(/\\u\d+/g);
  if (target && target.length > 0) { //解析类似  "7.1 \u20998" 参杂其他字符
    target = target[0];
    let temp = value.replace(target, '{{@}}');
    target = target.replace('\\u', '');
    target = String.fromCharCode(parseInt(target));
    return temp.replace("{{@}}", target);
  } else {
    // value = value.replace( '\\u', '' );
    // return String.fromCharCode( parseInt( value, '10' ) )
    return value;
  }
}

/**
 * 获取数组中的内容（一般为第一个元素）
 * @param {array} arr 内容数组
 * @return {string} 内容
 */
function getArrayContent(arr) {
  if (!arr || arr.length == 0) return '';
  return arr[0];
}

function isOnly(src, target) {
  return src.trim() == target;
}

/**
 * 判断目标是否是函数
 * @param {mixed} val
 * @returns {boolean}
 */
function isFunction(val) {
  return typeof val === 'function';
}

/**
 * 修正图片url，将pic1和pic2改为pic4
 * @param data
 * @returns {*}
 */
function correctData(data) {
  if (("top_stories" in data)) {
    let top_stories = data.top_stories;
    for (let i = 0; i < top_stories.length; i++) {
      top_stories[i].image = fixImgPrefix(top_stories[i].image);
    }
    data.top_stories = top_stories;
  }

  let stories = data.stories;
  for (let i = 0; i < stories.length; i++) {
    if (("images" in stories[i])) {
      let s = stories[i].images[0];
      s = fixImgPrefix(s);
      stories[i].images[0] = s;
    }
  }

  data.stories = stories;
  return data;
}

/**
 * 将转义字符转为实体
 * @param data
 * @returns {*}
 */
function transferSign(data) {
  data = data.replace(/&ndash;/g, "–");
  data = data.replace(/&mdash;/g, "—");
  data = data.replace(/&hellip;/g, "…");
  data = data.replace(/&bull;/g, "•");
  data = data.replace(/&rsquo;/g, "’");
  data = data.replace(/&ndash;/g, "–");
  return data;
}

/**
 * 修正图片域名，部分图片可能不能直接加载
 * @param imgUrl 图片地址
 * @returns 修正后的图片地址
 */
function fixImgPrefix(imgUrl) {
  // 2018年3月31日 取消图片资源域名替换，现在可以直接正常访问图片
  // if (!imgUrl)
  return imgUrl;
  // return imgUrl.replace("pic1", "pic")
  //     .replace("pic2", "pic")
  //     .replace("pic3", "pic")
  //     .replace("pic4", "pic");
}

module.exports = {
  getCurrentData: getCurrentData,
  isFunction: isFunction,
  parseStory: parseStory,
  correctData: correctData,
  transferSign: transferSign,
  fixImgPrefix: fixImgPrefix
}