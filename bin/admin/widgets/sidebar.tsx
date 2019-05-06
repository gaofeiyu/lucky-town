import * as React from "react";
import * as _ from 'lodash';

export class Sidebar extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
    }
  }

  selectCategory(project: any, category: string) {
  }

  render() {


    return (
      <div>
        {/* BEGIN SIDEBAR */}
        <div className="page-sidebar" id="main-menu">
          {/* BEGIN MINI-PROFILE */}
          <div className="slimScrollDiv" style={{ position: 'relative', overflow: 'hidden', width: 'auto', height: 1096 }}><div className="page-sidebar-wrapper" id="main-menu-wrapper" style={{ overflow: 'hidden', width: 'auto', height: 1096 }}>
            {/* END MINI-PROFILE */}
            {/* BEGIN SIDEBAR MENU */}

            <div className="user-info-wrapper">
              <div className="profile-wrapper"> <img src="/images/sample-logo.png" height={69} /> </div>
              <div className="user-info">
                <div className="greeting">管理员</div>
              </div>
            </div>

            <p className="menu-title">我参与的项目 <span className="pull-right">
              {
                //<a href="javascript:;"><i className="fa fa-refresh" /></a>
              }
            </span></p>

            <p className="menu-title">超级管理员 </p>
            <ul className="folders">
              <li className="active"><a href="/admin"><div className="status-icon blue" />
                流量分析 </a> </li>
            </ul>
            <p className="menu-title">操作 </p>
            <ul className="folders">
              <li><a href="/"><div className="status-icon green" />
                我参与的项目 </a> </li>
            </ul>
            <div className="clearfix" />
            {/* END SIDEBAR MENU */}
          </div>
          </div>
        </div>
        <div className="footer-widget">
          <div className="text-center"></div>
        </div>
        {/* END SIDEBAR */}
      </div>
    );
  }
}
