
import * as React from "react";
import { Modal } from 'react-bootstrap';
import * as _ from 'lodash';

export default class DocExportModal extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);

    this.state = {
      showModal: false,
      isSubmiting: false,
      project: {
      }
    };

    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
  }

  close() {
    this.setState({ showModal: false });
  }

  open(project: any) {
    this.setState({
      showModal: true,
      project: project
    });
  }

  render() {
    const { close, open } = this;
    const { showModal, isSubmiting, project } = this.state;

    return (
      <Modal show={showModal} onHide={close} className="verticle-aligin">
        <Modal.Header closeButton>
          <Modal.Title>文档导出</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <a href={"http://hook.apidoc.oa.com/export/doc?project=" + project.name + "&exporttype=pdf"} className="btn btn-block btn-primary" type="button">
                <i className="fa fa-cloud-download" />&nbsp;&nbsp;PDF(竖版) </a>
            </div>
            <div className="col-md-6 col-sm-6">
              <a href={"http://hook.apidoc.oa.com/export/doc?project=" + project.name + "&exporttype=pdf&oritation=landscape"} className="btn btn-block btn-success" type="button">
                <i className="fa fa-cloud-download" />&nbsp;&nbsp;PDF(横版) </a>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
