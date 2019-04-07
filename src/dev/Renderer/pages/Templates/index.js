import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import View from "./View";

import Page from "../layout";


class TemplatesPage extends Page {


  static propTypes = {
    View: PropTypes.func.isRequired,
  };

  static defaultProps = {
    View,
    first: 10,
  }


  componentWillMount() {

    const {
      query: {
        templatesConnection,
      },
    } = this.context;

    const {
      View,
    } = this.props;

    this.Renderer = graphql(gql(templatesConnection))(View);

    super.componentWillMount && super.componentWillMount();
  }



  render() {

    const {
      Renderer,
    } = this;

    const {
      View,
      where,
      ...other
    } = this.props;


    return <Renderer
      where={{
        ...where,
      }}
      addObject={() => {
        const {
          router: {
            history,
          },
        } = this.context;
        history.push("/templates/create");
      }}
      {...other}
    />
  }
}


export default TemplatesPage; 