import React, { Component } from 'react';

import PrismaCmsApp from '@prisma-cms/front'

import DevRenderer from "./Renderer";


export default class DevApp extends Component {

  static propTypes = {
  }

  static defaultProps = {
  }

  render() {

    const {
      ...other
    } = this.props;

    return <PrismaCmsApp
      Renderer={DevRenderer}
      // pure={true}
      apolloOptions={{
      }}
      {...other}
    />
  }
}

