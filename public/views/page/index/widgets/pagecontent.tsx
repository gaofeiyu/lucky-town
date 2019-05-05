import * as React from "react";

import * as _ from 'lodash';
import * as moment from 'moment';
moment.locale('zh-cn');
import { RemoveConfirmModal } from './modal/dataremove';
import { ProjectModal } from './modal/project';
import { CookieModal } from './modal/cookie';
import { SVNSettingModal } from './modal/svnsetting';
import { DocExportModal } from './modal/docexport';
import { DocImportModal } from './modal/docimport';
import { DocDetail } from './docdetial';
import { CodeSyncTab } from './tab/codesync';
import { docStates } from '../../../../../config/docstate';

let Select = require('react-select')

var IntervalID: any;

export class PageContent extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    const { projects } = props.data;
    const tabs = [
      {
        name: '文档',
        key: 'info',
        icon: "fa fa-book"
      },
      {
        name: '代码关联',
        key: 'code',
        icon: "fa fa-code"
      }
    ];
    this.state = {
      project: projects[0] || {
        count: {
        }
      },
      expandedrow: {},
      tabs: tabs,
      activetab: tabs[0],
      category: '',
      docs: [],
      selectDocState: null,
      selectOptions: _.map(docStates, (ds: any) => {
        return {
          value: ds.key,
          label: ds.value
        }
      })
    }
  }

  componentDidMount(prevProps: any, prevState: any) {
    let { project } = this.state
    if (!prevState || project !== prevState.project) {
      if (project && project.name) {
        this.selectProject(project);
      }
    }
  }

  startListen() {
    var search: any = this.refs.search;
    var lasttext = ''
    const { _docs } = this.state;
    IntervalID = setInterval(() => {
      var text = search.value;
      if (lasttext !== text) {
        lasttext = text;
        let reg = new RegExp(text, 'i');
        var result = _.filter(_docs, (doc: any) => {
          if (reg.test(doc.name) || (doc.setting && reg.test(doc.setting.url))) {
            return doc;
          }
        })

        this.setState({
          docs: result
        })

      }
    }, 500)

  }

  stopListen() {
    clearInterval(IntervalID)
  }


  getDocState(key: string) {
    var state = _.find(docStates, { key: key });
    return state ? state.value : '';
  }

  filterDocsByState(docstate: any) {
    const { _docs } = this.state;
    let docs: any = _docs;

    if (docstate) {
      docs = _.filter(_docs, (doc: any) => {
        if (doc.setting) {
          if (!doc.setting.state) {
            doc.setting.state = 'developing';
          }
          return docstate.value === doc.setting.state;
        }
      })
    }

    this.setState({
      docs: docs,
      selectDocState: docstate ? docstate.value : null
    })
  }

  selectProject(project: any) {
    this.setState({
      project: project,
      category: ''
    })

    $.ajax({
      url: '/api/getDocs',
      data: {
        project: project.name
      }
    }).then((result: any) => {
      if (result.status === 0) {
        this.setState({
          docs: result.data.docs,
          _docs: _.clone(result.data.docs)
        })
      } else {
        alert('errored!');
      }
    })
  }

  selectCategory(project: any, category: string, _id?: string) {
    $.ajax({
      url: '/api/getDocs',
      data: {
        project: project.name
      }
    }).then((result: any) => {
      if (result.status === 0) {
        var thedocs: any = [];
        if (category) {
          thedocs = _.filter(result.data.docs, { category: category });
        } else {
          thedocs = result.data.docs
        }
        if (_id) {
          this.setState({
            expandedrow: _.find(thedocs, { _id: _id }),
            category: category,
            project: project,
            docs: thedocs,
            _docs: _.clone(thedocs)
          })
        } else {
          this.setState({
            category: category,
            project: project,
            docs: thedocs,
            _docs: _.clone(thedocs)
          })
        }
      } else {
        alert('errored!');
      }
    })

  }

  modifyProjectSetting(project: any) {
    var pm: any = this.refs.pm;
    pm.open('modify', project, (project: any) => {
      this.setState({
        project: project
      })
    })
  }

  setCookie(project: any) {
    var ck: any = this.refs.ck;
    ck.open(project, (data: any) => {
      console.log(data);
    })
  }

  setSVN(project: any) {
    var svn: any = this.refs.svn;
    svn.open(project, (data: any) => {
      console.log(data);
    })
  }


  exportDoc(project: any) {
    var de: any = this.refs.de;
    de.open(project)
  }

  importDoc(project: any) {
    const { onDocImpoted } = this.props;

    var di: any = this.refs.di;
    di.open(project, () => {
      // this.selectProject(project);
      onDocImpoted(project);
    })
  }

  /**
   * 展开接口详情
   */
  expandDoc(doc: any) {
    const { expandedrow, docctrls } = this.state;

    if (expandedrow === doc) {
      this.setState({ expandedrow: {} })
    } else {
      this.setState({
        expandedrow: doc
      })
    }
  }

  switchTab(tab: any) {
    this.setState({
      activetab: tab
    })
  }

  render() {
    const { project, docs, category,
      expandedrow, tabs,
      selectOptions,
      selectDocState,
      activetab } = this.state;

    const { user } = this.props;

    let rows: any = [];
    docs.map((doc: any, index: number) => {
      rows.push(
        <tr key={index}>
          <td className="v-align-middle">
            {
              doc.type === 'basic' ? <span className="label">{doc.type.toUpperCase()}</span> :
                doc.type === 'get' ? <span className="label label-info">{doc.type.toUpperCase()}</span> :
                  <span className="label label-success">{doc.type.toUpperCase()}</span>
            }

          </td>
          <td className="v-align-middle">
            {
              <span className="label label-info">
                {this.getDocState.call(this, doc.setting && doc.setting.state ? doc.setting.state : 'developing')}
              </span>
            }

          </td>
          <td className="v-align-middle">
            {
              (doc.setting && doc.setting.url)
                ?
                <a href="javascript:;" onClick={this.expandDoc.bind(this, doc)} >{doc.setting.url}</a>
                :
                null
            }
          </td>
          <td className="clickable v-align-middle">
            &nbsp;&nbsp;

                        {doc.type !== 'basic' && doc.setting
              ?
              <a className="" href="javascript:void(0);" onClick={this.expandDoc.bind(this, doc)}>
                {doc.name}
              </a>
              :
              <a className="" href={'/doc?project=' + project.name + '#' + doc.name} target="__blank">
                {doc.name}
              </a>
            }
          </td>
          <td className=""><span className="muted">{moment(doc.lastModified).fromNow()} </span></td>
          <td className="no-eclipse">
            <a className="" target="__blank" href={'/editDoc?project=' + project.name + '&id=' + doc._id} style={{ marginRight: 5 }}><i className="fa fa-pencil-square-o" />编辑</a>
            <a href="javascript:;" style={{ marginRight: 5 }} className="" onClick={() => {
              let rcm: any = this.refs.rcm;
              rcm.open(doc._id, project, this.selectCategory.bind(this, project, category));
            }}><i className="fa fa-trash-o" />删除</a>
          </td>
        </tr>
      )

      if (expandedrow === doc) {

        let nestedrow = (<tr key={index + 'expand-item'}>
          <td colSpan={3}></td>
          <td colSpan={2} style={{ position: "relative", background: "#fff" }}>
            <div className="grid simple" style={{ position: "absolute", top: 0, right: 0, bottom: 0, left: 0, overflow: 'auto', height: '100%' }}></div>

          </td>
        </tr>)


        nestedrow = <tr>
          <td colSpan={6} style={{ background: "#e5e9ec" }}>
            <DocDetail doc={doc} project={project} setCookie={this.setCookie.bind(this)} selectCategory={this.selectCategory.bind(this)} />
          </td>
        </tr>

        rows.push(nestedrow)
      }
    })


    return (
      <div className="page-content">
        {
          !project.name
            ?
            <div className="content">
              还没有加入任何项目, 可以注册新项目，或通过RTX让相关同事将你加入到已有项目中
                    </div>
            :
            <div className="content">
              <div className="row">
                <div className="col-md-12">
                  <div className="grid simple ">
                    <div className="grid-title no-border">
                      <div className="row">
                        <div className="col-md-12">
                          {
                            project.desc ?
                              <p className="m-l-15">{project.desc}</p>
                              :
                              <p className="muted m-l-15">这家伙很懒，没留下任何项目描述相关的内容</p>
                          }

                          <div className="col-md-12  col-sm-3">
                            <h5 className="normal">
                              成员 ( <span className="text-success">{project.admins.length} 人</span> )
                                            </h5>
                            <ul className="my-friends">
                              {
                                _.map(project.admins, (admin: string) => {
                                  return <li className="text-center">
                                    <div className="">
                                      <img width={35} height={35} src={"//dayu.oa.com/avatars/" + admin + "/profile.jpg"} />
                                    </div>
                                    <p><a href={"RTXLite.HotLink://UserName=" + admin}>
                                      <img src="/img/rtx_min.png" width={10} height={10} />
                                      <span className="rtx-helper">{admin}</span> </a></p>
                                  </li>
                                })
                              }
                            </ul>
                          </div>
                        </div>
                        <div className="col-md-6">
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row-fluid">
                <div className="span12">

                  <div className="">
                    <ul className="nav nav-tabs" id="tab-01">
                      {tabs.map((tab: any, index: number) => {
                        return <li className={activetab === tab ? 'active' : ''}>
                          <a href="javascript:;" onClick={this.switchTab.bind(this, tab)}>
                            <i className={tab.icon}></i>&nbsp;{tab.name} {tab.key === 'info' ? '( ' + docs.length + ' 篇) ' : ''}
                          </a>
                        </li>
                      })}
                    </ul>
                    <div className="tab-content">
                      <div className="tab-pane active">
                        <div className="grid simple ">
                          <div className="grid-title n-b" style={{ height: '3em' }}>
                            <ul className="breadcrumb pull-left">
                              <li>
                                项目：<a onClick={this.selectProject.bind(this, project)} href="javascript:;" className={category ? '' : 'active'}>{project.name}</a>
                              </li>
                              {
                                category ?
                                  <li>
                                    <a href="javascript:;" className="active">{category}</a>
                                  </li>
                                  : null
                              }
                            </ul>
                            <div className="tool pull-right tool-option">
                              <a className="animate-number" href="javascript:;" onClick={this.modifyProjectSetting.bind(this, project)}>
                                <i className="fa fa-cogs"></i>&nbsp;项目设置
                                                            </a>
                              <a className="animate-number" target="__blank" href={"/editDoc?project=" + project.name}>
                                <i className="fa fa-plus"></i>&nbsp;写文档
                                                            </a>
                              <a className="animate-number" href="javascript:;" onClick={this.importDoc.bind(this, project)}>
                                <i className="fa fa-cloud-upload"></i>&nbsp;导入
                                                            </a>

                              <a className="animate-number" href="javascript:;" onClick={this.exportDoc.bind(this, project)}>
                                <i className="fa fa-cloud-download"></i>&nbsp;导出
                                                            </a>

                            </div>
                          </div>

                          <div className="grid-body n-b">
                            {
                              activetab.key === 'info' ?
                                <div>
                                  <div className="col-md-6">
                                    <div className="m-r-10 input-prepend inside search-form no-boarder">
                                      <span className="add-on" style={{ background: "#e2e9ec" }}> <span className="iconset top-search" /></span>
                                      <input type="text"
                                        ref="search"
                                        onFocus={this.startListen.bind(this)}
                                        onBlur={this.stopListen.bind(this)}
                                        className="no-boarder "
                                        placeholder={!category ? '搜索项目 ' + project.name + ' 文档' : '搜索分类 ' + category + ' 文档'}
                                        style={{ width: 300, background: "#E2E9EC" }} />
                                    </div>
                                  </div>

                                  <div className="col-md-3"></div>
                                  <div className="col-md-3">
                                    <Select
                                      name="doc-state"
                                      value={selectDocState}
                                      options={selectOptions}
                                      onChange={this.filterDocsByState.bind(this)}
                                      placeholder="选择接口状态"
                                    />
                                  </div>
                                  <div className="dataTables_wrapper" role="grid">
                                    <table className="table table-striped table-fixed-layout">
                                      <thead>
                                        <tr>
                                          <th className="medium-cell" />
                                          <th className="medium-cell" />
                                          <th className="" />
                                          <th className="" />
                                          <th className="medium-cell" />
                                          <th className="medium-cell" />
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {rows}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                                : activetab.key === 'code' ?
                                  <CodeSyncTab project={project} setSVN={this.setSVN.bind(this)} />
                                  : null
                            }

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        }
        <RemoveConfirmModal ref="rcm" />
        <ProjectModal ref="pm" user={user} />
        <DocExportModal ref="de" />
        <DocImportModal ref="di" />
        <CookieModal ref="ck" />
        <SVNSettingModal ref="svn" />
      </div>
    );
  }
}
