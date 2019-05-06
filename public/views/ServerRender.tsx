import * as React from "react";
import Header from './layout/Header';
import Body from './layout/Body';

export interface Props{
  title: string;
  page: string;
  params: any;
  entry: string;
  data: string;
  user: string;
}

export default class Layout extends React.Component<Props> {

  render() {
    var {page, title, entry, params, data, user} = this.props;
    var cmd = 'var PAGE_DATA=' + safeStringify({
      title,
      page,
      entry,
      params,
      data,
      user
    }) + ';';
    var App = null;

    if(page){
      App = require(page).default;
    }

    return (
      <html>
        <Header title={title}>
          <link rel="stylesheet" href={`/common/base.css`} />
        </Header>
        <Body>
          <div id="root">
            { page? <App initialData={this.props}></App> : this.props.children }
          </div>
          <script
            dangerouslySetInnerHTML={{
              __html: cmd,
            }}
          />
          <script src="https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js"></script>
          <script src="https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js"></script>
          <script src={`/page/${entry}/index.js`}></script>
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
