import * as React from "react";
import { Modal, Button, InputGroup, FormGroup, Form, Col, FormControl, ControlLabel, Checkbox } from 'react-bootstrap';
import * as _ from 'lodash';
import { RemoveProjectConfirmModal } from './projectremove';
const Messenger = window.Messenger;

export class ProjectModal extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {
      showModal: false,
      isSubmiting: false,
      project: {
        name: '',
        url: '',
        desc: '',
        logo: '',
        admins: [],
        apiDomain: '',
        zkname: ''
      },
      pc: false
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  pc() {
    const { pc } = this.state;
    this.setState({
      pc: !pc
    })
  }

  componentDidUpdate() {
    let { project, showModal, isSubmiting } = this.state;

    if (showModal && !isSubmiting) {
    }
  }

  close() {
    this.setState({ showModal: false });
  }

  open(type: string, project: any, onsaved: Function) {
    switch (type) {
      case 'create':
        this.setState({
          showModal: true,
          project: {
            name: '',
            url: '',
            desc: '',
            logo: '',
            admins: [],
            apiDomain: '',
            zkname: '',
          },
          pc: false,
          type: type,
          onsaved: onsaved
        });
        break;
      case 'modify':
        this.setState({
          showModal: true,
          project: project,
          pc: project.isprivate ? true : false,
          type: type,
          onsaved: onsaved
        });
      default:
    }
  }

  save() {
    let { project, type, onsaved } = this.state;
    let { showSuccessTip } = this.props;
    this.setState({
      isSubmiting: true
    })

    let data = {
      name: this.refobj.name.value,
      desc: this.refobj.desc.value,
      url: this.refobj.url.value,
      logo: this.refobj.logo.value,
      admins: this.refobj.admins.value,
      zkname: this.refobj.zkname.value,
      domain: this.refobj.apiDomain.value.replace(/https?:\/\//, ''),
      isprivate: this.refobj.isprivate.checked
    }

    switch (type) {
      case 'create':
        $.ajax({
          method: 'post',
          url: '/api/addProject',
          data: data
        }).then((result) => {
          if (result.status === '1') {
            Messenger().post({
              message: result.msg,
              type: "error"
            });

            this.setState({
              isSubmiting: false,
            });
            return
          }
          if (showSuccessTip) {
            var msg = Messenger().post({
              message: "创建成功！",
              actions: {
                project: {
                  label: "我的项目",
                  action: function () {
                    msg.hide();
                    window.open('/mydoc', '_blank');
                  }
                },
                doc: {
                  label: "写文档",
                  action: function () {
                    msg.hide();
                    window.open('/editDoc?project=' + data.name, '_blank');
                  }
                }
              }
            });
          }
          this.setState({
            showModal: false,
            isSubmiting: false
          });

          if (onsaved) { onsaved(); }
        })
        break;
      case 'modify':
        $.ajax({
          method: 'post',
          url: '/api/updateSettings',
          data: data
        }).then((result) => {
          this.setState({
            showModal: false,
            isSubmiting: false
          });
        })

        if (onsaved) {
          project.admins = data.admins.split(' ');
          project.apiDomain = data.domain;
          project.desc = data.desc;
          project.url = data.url;
          project.logo = data.logo;
          project.zkname = data.zkname;
          project.name = data.name;
          project.isprivate = data.isprivate;
          onsaved(project);
        }
        break;

      default:

    }
  }

  refobj: any = {
    name: null,
    url: null,
    desc: null,
    logo: null,
    admins: null,
    apiDomain: null,
    zkname: null,
    auth: null
  }

  delProject(name: string) {
    let rpcm: any = this.refs.rpcm;
    rpcm.open(name, (result: any) => {
      window.location.reload();
    })
  }

  render() {
    const { close, open } = this;
    const { user } = this.props;
    const { showModal, isSubmiting, type, pc } = this.state;
    const { name, desc, url, logo, apiDomain, zkname, admins, pid } = this.state.project;
    var domain = window.location.host;

    return (
      <Modal show={showModal} onHide={close}>
        <Modal.Header closeButton>
          {
            type === 'create' ?
              <Modal.Title>创建项目</Modal.Title>
              :
              <Modal.Title>修改项目</Modal.Title>
          }
        </Modal.Header>
        <Modal.Body>
          {
            <Form horizontal>
              <p>项目设置</p>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  项目名称：
                          </Col>
                <Col sm={9}>
                  {
                    type === 'modify' ?
                      <FormControl disabled={true} inputRef={(input) => this.refobj.name = input} defaultValue={name} type="text" placeholder="填写后不能修改" />
                      : <FormControl inputRef={(input) => this.refobj.name = input} defaultValue={name} type="text" placeholder="填写后不能修改" />
                  }
                </Col>
              </FormGroup>

              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  项目描述：
                          </Col>
                <Col sm={9}>
                  <FormControl inputRef={(input) => this.refobj.desc = input} defaultValue={desc} type="text" componentClass="textarea" placeholder="例如本文涵盖数据仓库(dataset)、知识图谱平台(kg)、工作流(workflow)、离线架构(userbase) API接口。" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  项目LOGO：
                          </Col>
                <Col sm={9}>
                  <InputGroup>
                    <FormControl inputRef={(input) => this.refobj.logo = input} defaultValue={logo} type="text" placeholder="http://mylogo.png" />
                    <InputGroup.Addon>URL</InputGroup.Addon>
                  </InputGroup>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  管理员：
                          </Col>
                <Col sm={9}>
                  <FormControl inputRef={(input) => this.refobj.admins = input} defaultValue={admins.join(' ')} type="text" componentClass="textarea" placeholder="例如jonahnzhang ，填写RTX名" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  项目地址：
                          </Col>
                <Col sm={9}>
                  <FormControl inputRef={(input) => this.refobj.url = input} defaultValue={url} type="text" placeholder="http://youdomain.com" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  API域名：
                          </Col>
                <Col sm={9}>
                  <FormControl inputRef={(input) => this.refobj.apiDomain = input} defaultValue={apiDomain} type="text" placeholder="ap.yoursite.com" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  IP：
                          </Col>
                <Col sm={9}>
                  <FormControl inputRef={(input) => this.refobj.zkname = input} defaultValue={zkname} type="text" placeholder="IP或名字服务" />
                </Col>
              </FormGroup>
              <FormGroup>
                <Col componentClass={ControlLabel} sm={3}>
                  是否私有：
                          </Col>
                <Col sm={9}>
                  <Checkbox inputRef={(input) => this.refobj.isprivate = input} checked={pc} onChange={(e) => { this.pc.call(this, e) }} inline validationState="success">
                    {pc ? '私有项目' : '公开项目'}
                  </Checkbox>
                </Col>
              </FormGroup>


              {
                type === 'modify' && admins && admins[0] === user.username ?
                  <FormGroup>
                    <Col componentClass={ControlLabel} sm={3}>
                    </Col>
                    <Col sm={9}>
                      <span className="btn btn-danger" onClick={this.delProject.bind(this, name)}>删除项目</span>
                    </Col>
                  </FormGroup>
                  : null
              }
            </Form>
          }
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>取消</Button>
          <Button disabled={isSubmiting} onClick={!isSubmiting ? () => this.save.bind(this)() : null} bsStyle="primary" >确定</Button>
        </Modal.Footer>
        <RemoveProjectConfirmModal ref="rpcm" />
      </Modal>
    );
  }
}
