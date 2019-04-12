import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";
import FrontEditor from "../../../../App";

import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'material-ui';
import PageHeader from './components/PageHeader';
import RootConnector from '../../../../components/Root';



class DevRoot extends PrismaCmsComponent {

  render() {

    return <RootConnector
      {...this.props}
    />
  }

}

export default DevRoot;