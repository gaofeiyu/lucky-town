import * as React from "react";
import { Modal, Button, InputGroup, FormGroup, Form, Col, FormControl, ControlLabel } from 'react-bootstrap';
import * as _ from 'lodash';

export default class SVNSettingModal extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      showModal: false,
      isSubmiting: false,
      authCookie: '',
      project: {}
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open(project: any, onsaved: Function) {
    this.setState({
      project: project,
      showModal: true
    });
  }

  save() {
    let { project, type, onsaved } = this.state;
    this.setState({
      isSubmiting: true
    })


    var svnbaseurl = this.refobj.svnbase.value;

    $.ajax({
      method: 'post',
      url: '/api/updateSVNSettings',
      data: {
        name: project.name,
        svnbase: svnbaseurl
      }
    }).then((result) => {
      project.svnbase = svnbaseurl;
      this.setState({
        showModal: false,
        isSubmiting: false,
        project: project
      });
    })
  }

  refobj: any = {
    svnbase: null
  }

  handleChange(value: any) {
    let { project } = this.state;
    project.svnbase = value;
    this.setState({
      project: project
    });
  }

  render() {
    const { close, open } = this;
    const { showModal, isSubmiting, project } = this.state;

    return (
      <Modal show={showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>设置SVN</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form horizontal style={{ width: '100%' }}>
            <FormGroup>
              <Col componentClass={ControlLabel} sm={3}>
                SVN BASE URL：
                          </Col>
              <Col sm={9}>
                <FormControl rows={6} inputRef={(input) => this.refobj.svnbase = input} value={project ? project.svnbase : ''}
                  type="text"
                  placeholder="http://bj-scm.tencent.com/web/"
                  onChange={(event: any) => {
                    this.handleChange.call(this, event.target.value)
                  }}
                />
                <ControlLabel>SVN BASE URL</ControlLabel>
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
