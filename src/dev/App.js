import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';

import App from '../App';

import PrismaCmsPerformanceTester from "@prisma-cms/performance";

export default class DevApp extends App {


  render() {

    return <Fragment>
      <div
        id="prisma-cms-performance-tester"
      >
        <PrismaCmsPerformanceTester
          // test={{}}
          props={this.props}
          state={this.state}
          context={this.context}
          prefix="dev_app"
        />
      </div>

      {super.render()}
    </Fragment>
  }

}