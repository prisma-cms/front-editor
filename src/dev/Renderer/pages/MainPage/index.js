import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Page from "../layout";
import DevApp from '../../../App';


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

    return super.render(
      <div>
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
          <DevApp
            children={children || "Main page"}
            {...other}
          >
          </DevApp>
        </div>

      </div>
    );
  }
}


export default DevMainPage;