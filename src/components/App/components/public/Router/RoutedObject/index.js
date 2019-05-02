import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

import Icon from "material-ui-icons/SettingsOverscan";

import { Route as RouterRoute } from "react-router-dom";
import { Typography } from 'material-ui';

class RoutedObject extends EditorComponent {


  static Name = "RoutedObject"

  // static propTypes = {
  //   ...EditorComponent.propTypes,
  // };

  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  // }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Routed Object
    </div>);
  }


  // renderChildren() {




  //   return super.renderChildren();
  // }

}

export default RoutedObject;
