"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = __importDefault(require("../views/index"));
const routes = [
    {
        path: '/',
        exact: true,
        component: index_1.default
    }
];
exports.default = routes;
//# sourceMappingURL=routes.js.map
