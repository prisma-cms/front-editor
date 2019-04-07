import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

import View from "./View";

import Page from "../../layout";


class Template extends Page {


  static propTypes = {
    ...Page.propTypes,
    View: PropTypes.func.isRequired,
  };


  static defaultProps = {
    ...Page.defaultProps,
    View,
    // first: 10,
  }


  // constructor(props) {

  //   console.log("Templates constructor");

  //   super(props)

  // }


  componentWillMount() {

    if (!this.Renderer) {

      const {
        View,
      } = this.props;

      const {
        query: {
          template,
          updateTemplateProcessor,
        },
      } = this.context;

      this.Renderer = compose(
        graphql(gql(template)),
        graphql(gql(updateTemplateProcessor)),
      )(View);

    }

    super.componentWillMount && super.componentWillMount();
  }

  render() {

    const {
      Renderer,
    } = this;

    const {
      View,
      ...other
    } = this.props;

    return <Renderer
      onSave={this.onSave}
      setPageMeta={object => {

        let {
          id,
          name,
        } = object || {};

        name = name || id;

        return this.setPageMeta({
          title: name && `Чат-комната ${name}` || undefined,
          status: id ? 200 : 404,
        })
      }}
      {...other}
    />
  }
}


export default Template; 