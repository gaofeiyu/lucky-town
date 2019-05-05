import * as React from "react";

import * as _ from 'lodash';
import * as moment from 'moment';

import { DocDetail } from 'views/page/index/view/widgets/docdetial';
import { CookieModal } from 'views/page/index/view/widgets/modal/cookie';
import { ProjectModal } from 'views/page/index/view/widgets/modal/project';
import { bigpipe } from 'views/lib/bigpipe';

moment.locale('zh-cn');
let Select = require('react-select');

var IntervalID: any;

export class PageContent extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      docs: [],
      noticevisited: true
    };
  }

  componentDidMount() {
    bigpipe.ready('notice/feedback', (data: any) => {
      this.setState({
        noticevisited: data.visited
      })
    })
  }

  setCookie(project: any) {
    var ck: any = this.refs.ck;
    ck.open(project, (data: any) => {
      console.log(data);
    })
  }

  /**
   *
   * 创建项目
   */
  createProject() {
    var pm: any = this.refs.pm;
    pm.open('create', {}, () => {
    });
  }

  selectProject(opt: any) {
    if (opt) {
      this.setState({
        selectedProject: opt.value
      })

      $.ajax({
        url: '/api/getDocs?project=' + opt.value.name
      })
        .then((result: any) => {
          this.setState({
            docs: result.data.docs
          })

          var docinput: any = this.refs.docinput;
          if (docinput) {
            docinput.focus();
          }
        })
    } else {
      this.setState({
        selectedProject: null,
        selectedDoc: null,
        docs: []
      })
    }
  }

  selectDoc(opt: any) {
    const { selectedProject } = this.state;
    if (opt) {
      if (opt.value.type === 'basic') {
        window.open('/doc?project=' + selectedProject.name + '#' + opt.value.type, '_blank');
      } else {
        this.setState({
          selectedDoc: opt.value
        })
      }
    } else {
      this.setState({
        selectedDoc: null
      })
    }
  }

  filterProjects(options: any, filterString: string): any {
    let reg = new RegExp(filterString);
    return _.filter(options, (opt: any) => {
      if (reg.test(opt.value.name) ||
        reg.test(opt.value.url) ||
        reg.test(opt.value.apiDomain)
      ) {
        return true
      } else {
        return false;
      }
    })
  }

  filterDocs(options: any, filterString: string): any {
    let reg = new RegExp(filterString);
    return _.filter(options, (opt: any) => {
      if (reg.test(opt.value.name) ||
        opt.value.setting && reg.test(opt.value.setting.url)
      ) {
        return true
      } else {
        return false;
      }
    })
  }

  render() {
    const { selectedProject, selectedDoc, docs, noticevisited } = this.state;
    const { user, data } = this.props;
    let rows: any = [];
    var projectsOption = _.map(data, (item: any) => {
      return {
        value: item,
        label: item.name
      }
    });

    var docsOption: any = _.map(docs, function (doc: any) {
      return {
        value: doc,
        label: doc.name
      }
    });

    return (
      <div className="page-content">
        <div className="content">
          <div className="search-area">
            <div className="st text-center">
              <h1 className="logo-name"><span className="logo-name2">API.</span>接口文档平台</h1>
            </div>
            <div className="sa">
              <span className="domain-area">
                <Select
                  name="domain-search"
                  placeholder="输入域名、项目"
                  value={selectedProject}
                  options={projectsOption}
                  filterOptions={this.filterProjects.bind(this)}
                  valueRenderer={(value: any) => {
                    return value.apiDomain || value.url || value.name
                  }}
                  optionRenderer={(item: any) => {
                    return (
                      <div className="" >
                        <div className="">
                          <div className="user-name text-black">
                            <span className="semi-bold">{item.value.name}</span>
                            <span className="pull-right">{item.value.docCount} 篇文档</span>
                          </div>
                          <div className=""><span className="text-muted">域名：</span>{item.value.apiDomain || item.value.url}</div>
                        </div>
                      </div>
                    )
                  }}
                  onChange={this.selectProject.bind(this)}
                />
              </span>
              <span className="doc-area">
                <Select
                  name="doc-search"
                  placeholder="输入URL、名称、描述、状态"
                  value={selectedDoc}
                  ref="docinput"
                  openOnFocus={true}
                  options={docsOption}
                  onChange={this.selectDoc.bind(this)}
                  filterOptions={this.filterDocs.bind(this)}
                  valueRenderer={(value: any) => {
                    if (value.type === 'basic') {
                      return <div><span className="label label-success">{value.type.toUpperCase()}</span> ：{value.name}</div>
                    } else {
                      return <div><span className="label label-success">{value.type.toUpperCase()}</span> ：{value.setting.url || value.name}</div>
                    }
                  }}
                  optionRenderer={(item: any) => {
                    return (
                      <div className="" >
                        <div className="">
                          <div className="user-name text-black">
                            <span className="semi-bold">{item.value.name}</span>
                            <span className="pull-right">{moment(item.value.lastModified).fromNow()}</span>
                          </div>
                          {
                            item.value.type === 'basic' ?
                              <div><span className="label">{item.value.type.toUpperCase()}</span></div>
                              :
                              item.value.type === 'get' ?
                                <div className="">
                                  <span className="label label-success">{item.value.type.toUpperCase()}</span>
                                  ：{item.value.setting.url}</div>
                                : <div className="">
                                  <span className="label label-info">{item.value.type.toUpperCase()}</span>
                                  ：{item.value.setting.url}</div>
                          }
                        </div>
                      </div>
                    )
                  }}

                />
              </span>
            </div>
            <div className="si text-center">
              <a href="/notice/feedback" className="apidoc-tip-container">活动公告
                        {
                  noticevisited ? null : <span className="badge badge-important apidoc-tip">&nbsp;</span>
                }
              </a>
              <a href="javascript:;" onClick={this.createProject.bind(this)}>创建项目</a>
              <a href="/mydoc">我的项目</a>
              <a href="http://km.oa.com/articles/show/376293" target="_blank">帮助文档</a>
              <a href="/admin" className="apidoc-tip-container" target="_blank">
                数据统计
                            {
                  noticevisited ? null : <span className="badge badge-important apidoc-tip">&nbsp;</span>
                }
              </a>
            </div>
          </div>
          <div className="scontent">
            {
              selectedDoc ?
                <DocDetail
                  doc={selectedDoc}
                  project={selectedProject}
                  setCookie={this.setCookie.bind(this)}
                />
                : null
            }
          </div>
        </div>

        <ProjectModal ref="pm" showSuccessTip={true} />
        <CookieModal ref="ck" />
      </div>
    );
  }
}
