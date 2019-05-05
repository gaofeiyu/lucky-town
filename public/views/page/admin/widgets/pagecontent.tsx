import * as React from "react";
import * as _ from 'lodash';
import moment from 'moment';
moment.locale('zh-cn');
// import * as Chart from 'chart.js';


// import { LineChart } from 'react-chartjs'

export class PageContent extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = props.data;
  }

  componentDidMount() {

    const { data, user } = this.props;
    const { readTrending, writeTrending, uvTrending, pvTrending } = data;

    function getDays() {
      var ar = [];
      // var start = moment().add(-15);
      var start = moment().subtract(10, 'd');//.format('YYYY-MM-DD');
      for (var end = moment(start).add(1, 'month'); start.isBefore(end); start.add(1, 'day')) {
        ar.push(start.format('YYYY-MM-DD'));
      }
      return ar;
    }

    var thedays = getDays();

    this.drawChart(this.refs.rt, {
      labels: _.map(readTrending, (d: any) => {
        return d.month
      }),
      datasets: [{
        label: "文档阅读",
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        fill: false,
        data: _.map(readTrending, (d: any) => {
          return d.count;
        })
        // data: _.map(thedays, (day: any, index: number) =>{
        //     var thedata : any = _.find(readTrending, {day: day})
        //     if(thedata) {
        //         return thedata.count
        //     } else {
        //         return 0
        //     }
        // })
      }, {
        label: "文档编辑",
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgb(54, 162, 235)',
        fill: false,
        data: _.map(writeTrending, (d: any) => {
          return d.count;
        })
        // data: _.map(thedays, (day: any, index: number) =>{
        //     var thedata : any = _.find(writeTrending, {day: day})
        //     if(thedata) {
        //         return thedata.count
        //     } else {
        //         return 0
        //     }
        // })
      }]
    });

    this.drawChart(this.refs.dailydata, {
      labels: _.map(pvTrending, (d: any) => d.month),
      datasets: [{
        label: "PV",
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgb(255, 99, 132)',
        fill: false,
        data: _.map(pvTrending, (d: any) => d.count)
        // data: _.map(thedays, (day: any, index: number) =>{
        //     var thedata : any = _.find(pvTrending, {day: day})
        //     if(thedata) {
        //         return thedata.count || 0
        //     } else {
        //         return 0
        //     }
        // })
      }, {
        label: "UV",
        borderColor: 'rgb(54, 162, 235)',
        backgroundColor: 'rgb(54, 162, 235)',
        fill: false,
        data: _.map(uvTrending, (d: any) => d.count)
        // data: _.map(thedays, (day: any, index: number) =>{
        //     var thedata : any = _.find(uvTrending, {day: day})
        //     if(thedata) {
        //         return thedata.uv || 0
        //     } else {
        //         return 0
        //     }
        // })
      }]
    });

  }

  drawChart(dom: any, chartdata: any) {
    var opt = {
      type: 'line',
      data: chartdata,
      options: {
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        },
        layout: {
          padding: {
            left: 20,
            right: 20,
            top: 20,
            bottom: 20
          }
        }
      }
    }

    var ctx = dom.getContext('2d');
    // var myChart = new Chart(ctx, opt);
  }

  componentWillUpdate(nextProps: any, nextState: object) {
  }


  delProject(project: any) {
    var name = project.project;
    let rp: any = this.refs.removeProject;
    rp.open(name, (result: any) => {
      $.ajax({
        url: '/admin/api/analysis/getProjectDocRank',
      })
        .then((result) => {
          this.setState({
            'projectDocsRank': result.projectDocsRank
          })
        })
    })
  }



  render() {
    const { user } = this.props;
    const { activeUserList, activeProjectList, pv, uv,
      projectAddTrending, tpv, tuv, projectDocsRank,
      activeUrlList,
      projectCount,
      docsCount
    } = this.state;

    var chartData = [{
      x: 10,
      y: 20
    }, {
      x: 15,
      y: 10
    }]

    var chartOptions = {}

    return (
      <div className="page-content">
        <div className="content">
          <div className="row m-b-15">
            <div className="col-md-12">
              <div className="grid-title no-border">
                <p>流量分析</p>
                <div className="col-md-6">
                  <div className="tiles white">
                    <div className="tiles-body">
                      <p>项目总数 : {projectCount && projectCount[0] ? projectCount[0].count : 0}</p>
                      <p>总 PV: {pv && pv[0] ? pv[0].pv : 0}</p>
                      <p>今日 PV: {tpv && tpv[0] ? tpv[0].pv : 0}</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="tiles white">
                    <div className="tiles-body">
                      <p>文档总数 : {docsCount && docsCount[0] ? docsCount[0].count : 0}</p>
                      <p>总 UV: {uv && uv[0] ? uv[0].uv : 0}</p>
                      <p>今日 UV: {tuv && tuv[0] ? tuv[0].uv : 0} </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-12">
            <div className="grid simple ">
              <div className="grid-body no-border">
                <div>
                  <canvas ref="dailydata"></canvas>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="col-md-12">
              <div className="grid simple ">
                <div className="grid-title no-border">
                  <p>项目文档排行</p>
                </div>
                <div className="grid-body no-border">
                  <div className="row">
                    <div className="tiles-body">
                      <div className="dataTables_wrapper" role="grid">
                        <table className="table table-striped table-fixed-layout">
                          <thead>
                            <tr>
                              <th className="">名称</th>
                              <th className="">总文档数</th>
                              <th className="">总活跃度</th>
                              <th className="">月活跃度</th>
                              <th className="">总成员数</th>
                              <th className="">核心成员</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              projectDocsRank ? projectDocsRank.map((project: any) => {
                                return <tr>
                                  <td><a href={"/doc?project=" + project.project} target="__blank">{project.project} </a> </td>
                                  <td>{project.docCount}</td>
                                  <td>{project.activeCount}</td>
                                  <td>{project.monthActiveCount}</td>
                                  <td>{project.admins ? project.admins.length : 0}</td>
                                  {
                                    project.admins ?
                                      <td><a target="__blank" href={"//km.oa.com/user/" + project.admins[0]}>
                                        <img className="m-r-5" width={20} src={"//dayu.oa.com/avatars/" + project.admins[0] + "/profile.jpg"} />
                                        {project.admins[0]}</a></td>
                                      : <td>暂无</td>
                                  }
                                </tr>
                              }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row m-b-15">
            <div className="col-md-12">
              <div className="grid-title no-border">
                <p>文档增长趋势</p>
              </div>
              <div className="grid-body no-border">
                <div className="tiles white">
                  <div className="tiles-body">
                    <div>
                      <canvas ref="rt"></canvas>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <div className="col-md-6">
              <div className="grid simple ">
                <div className="grid-title no-border">
                  <p>活跃用户</p>
                </div>
                <div className="grid-body no-border">
                  <div className="row">
                    <div className="tiles-body">
                      <div className="dataTables_wrapper" role="grid">
                        <table className="table table-striped table-fixed-layout" id="emails">
                          <thead>
                            <tr>
                              <th className="">活跃用户</th>
                              <th className="">活跃度</th>
                              <th className="">今日活跃度</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              activeUserList ? activeUserList.map((user: any) => {
                                return <tr>
                                  <td>
                                    <img className="m-r-5" width={20} src={"//dayu.oa.com/avatars/" + user.username + "/profile.jpg"} />
                                    <a target="__blank" href={"//km.oa.com/user/" + user.username}>{user.username}</a>
                                  </td>
                                  <td>{user.activeCount}</td>
                                  <td>{user.todayCount}</td>
                                </tr>
                              }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="grid simple ">
                <div className="grid-title no-border">
                  <p>活跃项目</p>
                </div>
                <div className="grid-body no-border">
                  <div className="row">
                    <div className="tiles-body">
                      <div className="dataTables_wrapper" role="grid">
                        <table className="table table-striped table-fixed-layout" id="emails">
                          <thead>
                            <tr>
                              <th className="">活跃项目</th>
                              <th className="medium-cell">活跃度</th>
                              <th className="medium-cell">阅读活跃</th>
                              <th className="medium-cell">编辑活跃</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              activeProjectList ? activeProjectList.map((project: any) => {
                                return <tr>
                                  <td><a href={"/doc?project=" + project.projectname} target="__blank">{project.projectname} </a> </td>
                                  <td>{project.activeCount}</td>
                                  <td>{project.read}</td>
                                  <td>{project.write}</td>
                                </tr>
                              }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-md-12">
              <div className="grid simple ">
                <div className="grid-title no-border">
                  <p>今日实时</p>
                </div>
                <div className="grid-body no-border">
                  <div className="row">
                    <div className="tiles-body">
                      <div className="dataTables_wrapper" role="grid">
                        <table className="table table-striped table-fixed-layout" id="emails">
                          <thead>
                            <tr>
                              <th className="">URL</th>
                              <th className="medium-cell">PV</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              activeUrlList ? activeUrlList.map((item: any) => {
                                return <tr>
                                  <td>
                                    <a target="__blank" href={item.originalUrl}>{'http://' + location.host + item.originalUrl}</a>
                                  </td>
                                  <td>{item.activeCount}</td>
                                </tr>
                              }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row m-b-15">
            <div className="col-md-12">
              <div className="grid simple ">
                <div className="grid-title no-border">
                  <p>每月新增项目一览</p>
                </div>
                <div className="grid-body no-border">
                  <div className="row">
                    <div className="tiles-body">
                      <div className="dataTables_wrapper" role="grid">
                        <table className="table table-striped table-fixed-layout" id="emails">
                          <thead>
                            <tr>
                              <th className="">月份</th>
                              <th className="">新增项目数量</th>
                            </tr>
                          </thead>
                          <tbody>
                            {
                              projectAddTrending ? projectAddTrending.map((project: any) => {
                                return <tr>
                                  <td>{project.month}</td>
                                  <td>{project.count}</td>
                                </tr>
                              }) : null
                            }
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
