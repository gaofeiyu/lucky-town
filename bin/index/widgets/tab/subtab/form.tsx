
import * as React from "react";
import * as _ from 'lodash';

import { Form, FormGroup, Col, ControlLabel, FormControl } from 'react-bootstrap'

export class FormParams extends React.Component<any, any>  {

  constructor(props: any, context: any) {
    super(props, context);
    this.state = {}
  }

  componentWillUpdate(nextProps: any, nextState: any) {
    // perform any preparations for an upcoming update
    if (this.props.formdata === nextProps.formdata) {
      return
    }
    var formdata = nextProps.formdata || {};
    var state: any = {};
    _.keys(formdata).map((key) => {
      state[key] = formdata[key];
    });
    this.setState(state);

  }

  injectParams(formData: any, type: string) {
    var form = this.refs.form;
    var params: any = $(form).serializeArray();
    for (var i = 0; i < params.length; i++) {
      var item = params[i];
      formData.append(type + '[' + item.name + ']', item.value);
    }
    if (type === 'params') {
      var files: any = $(form).find('input[type=file]');
      for (var j = 0; j < files.length; j++) {
        var file = files[j];
        if (file && file.files && file.files[0]) {
          formData.append('params[' + file.name + ']', file.files[0], file.files[0].name)
        }
      }
    }
    return formData;
  }

  handleChange(value: any, key: string) {
    var state: any = {};
    state[key] = value
    this.setState(state);
  }

  render() {

    const { params, title, style } = this.props;
    return (<div className="grid simple debug-wrap" style={style}>
      <div className="grid-body no-border" style={{ paddingBottom: 0 }}>
        <fieldset>
          <legend>{title}</legend>
          <form ref="form" style={{ width: '100%' }} className="debug">
            {
              params ? params.map((param: any) => {
                return <FormGroup controlId={param.name} className="form-row row">
                  <Col componentClass={ControlLabel} sm={2}>
                    {param.name}
                  </Col>
                  <Col sm={10}>
                    {
                      param.type && param.type.toLowerCase() === 'file'
                        ?
                        <FormControl key={param.name} type="file" name={param.name} />
                        :
                        <FormControl key={param.name} name={param.name} type="text"
                          placeholder={param.default || param.desc || param.name}
                          onChange={(event: any) => {
                            this.handleChange.call(this, event.target.value, param.name)
                          }}
                          value={this.state[param.name]} />
                    }
                  </Col>
                </FormGroup>

              })
                : <p className="text-center">未定义</p>
            }
          </form>
        </fieldset>
      </div>
    </div>)

  }
}
