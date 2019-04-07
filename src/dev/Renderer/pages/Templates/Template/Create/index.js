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
      },
    },
    _dirty: {
      name: "Page",
    },
  }


  onSave = (result) => {
    // console.log("this result", result);

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