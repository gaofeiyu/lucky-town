import * as React from "react";
import * as _ from 'lodash';

import ProjectModal from './modal/project';

export default class Sidebar extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      projectList: props.data.projects,
      selectedProject: props.data.projects[0] || {},
      isSuperAdmin: props.data.isSuperAdmin
    }
  }

  selectProject(project: any) {
    const { user, onProjectSelected, onCategorySelected } = this.props;

    this.setState({
      selectedProject: project
    })
    onProjectSelected(project);
  }


  selectCategory(project: any, category: string) {
    const { user, onProjectSelected, onCategorySelected } = this.props;
    onCategorySelected(project, category);
  }

  reloadProjectList(projectname?: string) {
    $.ajax({
      method: 'get',
      url: '/api/getProjectList'
    })
      .then((result) => {
        this.setState({
          projectList: result,
        })

        var target = _.find(result, { name: projectname });
        if (target) {
          this.selectProject(target);
        } else {
          this.selectProject(result[0]);
        }
      })
  }

  /**
   *
   * 创建项目
   */
  createProject() {
    var pm: any = this.refs.pm;
    pm.open('create', {}, this.reloadProjectList.bind(this));
  }

  render() {
    const { projectList, selectedProject, isSuperAdmin } = this.state;

    return (
      <div>
        {/* BEGIN SIDEBAR */}
        <div className="page-sidebar" id="main-menu">
          {/* BEGIN MINI-PROFILE */}
          <div className="slimScrollDiv" style={{ position: 'relative', overflow: 'hidden', width: 'auto', height: 1096 }}><div className="page-sidebar-wrapper" id="main-menu-wrapper" style={{ overflow: 'hidden', width: 'auto', height: 1096 }}>
            {/* END MINI-PROFILE */}
            {/* BEGIN SIDEBAR MENU */}
            <div className="side-bar-widgets">
              {
                isSuperAdmin ?
                  <div>
                    <p className="menu-title">超级管理员 </p>
                    <ul className="folders">
                      <li><a href="/admin">
                        <div className="status-icon blue" />
                        流量分析 </a> </li>
                    </ul>
                  </div>
                  : null

              }
              <p className="menu-title">操作 </p>
              <ul className="folders">
                <li><a onClick={this.createProject.bind(this)} href="javascript:;">
                  <div className="status-icon green" />
                  注册新项目 </a> </li>
              </ul>
            </div>
            <p className="menu-title">我参与的项目 <span className="pull-right">
              {
                //<a href="javascript:;"><i className="fa fa-refresh" /></a>
              }
            </span></p>
            <ul>
              {(projectList && projectList.length) ?
                projectList.map((project: any, key: number) => {
                  return <li className={[key === 0 ? 'start' : '', project === selectedProject ? 'open' : ''].join(' ')} key={key} onClick={() => { this.selectProject(project); }}>
                    <a href="javascript:;">
                      <i className="fa fa-th" />
                      <span className="title">{project.name}</span>
                      <span className={'arrow ' + (project === selectedProject ? "open" : '')} />
                    </a>
                    <ul className="sub-menu" style={{ overflow: 'hidden', display: project === selectedProject ? 'block' : 'none' }}>
                      {
                        project.category.map((c: any, key: number) => {
                          return <li key={key} onClick={(e: any) => {
                            e.stopPropagation();
                            this.selectCategory(project, c);
                          }}> <a href="javascript:;">{c} </a> </li>
                        })
                      }
                    </ul>
                  </li>
                })
                : ''}
            </ul>
            <div className="clearfix" />
            {/* END SIDEBAR MENU */}
          </div>
          </div>
        </div>
        <div className="footer-widget">
          <div className="text-center"></div>
        </div>
        <ProjectModal ref="pm" />
        {/* END SIDEBAR */}
      </div>
    );
  }
}
