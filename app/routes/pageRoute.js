"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var routeConfig = require('../../routeConfig');
var router = express_1.default.Router();
for (var routeKey in routeConfig) {
    if (routeConfig.hasOwnProperty(routeKey)) {
        var routeItem = routeConfig[routeKey];
        addRoute(routeConfig, routeItem);
    }
}
function addRoute(routeConfig, routeItem) {
    var entryName = routeItem.entry || routeKey;
    router.get(routeItem.path, function (req, res, next) {
        var pageProps = {
            title: routeItem.title,
            entry: `${entryName}`,
            page: `./page/${entryName}/main`,
            params: req.params || {}
        };
        res.render('ServerRender', pageProps);
    });
}
module.exports = router;
//# sourceMappingURL=pageRoute.js.map