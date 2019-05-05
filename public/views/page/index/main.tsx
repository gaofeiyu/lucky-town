
import * as React from "react";

import { Sidebar } from './widgets/sidebar';
import { PageContent } from './widgets/pagecontent';
import { Header } from './widgets/header';

import * as _ from 'lodash';

import { bigpipe } from 'views/lib/bigpipe';
bigpipe.ready('pagelet.sidebar', (res: any) => {
  console.log(res);
})

export class Layout extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
    }
  }

  render() {
    const { data, user } = this.props;
    return (
      <div style={{ height: 'inherit' }}>
        {/* BEGIN HEADER */}
        <Header user={user} ref="pageheader" data={data} />
        {/* END HEADER */}

        {/* BEGIN CONTAINER */}
        <div className="page-container row-fluid">
          {/* BEGIN SIDEBAR */}
          <Sidebar ref="sidebar"
            onProjectSelected={(project: any) => {
              let pc: any = this.refs.pagecontent;
              pc.selectProject(project);


              let ph: any = this.refs.pageheader;
              ph.selectProject(project);

            }} onCategorySelected={(project: any, category: string) => {
              let pc: any = this.refs.pagecontent;
              pc.selectCategory(project, category);
            }} user={user} data={data} />
          {/* END SIDEBAR */}

          {/* BEGIN PAGE CONTAINER*/}
          <PageContent ref="pagecontent" onDocImpoted={(project: any) => {
            let sd: any = this.refs.sidebar;
            sd.reloadProjectList(project.name)
          }} user={user} data={data} />
          {/* END PAGE CONTAINER*/}
        </div>

      </div>
    );
  }
}
