# WechatSmallApps

微信小程序最近很火热，虽然官方还在内侧，但是笔者还是经常看得到很多微信小程序相关的文章，既然它这么火热，自己也想学习并做出点东西。笔者刚毕业不久，参加工作也只有3个月，实际的开发能力并不能与大牛相比，所做的DEMO技术含量比较低，自己的目的在于记录下每次学习的过程和分享每一次学习之后的成果。由于工作比较忙，只能抽周末的时间来完善DEMO，计划中的DEMO有几个，以后会慢慢更新。

## 更新
- [2017-02-12] 修改知乎日报案例的图片路径，修复获取知乎图片失败的问题，启动界面的图片获取接口被限制，暂无办法解决！

- [2016-11-23] 由于官方IDE更新到了`0.11.112301`版本，移除了对`Promise`的支持，造成`事项助手`不能正常运行，解决此问题，在项目中引入第三方兼容库[Bluebird](https://github.com/petkaantonov/bluebird)支持`Promise`，代码已经整合到项目代码中。

- [2016-11-16] 更新案例`事项助手`，配合[微信小程序之ES6与事项助手](http://oopsguy.com/2016/11/12/wechat-small-program-es6-matter-assistant/)教程开发，主要是介绍小程序ES6开发方法。

- [2016-10-31] 小程序更新到最新版本 [0.10.102800](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，删除之前兼容新注释，`知乎日报`首页的轮播图恢复正常，新增案例计划，初步开发，暂且命名为`事项助手`，其主要功能为日历全月份天数动态展示。

- [2016-10-29] 由于官方不定期升级IDE，小程序的部分功能被修改和移除，导致之前的项目不能正常运行。现在的代码以最新版IDE运行环境为准，即0.10.102800版本，可[点击下载](https://mp.weixin.qq.com/debug/wxadoc/dev/devtools/download.html)，虽然修改了代码以适应最新版本的开发环境，但是之前的有些布局和做法已经不再受到官方的支持，所以实际运行效果与效果图中的展示可能存在差异。

> `知乎日报`案例上传之后，有比较热心的网友贡献自己的代码修复了很多bug，非常感谢

- [@jkgeekJack](https://github.com/jkgeekJack)  
  美化部分UI，增加收藏功能，把主页、主题和收藏页改为单页模式，修复部分图片不能显示的问题，部分代码重构，内容转义字符显示问题修复。


## 案列说明

[Oopsguy的博客](http://oopsguy.com)

[案例随笔分支](https://github.com/oopsguy/WechatSmallApps/tree/pages_doc)

## 案例

### MatterAssistant 事项助手(ES6教程附带例子)

介绍小程序的ES6开发方式，基础到写法，最后给出[事项助手](http://oopsguy.com)作为演示例子，事项助手的功能比较简单，附带日历组件和简单的事项信息存储功能。

![事项助手首页](http://og808p12b.bkt.clouddn.com/matter-assistant-index.png)

### ZhiHuDaliy 知乎日报

上一次的《微信小程序之小豆瓣图书》制作了一个图书的查询功能，只是简单地应用到了网络请求，其他大多数小程序应有的知识。而本次的示例是`知乎日报`，功能点比较多，页面也比上次复杂了许多。在我编写这个DEMO之前，网上已经有很多网友弄出了相同的DEMO，也是非常不错的，毕竟这个案例很经典，有比较完整的API，很值得模仿学习。本次个人的DEMO也算是一次小小的练习吧。

![Splash启动页面](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_splash.png)

![首页](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_index.png)

![侧栏菜单](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_slide.png)

![详细页面2](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_detail2.png)

![内容分享](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_share.png)

![评论页面](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_comment.png)

![主题日报](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_theme.png)

![设置页面](http://oeiyvmnx5.bkt.clouddn.com/zhihuribao_setting.png)

### DoubanBookApp 豆瓣图书

很简单的一个小例子，使用了两个豆瓣图书的api，搜索图书和获取图书详情接口。这是第一个自己的第一个微信小应用。

![DouBanBookApp首页](http://oeiyvmnx5.bkt.clouddn.com/DouBanBookAppNewIndex.jpg)

![DouBanBookApp列表页](http://oeiyvmnx5.bkt.clouddn.com/DouBanBookAppList.jpg)

![DouBanBookApp详细页](http://oeiyvmnx5.bkt.clouddn.com/DouBanAppNewsDetail.jpg)

## 代码仓库

[https://github.com/oopsguy/WechatSmallApps](https://github.com/oopsguy/WechatSmallApps)

[http://git.oschina.net/oopsguy/WechatSmallApps](http://git.oschina.net/oopsguy/WechatSmallApps)
