
import * as React from "react";
import * as _ from 'lodash';
import ClipboardJS from 'clipboard';

export default class DocInfoTab extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    const { doc } = props;
    let activeresult = null;
    if (doc && doc.setting && doc.setting.result) {
      activeresult = doc.setting.result[0];
    }
    // console.log(activeresult);
    this.state = {
      activeresult: activeresult
    };
  }

  componentDidMount() {
    const Messenger = window.Messenger;
    let clipboard = new ClipboardJS(
      $(this.refs.copybtn).get(0) as Element,
      {
        target: () => {
          return $(this.refs.apiurl).get(0) as Element
        }
      }
    )
    clipboard.on('success', function (e) {
      e.clearSelection();
      Messenger().post({
        message: '已复制!',
        type: "success",
        showCloseButton: true
      });
    });

    clipboard.on('error', function (e) {
      console.error('Action:', e.action);
      console.error('Trigger:', e.trigger);
    });
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { doc } = this.props;
    if (doc._id !== prevProps.doc._id) {
      if (doc.setting && doc.setting.result) {
        this.setState({
          activeresult: doc.setting.result[0]
        })
      } else {
        this.setState({
          activeresult: null
        })
      }
    }
  }

  clip(e: any) {
  }

  selectResult(result: any) {
    this.setState({
      activeresult: result
    })
  }

  beautify(json: string) {
    // const CodeMirror = window.CodeMirror;
    if (json) {
      try {
        json = JSON.stringify(JSON.parse(json), null, '    ');
      } catch (e) {
        /* handle error */
        return json
      }
      var accum: any = [], gutter = [], size = 0;
      var callback = function (str: string, style: any) {
        if (str == "\n") {
          accum.push(<br />);
          // gutter.push('<pre>'+(++size)+'</pre>');
        }
        else if (style) {
          accum.push(<span className={"cm-" + style} > {str} </span>);
        } else {
          accum.push(str);
        }
      }
      // CodeMirror.runMode(json, "javascript", callback);
      return accum;
    }
  }

  render() {
    const { doc, project, selectCategory } = this.props;
    const { activeresult } = this.state;

    let paramrow: any = [];
    if (doc.setting && doc.setting.params) {
      doc.setting.params.map((param: any) => {
        paramrow.push(
          <tr>
            <td className="no-eclipse">{param.name}</td>
            <td className="no-eclipse">{param.type}</td>
            <td className="no-eclipse">{param.required ? '是' : '否'}</td>
            <td className="no-eclipse">{param.default}</td>
          </tr>
        )
        paramrow.push(
          <tr>
            <td style={{ color: '#ddd', borderTop: 'none' }}>(描述)：</td>
            <td style={{ borderTop: 'none' }} colSpan={3} className="no-eclipse">{param.desc}</td>
          </tr>
        )
      })
    }

    let resrow: any = [];
    if (doc.setting && doc.setting.res) {
      doc.setting.res.map((r: any) => {
        resrow.push(
          <tr>
            <td className="no-eclipse">{r.name}</td>
            <td className="no-eclipse">{r.desc}</td>
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

            <a className="m-r-10" href={"/doc/" + project.name + "/" + doc._id} target="__blank">
              <i className="fa fa-share"></i>&nbsp;
                        分享文档</a>

            <a className="m-r-10" href={"/doc?project=" + project.name + "#" + doc.name} target="__blank">
              <i className="fa fa-book"></i>&nbsp;
                        浏览全部文档</a>
            <a href={"/api/mock?project=" + project.name + "&path=" + doc.setting.url} target="__blank">
              <i className="fa fa-puzzle-piece"></i>&nbsp;
              假接口(MOCK)
                    </a>
          </div>
          <div className="input-group col-md-8">
            <div className="input-group-btn">
              <button type="button" className="btn btn-info dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
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
            <input ref="apiurl" type="text" className="form-control disabled theurlininfo" defaultValue={'http://' + (project.apiDomain || '').replace(/https?:\/\//, '') + (doc.setting.url || '').replace(/https?:\/\//, '')} readOnly />
            <button ref="copybtn" type="button" className="btn btn-success" onClick={this.clip.bind(this)}>
              &nbsp;&nbsp;复制&nbsp;&nbsp;
                    </button>
          </div>
        </div>

        <div className="row column-seperation">
          <div className="col-md-6">
            <div className="grid simple vertical blue">
              <div className="grid-body no-border" style={{ paddingBottom: 0, maring: '10px 0 0 0' }}>
                <p>最大请求上限： {doc.setting && doc.setting.qps ? doc.setting.qps : 0} QPS </p>
                <p>平均响应时长： {doc.setting && doc.setting.rt ? doc.setting.rt : 0} MS </p>
              </div>
            </div>
            <div className="grid simple vertical green">
              <div className="grid-title no-border">
                <h5> 请求参数：</h5>
              </div>
              <div className="grid-body no-border" >
                <table className="table table-striped table-fixed-layout table-hover">
                  <tr>
                    <td className="no-eclipse" >字段</td>
                    <td className="no-eclipse" >类型</td>
                    <td className="no-eclipse" >必填</td>
                    <td className="no-eclipse" >默认值</td>
                  </tr>
                  {paramrow}
                </table>
              </div>
            </div>
            <div className="grid simple vertical blue">
              <div className="grid-title no-border">
                <h5> 返回值说明：</h5>
              </div>
              <div className="grid-body no-border">
                <table className="table table-striped table-fixed-layout table-hover">
                  <tr>
                    <td className="medium no-eclipse">字段</td>
                    <td className="">描述</td>
                  </tr>
                  {resrow}
                </table>
              </div>
            </div>
          </div>
          <div className="col-md-6 result-grid">
            <div className="grid-body no-border">
              <p className="res-tip">返回格式：</p>
              <ul className="nav nav-tabs">
                {
                  doc.setting && doc.setting.result ?
                    doc.setting.result.map((item: any) => {
                      return <li className={activeresult === item ? 'active' : ''} onClick={this.selectResult.bind(this, item)}>
                        <a href="javascript:;">
                          {item.name}
                          <span className="">
                            ·
                                                </span>
                        </a>
                      </li>
                    })
                    : '返回值'
                }
              </ul>
              <div className="tab-content" style={{ marginBottom: 0 }}>
                {
                  activeresult
                    ?
                    <pre className="output cm-s-lockitron">
                      {this.beautify(activeresult.code)}
                    </pre>
                    : null
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
