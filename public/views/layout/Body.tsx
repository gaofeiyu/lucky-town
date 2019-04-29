'use strict';
import React from 'react';

export default class Body extends React.Component {
  render() {
    return (
      <body>
        {this.props.children}
      </body>
    );
  }
};
