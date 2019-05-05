
import * as React from "react";
import * as _ from 'lodash';
import { FormParams } from './subtab/form';
import * as Q from 'q';
const Messenger = window.Messenger;

export class DocDebugTab extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    const paramctrl = [
      {
        name: '自定义Headers',
        key: 'headers',
        icon: "fa fa-circle-o"
      },
      {
        name: '请求参数',
        key: 'params',
        icon: "fa fa-circle-o"
      }
    ];

    this.state = {
      result: null,
      status: null,
      errmsg: null,
      paramctrl: paramctrl,
      activectrl: paramctrl[1]
    };
  }

  switchPramCtrl(ctrl: any) {
    this.setState({
      activectrl: ctrl
    })
  }

  paramform: null;

  headerform: null;

  apiDebug() {

    const s_url_ele: any = this.refs.s_url;
    const { project, doc } = this.props;

    let formData = new FormData();

    formData.append('s_project', project.name);
    formData.append('s_version', project.version);
    formData.append('s_doc_id', doc._id);
    formData.append('s_url', s_url_ele.value);

    var paramsform: any = this.refs.paramsform;
    var headerform: any = this.refs.headerform;

    formData = paramsform.injectParams(formData, 'params');
    formData = headerform.injectParams(formData, 'headers');

    this.setState({
      debuging: true
    });

    let requesturl = doc.setting.url

    var i = 0;

    Messenger().expectPromise(() => {
      return Q.Promise((resolve: any, reject: any) => {
        $.ajax({
          method: 'post',
          url: '/api/proxy',
          data: formData,
          processData: false,
          contentType: false
        }).then((result) => {
          if (result.status == "0") {
            this.setState({
              status: 0,
              result: result.data,
              debuging: false
            })
            if (400 <= parseInt(result.data.statusCode, 10)) {
              reject(result.data.statusCode + ' : ' + requesturl);
            } else {
              resolve(result.data.statusCode + ' : ' + requesturl);
            }
          } else {
            this.setState({
              status: 1,
              errmsg: result.msg,
              debuging: false
            })
            reject(requesturl + ' ' + result.msg);
          }
        }).fail(reject)
      })
    }, {
        progressMessage: requesturl + ' 请求中',
        showCloseButton: true
      });
  }

  useDefaultsAsParmas(params: any) {
    let formData: any = {};
    _.forEach(params, (param: any) => {
      formData[param.name] = param.default || param.desc
    })
    this.setState({
      params: formData
    })
  }

  render() {
    const { doc, project, selectCategory, setCookie } = this.props;
    const { result, debuging, paramctrl, activectrl, status, errmsg, params } = this.state;

    let paramrow: any = [];
    if (doc.setting && doc.setting.params) {
      doc.setting.params.map((param: any) => {
        paramrow.push(
          <tr>
            <td className="no-eclipse">{param.name}</td>
            <td className="no-eclipse">{param.type}</td>
            <td className="no-eclipse">{param.required ? '是' : '否'}</td>
            <td className="no-eclipse">{param.desc}</td>
            <td className="no-eclipse">{param.default}</td>
          </tr>
        )
      })
    }

    return (
      <div className="tab-pane active">
        <div className="tile m-t-10 m-b-10">
          <h4 className="semi-bold col-md-8">
            {
              selectCategory ?
                <a onClick={() => { selectCategory(project, doc.category, doc._id) }} href="javascript:;">{doc.category + ' : '} &nbsp;</a>
                : <a href={"/doc?project=" + project.name} target="_blank">
                  {project.name} &nbsp;:&nbsp;
                        </a>
            }
            <span>{doc.name}</span>
          </h4>
          <div className="col-md-4 m-t-10 text-right">
            <a className="m-r-10" href={"/doc?project=" + project.name + "#" + doc.name} target="__blank">
              <i className="fa fa-book"></i>&nbsp;
                        浏览</a>
            <a href={"/api/mock?project=" + project.name + "&path=" + doc.setting.url} target="__blank">
              <i className="fa fa-puzzle-piece"></i>&nbsp;
              MOCKDATA
                    </a>
          </div>
          <div className="row">
            <div className="col-md-8">
              <div className="input-group">
                <div className="input-group-btn">
                  <button type="button" className="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    &nbsp;&nbsp;{doc.type}&nbsp;&nbsp;
                              </button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#">Action</a>
                    <a className="dropdown-item" href="#">Another action</a>
                    <a className="dropdown-item" href="#">Something else here</a>
                    <div role="separator" className="dropdown-divider" />
                    <a className="dropdown-item" href="#">Separated link</a>
                  </div>
                </div>
                <span className="input-group-addon">{'http://' + (project.apiDomain || '').replace(/https?:\/\//, '')}</span>
                <input ref="s_url" type="text" className="form-control" defaultValue={(doc.setting.url || '').replace(/https?:\/\//, '')} />
                <div className="input-group-btn">
                  {
                    debuging
                      ?
                      <button type="button" className="btn btn-success disabled" dsiabled >
                        &nbsp;&nbsp;请求中...&nbsp;&nbsp;
                                    </button>
                      :
                      <button type="button" className="btn btn-success" onClick={this.apiDebug.bind(this)}>
                        &nbsp;&nbsp;请求&nbsp;&nbsp;
                                    </button>
                  }
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              {doc && doc.setting && doc.setting.params ?
                <button type="button" className="btn btn-info" onClick={this.useDefaultsAsParmas.bind(this, doc.setting.params)}>
                  填入默认值
                                </button>
                : null
              }

              <button type="button" className="btn btn-info m-l-10" onClick={() => { setCookie() }} >
                设置Cookie
                        </button>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-12">

            <ul className="nav nav-pills">
              {paramctrl.map((ctrl: any, index: number) => {
                return <li className={activectrl === ctrl ? 'active' : ''}>
                  <a href="javascript:;" onClick={this.switchPramCtrl.bind(this, ctrl)}>
                    &nbsp;{ctrl.name}
                  </a>
                </li>
              })}
            </ul>

            <div className="tab-content" style={{ marginBottom: 0 }}>

              <FormParams
                ref="paramsform"
                title={'请求参数'}
                params={doc.setting && doc.setting.params ? doc.setting.params : null}
                style={activectrl.key === 'params' ? {} : { display: 'none' }}
                formdata={params}
              />
              <FormParams
                ref="headerform"
                title={'自定义Header'}
                params={doc.setting && doc.setting.headers ? doc.setting.headers : null}
                style={activectrl.key === 'headers' ? {} : { display: 'none' }}
              />
            </div>
          </div>
          {

            debuging ?
              <div className="col-md-12 debug-wrap">
                <div className="grid-body no-border api-debug-result">
                  <fieldset>
                    <legend>请求中</legend>
                    <p className="text-center">
                      <i className="fa fa-spinner fa fa-spin"></i>&nbsp;请求中,请稍候
                                    </p>
                  </fieldset>
                </div>
              </div>
              : status === 0 && result
                ?
                <div className="col-md-12">
                  <div className="grid-title no-border">
                  </div>
                  <div className="grid-body no-border api-debug-result">
                    <div className="data-status">
                      {parseInt(result.statusCode, 10) < 400
                        ?
                        <i className="fa fa-circle text-success"></i>
                        :
                        <i className="fa fa-circle text-error"></i>
                      }
                      &nbsp;{result.statusCode}
                    </div>
                    <div className="data-body">
                      <pre style={{ height: '200px', whiteSpace: 'pre-wrap', marginBottom: '0' }}>{result.body}</pre>
                    </div>
                    <table className="data-info table table-striped table-fixed-layout table-bordered">
                      <tr>
                        <th className="medium">Method</th>
                        <td className="no-eclipse">{result.method}</td>
                      </tr>

                      <tr>
                        <th>Request Headers</th>
                        <td className="no-eclipse"><pre>{result.requestHeaders}</pre></td>
                      </tr>

                      <tr>
                        <th >URL</th>
                        <td className="no-eclipse">{result.url}</td>
                      </tr>

                      <tr>
                        <th>Request Data</th>
                        <td className="no-eclipse"><pre>{result.data}</pre></td>
                      </tr>

                      <tr>
                        <th>status</th>
                        <td className="no-eclipse">{result.statusCode}</td>
                      </tr>
                      <tr>
                        <th>Response Headers</th>
                        <td className="no-eclipse"><pre>{result.responseHeaders}</pre></td>
                      </tr>
                    </table>
                  </div>
                </div>
                : status === 1 && errmsg ?
                  <div className="col-md-12 debug-wrap">
                    <div className="grid-body no-border api-debug-result">
                      <fieldset>
                        <legend>请求出错</legend>
                        <p className="text-center">{errmsg}</p>
                        <p className="text-center">请检查下，项目Cookie是否已过期或为设置？</p>
                      </fieldset>
                    </div>
                  </div>
                  : null
          }
        </div>
      </div>

    );
  }
}
