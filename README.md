
![效果图1.gif](http://pzgmze1tx.bkt.clouddn.com/1571306108195)

![文章列表效果](http://pzgmze1tx.bkt.clouddn.com/1571305542584)


## 前言

此 blog-react-admin 项目是基于 [蚂蚁金服开源的 ant design pro](https://pro.ant.design/index-cn) 之上，用 react 全家桶 + Ant Design  的进行再次开发的，项目已经开源，项目地址在 github 上。

效果预览 [https://preview.pro.ant.design/user/login](https://preview.pro.ant.design/user/login)


## 已实现功能

- [x] 登录  
- [x] 文章管理
- [x] 图片云存储
- [x] 标签管理  
- [x] 留言管理
- [x] 用户管理
- [x] 友情链接管理
- [x] 时间轴管理
- [x] 富文本编辑器（支持 MarkDown 语法）
- [x] 项目展示
- [x] 评论管理

## 待实现功能

- [ ] 个人中心（用来设置博主的各种信息）
- [ ] 工作台（ 接入百度统计接口，查看网站浏览量和用户访问等数据 ）

## 主要项目结构

```
- pages
  - Account 博主个人中心
  - article 文章管理
  - Category 分类
  - Dashboard 工作台
  - Exection 403 404 500 等页面
  - Link 链接管理
  - Message 留言管理
  - OtherUser 用户管理
  - Project 项目
  - Tag 标签管理
  - TimeAsix 时间轴
  - User 登录注册管理
```

## 添加富文本编辑器，同样支持 markdown 语法 

添加的编辑器为 [simplemde-markdown-editor](https://github.com/sparksuite/simplemde-markdown-editor)

参考的文章为 [react 搭建博客---支持markdown的富文本编辑器](https://segmentfault.com/a/1190000010616632)


## 搭建

使用详情请查看 [Ant Design Pro ](https://pro.ant.design/docs/getting-started-cn)，因为本项目也是在这个基础之上，按这个规范来构建的。


## 云存储

网站相关的图片都是上传到七牛云，业务部署在阿里云。


## Build Setup ( 构建安装 )

``` 
# install dependencies
npm install 

# serve with hot reload at localhost: 3000
npm start 

# build for production with minification
npm run build 
```

如果要看完整的效果，是要和后台项目  **[blog-node](https://github.com/lipenghu001/blog-fox-be)** 一起运行才行的，不然接口请求会失败。


## 项目常见问题


### 管理后台登录

管理后台登录是用 **邮箱加密码** 进行登录


### 管理员账号创建

![](http://pzgmze1tx.bkt.clouddn.com/1571306790685)

管理后台的登录账号要自己创建

### 用 postman 调接口注册

如果是本地的可以像这样子创建，如果是服务器上的，请把 url 修改一下，


![注册](http://pzgmze1tx.bkt.clouddn.com/1571307105839)


- 1.  url 

```
http://127.0.0.1:3000/register
```

- 2. param
```
{
 "name": "zhangsan",
 "password": "123456",
 "email": "xxx@qq.com",
 "phone": xxxxxxxxx,
 "type": 0,
 "introduce":"对自己的描述。"
}
```
这里的 type 为 0 是管理员账号，为 1 时，是普通用户。

### 权限

注册了管理员账号，并用管理员账号登录，还不能正常登录管理后台的，会被重定向加登录页面。因为权限管理的限制，要把自己注册的管理员账号的 **名字** 加在 config/router.config.js 的 authority 里面。

详情请看：

```
https://pro.ant.design/docs/authority-management-cn
```

### 登录

登录博客管理后台是用 **邮箱** 加 **密码** 登录。

## 项目地址与文档教程

开源不易，如果觉得该项目不错或者对你有所帮助，欢迎到 github 上给个 star，谢谢。

**项目地址：**

> [前台展示: https://github.com/lipenghu001/blog-fox-fe](https://github.com/lipenghu001/blog-fox-fe)

> [管理后台：https://github.com/lipenghu001/blog-fox-admin](https://github.com/lipenghu001/blog-fox-admin)

> [后端：https://github.com/lipenghu001/blog-fox-be](https://github.com/lipenghu001/blog-fox-be)

**本博客系统的系列文章：**


## 最后
