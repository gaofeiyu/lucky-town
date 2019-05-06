import * as React from "react";
import { Modal } from 'react-bootstrap';
import * as _ from 'lodash';

export default class DocImportModal extends React.Component<any, any>  {

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

  open(project: any, onimported: Function) {
    this.setState({
      showModal: true,
      project: project,
      onimported: onimported
    });
  }

  importDoc(file: any) {
    var { project, onimported } = this.state;
    var doc: any = this.refs.doc;

    var formData = new FormData();
    formData.append('importtype', 'postman');
    formData.append('project', project.name);
    for (var x = 0; x < doc.files.length; x++) {
      var file = doc.files[x]
      formData.append('file', file, file.name);
    }

    $.ajax({
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt: any) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            console.log(percentComplete);
            //Do something with download progress
          }
        }, false);
        return xhr;
      },
      type: 'POST',
      url: "/api/importDoc",
      data: formData,
      success: (data) => {
        //Do something on success
        console.log('success', data);
        if (data.status == 0) {
          if (onimported) {
            onimported();
          }

          this.setState({
            showModal: false
          });
        }
      }
    });
  }

  parseCode() {
    var { project, onimported } = this.state;
    var doc: any = this.refs.code;

    var formData = new FormData();
    formData.append('importtype', 'code');
    formData.append('project', project.name);
    for (var x = 0; x < doc.files.length; x++) {
      var file = doc.files[x]
      formData.append('file', file, file.name);
    }

    $.ajax({
      cache: false,
      contentType: false,
      processData: false,
      xhr: function () {
        var xhr = new window.XMLHttpRequest();
        xhr.addEventListener("progress", function (evt: any) {
          if (evt.lengthComputable) {
            var percentComplete = evt.loaded / evt.total;
            console.log(percentComplete);
            //Do something with download progress
          }
        }, false);
        return xhr;
      },
      type: 'POST',
      url: "http://hook.apidoc.oa.com/import/doc/code",
      xhrFields: {
        withCredentials: true
      },
      data: formData,
      success: (data) => {
        //Do something on success
        console.log('success', data);
        if (data.status == 0) {
          if (onimported) {
            onimported();
          }

          this.setState({
            showModal: false
          });
        }
      }
    });
  }

  render() {
    const { close, open } = this;
    const { showModal, isSubmiting, project } = this.state;
    let self = this;

    return (
      <Modal show={showModal} onHide={close} className="verticle-aligin">
        <Modal.Header closeButton>
          <Modal.Title>文档导入</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="row">
            <div className="col-md-6 col-sm-6">
              <div className="btn btn-block btn-primary" data-type="button"><i className="fa fa-cloud-upload" />&nbsp;&nbsp;Postman </div>
              <label className="uploadPlaceholder">
                <input ref="doc" onChange={this.importDoc.bind(this, project)} type="file" name="postman" multiple title="点击上传" style={{ opacity: 0 }} />
              </label>
            </div>

            <div className="col-md-6 col-sm-6">
              <button className="btn btn-block btn-default disabled" disabled type="button">
                <i className="fa fa-cloud-upload" />&nbsp;&nbsp;Swagger(敬请期待)</button>
            </div>
          </div>

          <hr />

          <div className="row">
            <div className="col-md-12 col-sm-12">
              <div className="btn btn-block btn-info" data-type="button" style={{ position: 'relative' }}>
                <i className="fa fa-cloud-upload" />&nbsp;&nbsp;源码

                            <label className="uploadPlaceholder">
                  <input ref="code" onChange={this.parseCode.bind(this, project)} type="file" name="postman" multiple title="点击上传" style={{ opacity: 0 }} />
                </label>
              </div>
              <p className="m-t-10"><a href="http://tapd.oa.com/docmanagement/markdown_wikis/#1010156201006182779" target="__blank"><i className="fa fa-question-circle"></i>&nbsp;语法注释自动关联API文档 </a></p>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
