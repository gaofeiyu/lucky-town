"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = __importStar(require("react"));
const Header_1 = __importDefault(require("./layout/Header"));
const Body_1 = __importDefault(require("./layout/Body"));
class Layout extends React.Component {
    render() {
        var { page, title } = this.props;
        var cmd = 'var PAGE_DATA=' + safeStringify({
            title: title,
            page: page
        }) + ';';
        var App = require(page).default;
        return (React.createElement("html", null,
            React.createElement(Header_1.default, { title: title },
                React.createElement("link", { rel: "stylesheet", href: "/stylesheets/style.css" })),
            React.createElement(Body_1.default, null,
                React.createElement("div", { id: "root" },
                    React.createElement(App, { initialData: this.props })),
                React.createElement("script", { dangerouslySetInnerHTML: {
                        __html: cmd,
                    } }),
                React.createElement("script", { src: "https://cdn.bootcss.com/react/16.8.6/umd/react.production.min.js" }),
                React.createElement("script", { src: "https://cdn.bootcss.com/react-dom/16.8.6/umd/react-dom.production.min.js" }),
                React.createElement("script", { src: "/view_module/index.js" }))));
    }
}
exports.default = Layout;
function safeStringify(obj) {
    return JSON.stringify(obj)
        .replace(/<\/(script)/ig, '<\\/$1')
        .replace(/<!--/g, '<\\!--')
        .replace(/\u2028/g, '\\u2028') // Only necessary if interpreting as JS, which we do
        .replace(/\u2029/g, '\\u2029'); // Ditto
}
module.exports = Layout;
//# sourceMappingURL=index.js.map