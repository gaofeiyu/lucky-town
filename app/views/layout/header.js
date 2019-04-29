'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
class Header extends react_1.default.Component {
    render() {
        return (react_1.default.createElement("head", null,
            react_1.default.createElement("title", null, this.props.title),
            react_1.default.createElement("meta", { name: 'viewport', content: 'width=device-width, initial-scale=1.0' }),
            this.props.children));
    }
}
exports.default = Header;
;
//# sourceMappingURL=Header.js.map