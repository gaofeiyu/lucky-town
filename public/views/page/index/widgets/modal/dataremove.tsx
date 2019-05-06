import * as React from "react";//
import { Modal, Button } from 'react-bootstrap';

import * as _ from 'lodash';

export default class RemoveConfirmModal extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      showModal: false,
      isSubmiting: false
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open(dataid: string, project: any, onremoved: Function) {
    this.setState({
      showModal: true,
      dataid: dataid,
      project: project,
      onremoved: onremoved
    });
  }

  save() {
    let { dataid, onremoved, project } = this.state;
    this.setState({
      isSubmiting: true
    })

    $.ajax({
      method: 'post',
      url: '/api/deleteDoc',
      data: {
        id: dataid,
        project: project.name
      }
    }).then((result) => {
      this.setState({
        showModal: false,
        isSubmiting: false
      });

      if (onremoved) {
        onremoved();
      }
    })
  }

  render() {
    const { dataid } = this.props;
    const { close, open } = this;
    const { showModal, isSubmiting } = this.state;

    return (
      <Modal show={showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>数据删除</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h3>温馨 <span className="semi-bold">提示</span></h3>
          <p>删除后，文档将<code>不可恢复</code> ，确定删除这篇文档 ？</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>取消</Button>
          <Button disabled={isSubmiting} onClick={!isSubmiting ? () => this.save.bind(this)() : null} bsStyle="primary" >确定</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
