import * as React from "react";
import * as _ from 'lodash';
import DocInfoTab from './tab/docinfo';
import DocDebugTab from './tab/docdebug';
import DocRecordTab from './tab/docrecord';

export default class DocDetail extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    const docctrl = [
      {
        name: '接口信息',
        key: 'info',
        icon: "fa fa-circle-o"
      },
      {
        name: '接口调试',
        key: 'debug',
        icon: "fa fa-gear"
      },
      {
        name: '修改记录',
        key: 'updaterecord',
        icon: "fa fa-history"
      }
    ];

    this.state = {
      activedocctrl: docctrl[0],
      docctrls: docctrl
    };
  }

  switchDocCtrl(ctrl: any) {
    this.setState({
      activedocctrl: ctrl
    })
  }

  render() {

    const { activedocctrl, docctrls } = this.state;
    const { doc, project, setCookie, selectCategory } = this.props;

    return (
      <div className="tile">
        <ul className="nav nav-tabs">
          {docctrls.map((ctrl: any, index: number) => {
            return <li className={activedocctrl === ctrl ? 'active' : ''}>
              <a href="javascript:;" onClick={this.switchDocCtrl.bind(this, ctrl)}>
                <i className={ctrl.icon}></i>&nbsp;{ctrl.name}
              </a>
            </li>
          })}
        </ul>
        <div className="tab-content" style={{ marginBottom: 0 }}>
          {
            activedocctrl.key === 'info'
              ?
              <DocInfoTab doc={doc} project={project} selectCategory={selectCategory} />
              :
              activedocctrl.key === 'debug'
                ?
                <DocDebugTab doc={doc} project={project}
                  selectCategory={selectCategory}
                  setCookie={() => { setCookie(project) }}
                />
                :
                activedocctrl.key === 'updaterecord'
                  ?
                  <DocRecordTab doc={doc} project={project} />
                  :
                  null
          }
        </div>
      </div>

    );
  }
}
