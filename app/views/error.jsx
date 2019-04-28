var React = require('react');
var PropTypes = require('prop-types');
var Layout = require('./layout');

class Index extends React.Component {
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

Index.propTypes = {
  title: PropTypes.string,
};

module.exports = Index;
