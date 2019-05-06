import * as React from "react";
import { Modal, Button, FormGroup, Form, Col, FormControl, ControlLabel } from 'react-bootstrap';
import * as _ from 'lodash';

export default class CookieModal extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      showModal: false,
      isSubmiting: false,
      authCookie: ''
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open(project: any, onsaved: Function) {
    $.ajax({
      method: 'get',
      url: '/api/project/auth',
      data: {
        project: project.name
      }
    })
      .then((result) => {
        var authCookie = ''
        if (result.status === 0 && result.data.auth) {
          authCookie = result.data.auth.value;
        }

        this.setState({
          project: project,
          showModal: true,
          authCookie: authCookie
        });
      })
  }

  save() {
    let { project, type, onsaved } = this.state;
    this.setState({
      isSubmiting: true
    })

    let data = {
      authCookie: {
        name: project.name,
        value: this.refobj.coookie.value
      }
    }

    $.ajax({
      method: 'post',
      url: '/api/project/setCookie',
      data: data
    }).then((result) => {
      this.setState({
        showModal: false,
        isSubmiting: false
      });
    })
  }

  refobj: any = {
    coookie: null
  }

  render() {
    const { close, open } = this;
    const { showModal, isSubmiting, authCookie } = this.state;

    return (
      <Modal show={showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>设置Cookie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal style={{ width: '100%' }}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                Cookie认证：
                          </Col>
              <Col sm={9}>
                <FormControl rows={6} componentClass="textarea" inputRef={(input) => this.refobj.coookie = input} defaultValue={authCookie} type="text" placeholder="鉴权要用到的Cookie" />
                <ControlLabel>Cookie设置将被同一项目下所有接口共享</ControlLabel>
              </Col>
            </FormGroup>

          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>取消</Button>
          <Button disabled={isSubmiting} onClick={!isSubmiting ? () => this.save.bind(this)() : null} bsStyle="primary" >确定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
