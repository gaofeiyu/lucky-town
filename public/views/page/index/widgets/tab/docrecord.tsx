
import * as React from "react";
import * as _ from 'lodash';
import * as moment from 'moment';
moment.locale('zh-cn');

export default class DocRecordTab extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      records: []
    };
  }

  getUpdateRecord(doc: any) {
    this.setState({
      loading: true
    })
    $.ajax({
      url: '/api/records/docupdate',
      data: {
        docid: doc._id
      }
    })
    .then((result) => {
      if (result.state == '0') {
        this.setState({
          records: result.data,
          loading: false
        })
      } else {
        this.setState({
          loading: false
        })
      }
    })
  }

  componentDidMount() {
    const { doc } = this.props;
    this.getUpdateRecord(doc);
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    const { doc } = this.props;
    if (doc._id !== prevProps.doc._id) {
      this.getUpdateRecord(doc);
    }
  }

  render() {
    const { doc, project } = this.props;
    const { loading, records } = this.state;

    return (
      <div className="tab-pane active">
        {
          loading ?
            <div className="null-content">
              <h3><i className="fa fa-spinner fa-spin"></i>加载中,请稍候</h3>
            </div>
            : records.length ?
              <div>
                {
                  records.map((item: any) => {

                    return <div className="post comments-section">
                      <div className="user-profile-pic-wrapper">
                        <div className="user-profile-pic-normal">
                          <img width={35} height={35} src={"//dayu.oa.com/avatars/" + item.username + "/profile.jpg"} />
                        </div>
                      </div>
                      <div className="info-wrapper">
                        <div className="username">
                          <a href={"RTXLite.HotLink://UserName=" + item.username} className="">
                            <img src="/img/rtx_min.png" width={10} height={10} />
                            <span className="rtx-helper"> {item.username} </span>
                          </a>
                        </div>
                        <div className="info">
                          <span className="muted">{moment.unix(item.accesstime).format('llll')}</span>
                          &nbsp; 修改了文档
                                              </div>
                      </div>
                      <div className="clearfix" />
                    </div>
                  })
                }
              </div>
              :
              <div className="null-content">
                <h3><i className="fa fa-frown-o"></i>暂无修改记录</h3>
              </div>
        }
      </div>
    );
  }
}
