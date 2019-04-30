import * as React from "react";
import * as ReactDOM from "react-dom";
import Header from './layout/Header';
import Body from './layout/Body';

export interface Props{
  title: string;
  page: string;
  param: any;
}

export default class Layout extends React.Component<Props> {

  render() {
    var {page, title} = this.props;
    var cmd = 'var PAGE_DATA=' + safeStringify({
      title: title,
      page: page
    }) + ';';
    var App = require(page).default;
    return (
      <html>
        <Header title={title}>
          <link rel="stylesheet" href="/stylesheets/style.css" />
        </Header>
        <Body>
          <div id="root">
            <App initialData={this.props}></App>
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: cmd,
            }}
          />
          <script src="https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js"></script>
          <script src="https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js"></script>
          <script src="/view_module/index.js"></script>
        </Body>
      </html>
    );
  }
}

function safeStringify(obj: any) {
  return JSON.stringify(obj)
    .replace(/<\/(script)/ig, '<\\/$1')
    .replace(/<!--/g, '<\\!--')
    .replace(/\u2028/g, '\\u2028') // Only necessary if interpreting as JS, which we do
    .replace(/\u2029/g, '\\u2029') // Ditto
}

module.exports = Layout;
