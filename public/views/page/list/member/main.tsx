import * as React from "react";

// Contrived example to show how one might use Flow type annotations
function countTo(n: number): string {
  var a = [];
  for (var i = 0; i < n; i++) {
    a.push(i + 1);
  }
  return a.join(', ');
}

export interface Props {
  initialData: any;
  title: string;
}

export interface State {
  count: number;
}

export default class Index extends React.Component<Props, State> {

  count: number = 0;

  constructor(props: Props) {
    super(props);
    this.state = {
      count: 0
    };
  }

  handleClick() {
    console.log('handleClick')
    this.setState({
      count: this.state.count + 2,
    });
  }

  render() {
    return (
      <div>
        <h1>{this.props.initialData.title}</h1>
        <p>Welcome to {this.props.initialData.title} {this.props.initialData.params.id}</p>
        <p>
          I can count to 10:
          {countTo(10)}
        </p>

        <button onClick={this.handleClick.bind(this)}>
          Click ! Number of clicks: {this.state.count}
        </button>
      </div>
    );
  }
}
