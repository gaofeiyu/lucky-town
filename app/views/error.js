"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
var Layout = require('./layout/index');
class Error extends React.Component {
    render() {
        return (React.createElement(Layout, { title: this.props.title },
            React.createElement("h1", null, this.props.message),
            React.createElement("h2", null, this.props.error.status),
            React.createElement("pre", null, this.props.error.stack)));
    }
}
exports.default = Error;
//# sourceMappingURL=error.js.map