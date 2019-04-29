var React = require('react'),
    ReactDOM = require('react-dom'),
    App = require('./Index').default;

var PAGE_DATA = window.PAGE_DATA || {};

ReactDOM.render(
    <App initialData={PAGE_DATA}/>,
    document.getElementById('root')
);
