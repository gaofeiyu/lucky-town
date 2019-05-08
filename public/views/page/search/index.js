require('@views/assets/styles/no-responsive.scss');
require('@views/assets/styles/style.scss');
require('./index.scss');
const renderClient = require('@views/ClientRender');
const app = require('./main');
renderClient(app);
