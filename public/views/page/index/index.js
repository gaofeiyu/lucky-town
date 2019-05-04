require('styles/common/base.scss');
const app = require('./main');

const renderClient = require('public/views/ClientRender');
renderClient(app);