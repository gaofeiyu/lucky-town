import PageProps from 'pageProps';
import express from 'express';

var routeConfig = require('../../routeConfig');

var router = express.Router();

for (var routeKey in routeConfig) {
  if (routeConfig.hasOwnProperty(routeKey)) {
    var routeItem = routeConfig[routeKey];
    addRoute(routeItem);
  }
}

function addRoute(routeItem: any):any{
  var entryName = routeItem.entry || routeKey;
  router.get(routeItem.path, function (req: any, res: any, next: any) {
    var pageProps: PageProps = {
      title: routeItem.title,
      entry: `${entryName}`,
      page: `./page/${entryName}/main`,
      params: req.params || {}
    }
    res.render('ServerRender', pageProps);
  });

}

module.exports = router;
