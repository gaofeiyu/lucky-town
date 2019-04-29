"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
const ReactDOM = __importStar(require("react-dom"));
const Header_1 = __importDefault(require("./Header"));
const Body_1 = __importDefault(require("./Body"));
class Layout extends React.Component {
    render() {
        var _a = this.props, { settings, _locals, cache } = _a, param = __rest(_a, ["settings", "_locals", "cache"]);
        var cmd = 'var __props=' + safeStringify(param) + ';';
        console.log(cmd);
        return (React.createElement("html", null,
            React.createElement(Header_1.default, { title: this.props.title },
                React.createElement("link", { rel: "stylesheet", href: "/stylesheets/style.css" })),
            React.createElement(Body_1.default, null,
                this.props.children,
                React.createElement("script", { dangerouslySetInnerHTML: {
                        __html: cmd,
                    } }))));
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
if (typeof window !== 'undefined') { //client rendering
    var component = React.createFactory(Layout);
    ReactDOM.render(component(__props), document);
}
module.exports = Layout;
//# sourceMappingURL=index.js.map