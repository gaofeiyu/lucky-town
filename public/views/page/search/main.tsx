import * as React from "react";
import * as _ from 'lodash';

import PageContent from './widgets/pagecontent';
import Header from './widgets/header';

export default class Search extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    console.log(this.props);
    this.state = {
    }
  }

  render() {
    const { data, user } = this.props.initialData;
    return (
      <div style={{ height: 'inherit' }}>
        {/* BEGIN HEADER */}
        <Header user={user} />
        {/* END HEADER */}

        {/* BEGIN CONTAINER */}
        <div className="page-container row-fluid">
          {/* BEGIN SIDEBAR */}
          {/* END SIDEBAR */}

          {/* BEGIN PAGE CONTAINER*/}
          <PageContent ref="pagecontent" user={user} data={data} />
          {/* END PAGE CONTAINER*/}
        </div>

      </div>
    );
  }
}
