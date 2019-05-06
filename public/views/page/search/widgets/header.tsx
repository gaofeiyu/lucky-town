import * as React from "react";
import * as _ from 'lodash';

export default class Header extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
  }

  /**
   *
   * 创建项目
   */
  createProject() {
    var pm: any = this.refs.pm;
    pm.open('create');
  }

  render() {
    const { user } = this.props;
    return (
      <div className="header navbar navbar-inverse ">
        {/* BEGIN TOP NAVIGATION BAR */}
        <div className="navbar-inner">
          <div className="header-seperation">
            {/* BEGIN LOGO */}
            <a href="/">
              <img src="/assets/img/logo2x.png" className="logo" width={106} height={21} />
            </a>
            {/* END LOGO */}
          </div>
          {/* END RESPONSIVE MENU TOGGLER */}
          <div className="header-quick-nav">
            {/* BEGIN TOP NAVIGATION MENU */}
            <div className="pull-left"></div>
            {/* END TOP NAVIGATION MENU */}
            {/* BEGIN CHAT TOGGLER */}
            <div className="pull-right">
              <a href="https://git.code.oa.com/groups/api-doc" target="__blank" className="issue-back">
                <i className="fa fa-users m-r-5"></i>成为贡献者
                    </a>
              <a href="http://ce.oa.com/products/view/2112?&tab_id=all_issues_btn" target="__blank" className="issue-back">
                <i className="fa fa-question-circle m-r-5"></i>CE反馈
                    </a>
              <a href="https://git.code.oa.com/groups/api-doc/issues" target="__blank" className="issue-back">
                <i className="fa fa-bug m-r-5"></i>ISSUE
                    </a>
              <div className="chat-toggler"> <a href="#" className="dropdown-toggle" id="my-task-list">
                <div className="profile-pic"> <img src={"//dayu.oa.com/avatars/" + user.username + "/profile.jpg"} width={20} height={20} /> </div>
                <div className="user-details">
                  <div className="username">  {user.username} </div>
                </div>
              </a>
              </div>
            </div>
            {/* END CHAT TOGGLER */}
          </div>
          {/* END TOP NAVIGATION MENU */}
        </div>
        {/* END TOP NAVIGATION BAR */}
      </div>
    );
  }
}
