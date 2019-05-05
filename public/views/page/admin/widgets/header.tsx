import * as React from "react";
import * as _ from 'lodash';

export class Header extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      project: null
    };
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
              <div className="chat-toggler"> <a href="#" className="dropdown-toggle" id="my-task-list">
                <div className="user-details">
                  <div className="username">  {user.username} </div>
                </div>
                <div className="iconset top-down-arrow" />
              </a>
                <div className="profile-pic"> <img src={"//dayu.oa.com/avatars/" + user.username + "/profile.jpg"} width={35} height={35} /> </div>
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
