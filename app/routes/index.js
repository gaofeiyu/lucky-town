var express = require('express');
var router = express.Router();
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('Layout', { page: './page/index/Index', title: 'Express' });
});
module.exports = router;
//# sourceMappingURL=index.js.map