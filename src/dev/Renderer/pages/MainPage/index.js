import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Page from "../layout";
import DevApp from '../../../App';


import RootPage from "../../../../components/pages/Root";

import PrismaCmsPerformanceTester from "@prisma-cms/performance";

class DevMainPage extends Page {

  render() {

    const {

      /**
       * https://github.com/ReactTraining/react-router/issues/5665
       */
      staticContext,

      children,
      ...other
    } = this.props;

    const {
      query,
    } = this.context;


    // console.log("query", query);

    if(!query) {
      return null;
    }

    return super.render(
      <div>
        <div
          id="prisma-cms-performance-tester"
        >
          <PrismaCmsPerformanceTester
            // test={{}}
            props={this.props}
            state={this.state}
            context={this.context}
            prefix="dev_main_page"
          />
        </div>

        <div
          id="buttons"
        >
          <button
            onClick={event => this.forceUpdate()}
          >
            Force update
          </button>
        </div>

        <div
          id="content"
        >
          <RootPage
            // children={children || "Main page"}
            {...other}
          >
          </RootPage>

          {children}

        </div>

      </div>
    );
  }
}


export default DevMainPage;