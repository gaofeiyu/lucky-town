var React = require('react'),
    ReactDOM = require('react-dom');
    
const PAGE_DATA = window.PAGE_DATA || {};

module.exports = function(app){
    App = app.default;
    ReactDOM.render(
        <App initialData={PAGE_DATA}/>,
        document.getElementById('root')
    );

}