import * as React from "react";
var Layout = require('./layout/index');

export interface Props {
  title: string;
  message: string;
  error: any;
}

export default class Error extends React.Component<Props> {
  render() {
    return (
      <Layout title={this.props.title}>
        <h1>{this.props.message}</h1>
        <h2>{this.props.error.status}</h2>
        <pre>{this.props.error.stack}</pre>
      </Layout>
    );
  }
}
