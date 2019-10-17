import React from 'react';
import { Input, Select, Button, notification, Upload, Icon, Row, Col } from 'antd';
import { connect } from 'dva';
import SimpleMDE from 'simplemde';
import marked from 'marked';
import highlight from 'highlight.js';
import 'simplemde/dist/simplemde.min.css';
import * as qiniu from 'qiniu-js'
import './style.less';
import { queryUploadToken } from '@/services/api'
import { Label } from 'bizcharts';

// import daocheng from '../../../public/daocheng.jpeg'

@connect(({ article, tag, category }) => ({
  article,
  tag,
  category,
}))
class ArticleCreate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      smde: null,
      loading: false,
      keywordCom: '',
      pageNum: 1,
      pageSize: 50,
      changeType: false,
      title: '',
      author: 'firstlovedog',
      keyword: '',
      content: '',
      desc: '',
      img_url: '',
      origin: 0, // 0 原创，1 转载，2 混合
      state: 1, // 文章发布状态 => 0 草稿，1 已发布
      type: 1, // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
      tags: '',
      category: '',
      tagsDefault: [],
      categoryDefault: [],
      uploadToken: '',
      img_url: '',
      fileKey: ''
    };
    this.handleSearchTag = this.handleSearchTag.bind(this);
    this.handleSearchCategory = this.handleSearchCategory.bind(this);
    this.getSmdeValue = this.getSmdeValue.bind(this);
    this.setSmdeValue = this.setSmdeValue.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleCategoryChange = this.handleCategoryChange.bind(this);
    this.handleChangeState = this.handleChangeState.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
    this.handleChangeOrigin = this.handleChangeOrigin.bind(this);
    this.handleChangeType = this.handleChangeType.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.handleSearchTag();
    this.handleSearchCategory();
    // this.fetchUploadToken();

    this.state.smde = new SimpleMDE({
      element: document.getElementById('editor').childElementCount,
      autofocus: true,
      autosave: true,
      previewRender(plainText) {
        return marked(plainText, {
          renderer: new marked.Renderer(),
          gfm: true,
          pedantic: false,
          sanitize: false,
          tables: true,
          breaks: true,
          smartLists: true,
          smartypants: true,
          highlight(code) {
            return highlight.highlightAuto(code).value;
          },
        });
      },
    });
  }

  // 图片上传
  qiniuUpload(params) {
    // 从服务端获取token
    let token //上传验证信息，前端通过接口请求后端获得

    let file  // 上传的文件
    let key  //文件资源名
    
    let config = {
      // useCdnDomain: true,
      region: qiniu.region.z1
    };
    let observer = {
      next(res){
        // ...
      },
      error(err){
        // ...
      }, 
      complete(res){
        // ...
      }
    }
    let putExtra = {
      fname: "", //文件原文件名
      params: {}, //用来放置自定义变量
      mimeType: ["image/png", "image/jpeg", "image/gif"] //用来限定上传文件类型，指定null时自动判断文件类型。
    };
    qiniu.upload(file, 'daocheng', token, putExtra, config)
  }

  handleUpload() {
    console.log('上传');
    // 从服务端获取token
    let token = this.props.article.uploadToken //上传验证信息，前端通过接口请求后端获得

    let file = daocheng  // 上传的文件
    let key = 'daocheng.jpeg'  //文件资源名
    
    let config = {
      // useCdnDomain: true,
      region: qiniu.region.z1
    };
    let observer = {
      next(res){
        // ...
        console.log(res);
      },
      error(err){
        // ... 
        console.log(err.message);
      }, 
      complete(res){
        console.log(res);
        // ...
      }
    }
    let putExtra = {
      fname: "", //文件原文件名
      params: {}, //用来放置自定义变量
      mimeType: ["image/png", "image/jpeg", "image/gif", "image/jpg"] //用来限定上传文件类型，指定null时自动判断文件类型。
    };
    console.log('file:'+file, 'key:'+key, 'token:'+token, 'putExtra:'+putExtra, 'config:'+config);
    let observable = qiniu.upload(file, key, token, putExtra, config)
    let subscription = observable.subscribe(observer) // 上传开始
  }

  async beforeUpload(file) {
    await this.fetchUploadToken(file)
    return true
  }

  handleUploadChange(info) {
    let responseKey = info.file.response && info.file.response.key
    console.log(responseKey);
    let img_url = `http://cdn.friendlp.cn/${responseKey}`
    this.setState({
      img_url: img_url
    })
  }

  // 生成上传凭证
  getUploadToken = () => {
    return {
      token: this.state.uploadToken,
      key: this.state.fileKey
    }
  }

  // 请求上传凭证
  async fetchUploadToken(file) {
    const params = {
      documentType: '3',
      key: Date.now() + Math.floor(Math.random() * (999999 - 100000) + 100000) + 1
    }
    const res = await queryUploadToken()
    if (res.data.uploadToken) {
      this.setState({
        uploadToken: res.data.uploadToken,
        fileKey: params.key
      })
    }
    // const { dispatch } = this.props;
    // new Promise(resolve => {
    //   dispatch({
    //     type: 'article/queryUploadToken',
    //     payload: {
    //       resolve,
    //     },
    //   });
    // }).then(res => {
    //   console.log(res);
    //   if (res.data.uploadToken) {
    //     console.log(res.data.uploadToken,params.key);
    //     this.setState({
    //       uploadToken: res.data.uploadToken,
    //       fileKey: params.key
    //     })
    //   }
    // })
  }

  // 图片转成base64，，可以用于图片预览
  getBase64(img, callback){
    const reader = new FileReader()
    reader.addEventListener('load',()=>{callback(reader.result)})
    reader.readAsDataURL(img)
  }

  //文件上传操作
  handlerUploadChange(info) {
    if (info.file.status === 'done') {
      const imageKey = info.file.response.key
      this.setState({ imageKey })
      this.getBase64(info.file.originFileObj, img_url => {
        this.setState( { img_url })
      })
    }
  }

  handleSubmit() {
    const { dispatch } = this.props;
    const { articleDetail } = this.props.article;
    if (!this.state.title) {
      notification.error({
        message: '文章标题不能为空',
      });
      return;
    }
    if (!this.state.keyword) {
      notification.error({
        message: '文章关键字不能为空',
      });
      return;
    }
    if (!this.state.smde.value()) {
      notification.error({
        message: '文章内容不能为空',
      });
      return;
    }
    let keyword = this.state.keyword;
    if (keyword instanceof Array) {
      keyword = keyword.join(',');
    }
    this.setState({
      loading: true,
    });
    // 修改
    if (this.state.changeType) {
      const params = {
        id: articleDetail._id,
        title: this.state.title,
        author: this.state.author,
        desc: this.state.desc,
        keyword,
        content: this.state.content,
        img_url: this.state.img_url,
        origin: this.state.origin,
        state: this.state.state,
        type: this.state.type,
        tags: this.state.tags,
        category: this.state.category,
      };
      new Promise(resolve => {
        dispatch({
          type: 'article/updateArticle',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            visible: false,
            changeType: false,
            title: '',
            author: 'firstlovedog',
            keyword: '',
            content: '',
            desc: '',
            img_url: '',
            origin: 0, // 0 原创，1 转载，2 混合
            state: 1, // 文章发布状态 => 0 草稿，1 已发布
            type: 1, // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
            tags: '',
            category: '',
            tagsDefault: [],
            categoryDefault: [],
          });
          this.handleSearch(this.state.pageNum, this.state.pageSize);
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
    } else {
      // 添加
      const params = {
        title: this.state.title,
        author: this.state.author,
        desc: this.state.desc,
        keyword: this.state.keyword,
        content: this.state.smde.value(),
        img_url: this.state.img_url,
        origin: this.state.origin,
        state: this.state.state,
        type: this.state.type,
        tags: this.state.tags,
        category: this.state.category,
      };
      new Promise(resolve => {
        dispatch({
          type: 'article/addArticle',
          payload: {
            resolve,
            params,
          },
        });
      }).then(res => {
        if (res.code === 0) {
          notification.success({
            message: res.message,
          });
          this.setState({
            loading: false,
            chnageType: false,
          });
          // this.handleSearch(this.state.pageNum, this.state.pageSize);
        } else {
          notification.error({
            message: res.message,
          });
        }
      });
    }
  }

  getSmdeValue() {
    // console.log('this.state.smde.value() :', this.state.smde.value());
    return this.state.smde.value();
  }

  setSmdeValue(value) {
    this.state.smde.value(value);
  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  handleTagChange(value) {
    const tags = value.join();
    console.log('tags :', tags);
    this.setState({
      tagsDefault: value,
      tags,
    });
  }

  handleCategoryChange(value) {
    const category = value.join();
    console.log('category :', category);
    this.setState({
      categoryDefault: value,
      category,
    });
  }

  handleChangeState(value) {
    this.setState({
      state: value,
    });
  }

  handleChangeOrigin(value) {
    this.setState({
      origin: value,
    });
  }

  handleChangeType(value) {
    console.log('type :', value);
    this.setState({
      type: value,
    });
  }

  handleSearchTag = () => {
    this.setState({
      loading: true,
    });
    const { dispatch } = this.props;
    const params = {
      keyword: this.state.keywordCom,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    new Promise(resolve => {
      dispatch({
        type: 'tag/queryTag',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      // console.log('res :', res);
      if (res.code === 0) {
        this.setState({
          loading: false,
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  handleSearchCategory = () => {
    this.setState({
      loading: true,
    });
    const { dispatch } = this.props;
    const params = {
      keyword: this.state.keyword,
      pageNum: this.state.pageNum,
      pageSize: this.state.pageSize,
    };
    new Promise(resolve => {
      dispatch({
        type: 'category/queryCategory',
        payload: {
          resolve,
          params,
        },
      });
    }).then(res => {
      // console.log('res :', res);
      if (res.code === 0) {
        this.setState({
          loading: false,
        });
      } else {
        notification.error({
          message: res.message,
        });
      }
    });
  };

  render() {
    // const { uploadToken } = this.props.article
    const token_and_key = this.getUploadToken()
    const { tagList } = this.props.tag;
    const { categoryList } = this.props.category;
    const children = [];
    const categoryChildren = [];
    for (let i = 0; i < tagList.length; i++) {
      const e = tagList[i];
      children.push(
        <Select.Option key={e._id} value={e._id}>
          {e.name}
        </Select.Option>
      );
    }
    for (let i = 0; i < categoryList.length; i++) {
      const e = categoryList[i];
      categoryChildren.push(
        <Select.Option key={e._id} value={e._id}>
          {e.name}
        </Select.Option>
      );
    }
    // const { articleDetail } = this.props.article;
    // const { changeType } = this.props;
    let originDefault = '原创';
    let stateDefault = '发布'; // 文章发布状态 => 0 草稿，1 发布
    const typeDefault = '普通文章'; // 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍
    let categoryDefault = [];
    let tagsDefault = [];
    // if (changeType) {
    // 	originDefault = articleDetail.origin === 0 ? '原创' : '';
    // 	stateDefault = articleDetail.state ? '已发布' : '草稿';
    // 	typeDefault = articleDetail.type === 1 ? '普通文章' : articleDetail.type === 2 ? '简历' : '管理员介绍';
    // 	categoryDefault = this.props.categoryDefault;
    // 	tagsDefault = this.props.tagsDefault;
    // } else {
    originDefault = '原创';
    stateDefault = '发布'; // 文章发布状态 => 0 草稿，1 发布
    categoryDefault = [];
    tagsDefault = [];
    // }
    const normalCenter = {
      textAlign: 'center',
      marginBottom: 10,
    };

    return (
      <div>
        <Input
          style={normalCenter}
          addonBefore="标题"
          size="large"
          placeholder="标题"
          name="title"
          value={this.state.title}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="作者"
          size="large"
          placeholder="作者"
          name="author"
          value={this.state.author}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="关键字"
          size="large"
          placeholder="关键字"
          name="keyword"
          value={this.state.keyword}
          onChange={this.handleChange}
        />
        <Input
          style={normalCenter}
          addonBefore="描述"
          size="large"
          placeholder="描述"
          name="desc"
          value={this.state.desc}
          onChange={this.handleChange}
        />
        {/* <Upload
          name='file'
          accept='.png, .jpg, .jpeg'
          action='http://upload-z1.qiniu.com'
          showUploadList={true}
          multiple={true}
          data={
            token_and_key
          }
          beforeUpload={this.beforeUpload.bind(this)}
          onChange={this.handleUploadChange}
        >
          {
            this.state.img_url
            ? <img src={this.state.img_url} />
            : <Icon type='plus' />
          }
        </Upload> */}
        <Row gutter={24} align={'middle'} style={{ height: '50px' }}>
          <Col span={6} style={{ textAlign: 'left' }}>
            <span style={{ height: '32px', textAlign: 'left', lineHeight: '32px',fontSize:'18px' }}>选择封面图片:</span>
          </Col>
          <Col span={10}>
            <Upload
              name='file'
              accept='.png, .jpg, .jpeg'
              action='http://upload-z1.qiniu.com'
              showUploadList={true}
              multiple={true}
              data={
                token_and_key
              }
              beforeUpload={this.beforeUpload.bind(this)}
              onChange={this.handleUploadChange.bind(this)}
            >
              <Button>
                <Icon type="upload" /> 选择文件
              </Button>
            </Upload>
          </Col>
        </Row>
        <Input
          style={normalCenter}
          addonBefore="封面链接"
          size="large"
          placeholder="封面链接"
          name="img_url"
          value={this.state.img_url}
          onChange={this.handleChange}
        />

        <Select
          style={{ width: 200, marginBottom: 20 }}
          placeholder="选择发布状态"
          defaultValue={stateDefault}
          onChange={this.handleChangeState}
        >
          {/*  0 草稿，1 发布 */}
          <Select.Option value="0">草稿</Select.Option>
          <Select.Option value="1">发布</Select.Option>
        </Select>

        <Select
          style={{ width: 200, marginLeft: 10, marginBottom: 20 }}
          placeholder="选择文章类型"
          defaultValue={typeDefault}
          onChange={this.handleChangeType}
        >
          {/* 文章类型 => 1: 普通文章，2: 简历，3: 管理员介绍 */}
          <Select.Option value="1">普通文章</Select.Option>
          <Select.Option value="2">简历</Select.Option>
          <Select.Option value="3">管理员介绍</Select.Option>
        </Select>

        <Select
          style={{ width: 200, marginLeft: 10, marginBottom: 20 }}
          placeholder="选择文章转载状态"
          defaultValue={originDefault}
          onChange={this.handleChangeOrigin}
        >
          {/* 0 原创，1 转载，2 混合 */}
          <Select.Option value="0">原创</Select.Option>
          <Select.Option value="1">转载</Select.Option>
          <Select.Option value="2">混合</Select.Option>
        </Select>

        <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginLeft: 10, marginBottom: 20 }}
          placeholder="标签"
          defaultValue={tagsDefault}
          value={this.state.tagsDefault}
          onChange={this.handleTagChange}
        >
          {children}
        </Select>
        <Select
          allowClear
          mode="multiple"
          style={{ width: 200, marginLeft: 10, marginBottom: 10 }}
          placeholder="文章分类"
          defaultValue={categoryDefault}
          value={this.state.categoryDefault}
          onChange={this.handleCategoryChange}
        >
          {categoryChildren}
        </Select>
        <div>
          {/* <Button
            onClick={() => {
              this.handleUpload();
            }}
            loading={this.state.loading}
            style={{ marginBottom: '10px' }}
            type="primary"
          >
            上传
          </Button> */}
          <Button
            onClick={() => {
              this.handleSubmit();
            }}
            loading={this.state.loading}
            style={{ marginBottom: '10px' }}
            type="primary"
          >
            提交
          </Button>
        </div>

        <div title="添加与修改文章" width="1200px">
          <textarea id="editor" style={{ marginBottom: 20, width: 800 }} size="large" rows={6} />
        </div>
      </div>
    );
  }
}

export default ArticleCreate;
