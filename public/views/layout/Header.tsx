'use strict';
import React from 'react';

export interface Props{
  title: string;
}

export default class Header extends React.Component<Props>{
  render(){
    return (
      <head>
        <title>{this.props.title}</title>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'/>
        {this.props.children}
      </head>
    );
  }
};
