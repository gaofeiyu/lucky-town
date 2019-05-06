import * as React from "react";
import * as _ from 'lodash';
import * as Clipboard from 'clipboard';
const Messenger = window.Messenger;

export class CodeSyncTab extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    const steps = [
      {
        title: '将@apidoc设为项目成员',
        key: 1
      },
      {
        title: '设置WebHook',
        key: 2
      },
      {
        title: '注释语法',
        key: 3
      },
      {
        title: '提交代码，自动生成文档',
        key: 4
      }
    ]

    this.state = {
      steps: steps,
      selectstep: steps[0]
    }
  }

  componentDidMount() {
    this.clipboard(this.refs.copygit, this.refs.gitpost);
    this.clipboard(this.refs.copysvn, this.refs.svnpost);
  }

  clipboard(ref: any, post: any) {
    let clipboard = new Clipboard(
      $(ref).get(0), {
        target: () => {
          return $(post).get(0)
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

  switchStep(step: any) {
    this.setState({
      selectstep: step
    })
  }

  render() {
    const { project, setSVN } = this.props;
    const { steps, selectstep } = this.state;
    return (
      <div>
        <div className="tile m-b-30">
          <div className="input-group col-md-8">
            <div className="input-group-btn">
              <button type="button" className="btn btn-info dropdown-toggle">
                &nbsp;&nbsp;GIT&nbsp;&nbsp;
                            </button>
            </div>
            <input ref="gitpost" type="text" className="form-control disabled theurlininfo" value={'http://hook.apidoc.oa.com/git/' + project.pid + '/post'} readOnly />
            <div className="input-group-btn">
              <button ref="copygit" type="button" className="btn btn-success">
                &nbsp;&nbsp;复制&nbsp;&nbsp;
                            </button>
            </div>
          </div>
        </div>

        <div className="tile m-b-30">
          <div className="input-group col-md-8">
            <div className="input-group-btn">
              <button type="button" className="btn btn-primary dropdown-toggle">
                &nbsp;&nbsp;SVN&nbsp;&nbsp;
                            </button>
            </div>
            <input ref="svnpost" type="text" className="form-control disabled theurlininfo" value={'http://hook.apidoc.oa.com/svn/' + project.pid + '/post'} readOnly />
            <div className="input-group-btn">
              <button ref="copysvn" type="button" className="btn btn-primary">
                &nbsp;&nbsp;复制&nbsp;&nbsp;
                            </button>

              <button type="button" onClick={() => { setSVN(project) }} className="btn btn-danger">
                &nbsp;&nbsp;设置&nbsp;&nbsp;
                            </button>

            </div>
          </div>
        </div>
        <div className="tile col-md-10 m-b-10">
          <div className="form-wizard-steps">
            <ul className="wizard-steps form-wizard">
              {
                steps.map((step: any, index: number) => {
                  return <li className={selectstep === step ? 'active' : ''}>
                    <a href="javascript:;" onClick={this.switchStep.bind(this, step)}>
                      <span className="step">{index + 1}</span>
                      <span className="title">{step.title}</span>
                    </a>
                  </li>
                })
              }
            </ul>
            <div className="clearfix" />
          </div>
          <div className="tab-content how-to-use">
            <div className="tab-pane active">
              <br />
              <hr />
              <br />
              {
                selectstep.key === 1 ?
                  <div>
                    <h4>GIT : </h4>
                    <ol className="bold">
                      <li><p className="normal">
                        登录 http://git.code.oa.com/ 在项目成员页面 添加 <strong>@apidoc</strong> 为 <strong>developer</strong>
                      </p></li>
                    </ol>
                    <div className="m-t-10">
                      <img src="/images/step-1.png" />
                    </div>

                    <h4>SVN : </h4>
                    <ol className="bold">
                      <li><p className="normal">
                        打开 http://code.oa.com/v2/form/permission/apply 添加 <strong>@apidoc</strong>  <strong>只读权限</strong>
                      </p></li>
                    </ol>
                    <div className="m-t-10">
                      <img src="/images/svn-step-1.png" />
                    </div>

                  </div>
                  : selectstep.key === 2 ?
                    <div>
                      <h4>GIT: </h4>
                      <ol className="bold">
                        <li><p className="normal">
                          在 http://git.code.oa.com/ 项目设置页面 找到<strong>Web Hook</strong>设置
                                            </p></li>
                        <li><p className="normal">
                          从 http://api.doc.com 找到 <strong>代码关联</strong> 中的git链接，填入保存
                                            </p></li>
                      </ol>
                      <div className="m-t-10">
                        <img src="/images/step-2.1.png" />
                        <img src="/images/step-2.2.png" />
                      </div>

                      <h4>SVN: </h4>
                      <ol className="bold">
                        <li><p className="normal">
                          打开 http://code.oa.com/v2/tool/webhooks/init?comefrom=code , 设置webhook
                                            </p></li>
                        <li><p className="normal">
                          从 http://api.doc.com 找到 <strong>代码关联</strong> 中的svn链接，填入保存
                                            </p></li>
                      </ol>
                      <div className="m-t-10">
                        <img src="/images/step-2.1.png" />
                        <img src="/images/svn-step-2.2.png" />
                      </div>

                    </div>
                    : selectstep.key === 3 ?
                      <div>
                        <ol className="bold">
                          <li><p className="normal">
                            书写符合文档自动生成语法规则的 代码注释
                                            </p></li>
                          <li><p className="normal">
                            支持几乎所有编程语言类型的注释 PHP, Python, Typescript, Go, Java, Lua 等等...
                                            </p></li>
                        </ol>
                        <div className="m-t-10">
                          <img src="/images/step-3.png" />
                        </div>
                      </div>
                      : selectstep.key === 4 ?
                        <div>
                          <ol className="bold">
                            <li><p className="normal">
                              每次执行 <strong>git push</strong> 操作时，接口文档将自动生成
                                            </p></li>
                          </ol>
                          <div className="m-t-10">
                            <img src="/images/step-4.png" />
                          </div>
                        </div>
                        : null
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}
