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
// Contrived example to show how one might use Flow type annotations
function countTo(n) {
    var a = [];
    for (var i = 0; i < n; i++) {
        a.push(i + 1);
    }
    return a.join(', ');
}
class Index extends React.Component {
    constructor(props) {
        super(props);
        this.count = 0;
        this.state = {
            count: 0
        };
    }
    handleClick() {
        console.log('handleClick');
        this.setState({
            count: this.state.count + 2,
        });
    }
    render() {
        return (React.createElement("div", null,
            React.createElement("h1", null, this.props.initialData.title),
            React.createElement("p", null,
                "Welcome to ",
                this.props.initialData.title),
            React.createElement("p", null,
                "I can count to 10:",
                countTo(10)),
            React.createElement("button", { onClick: this.handleClick.bind(this) },
                "Click ",
                this.props.name,
                "! Number of clicks: ",
                this.state.count)));
    }
}
exports.default = Index;
//# sourceMappingURL=main.js.map