import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';

import TemplatePage from "../";

class TemplateCreatePage extends TemplatePage {


  static defaultProps = {
    ...TemplatePage.defaultProps,
    data: {
      object: {
        name: "Page",
        props: {},
        components: [],
      },
    },
    _dirty: {
      name: "Page",
      props: {},
      components: [],
    },
  }


  onSave = (result) => {


    // return "Sdfdsf";

    const {
      response,
    } = result.data || {};

    const {
      id,
    } = response && response.data || {}

    if (id) {

      const {
        router: {
          history,
        },
      } = this.context;

      history.push(`/templates/${id}`);

    }
  }

  componentWillMount() {

    if (!this.Renderer) {

      const {
        View,
      } = this.props;

      const {
        query: {
          createTemplateProcessor,
        },
      } = this.context;

      this.Renderer = compose(
        graphql(gql(createTemplateProcessor)),
      )(View);

    }

    super.componentWillMount && super.componentWillMount();
  }

}


export default TemplateCreatePage;