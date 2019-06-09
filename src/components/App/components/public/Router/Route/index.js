import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../..';

import Icon from "material-ui-icons/SettingsOverscan";

import { Route as RouterRoute } from "react-router-dom";
import { Typography } from 'material-ui';
import EditorSwitch from '../Switch';

class EditorRoute extends EditorComponent {


  static Name = "EditorRoute"

  static propTypes = {
    ...EditorComponent.propTypes,
    exact: PropTypes.bool.isRequired,
    path: PropTypes.string.isRequired,
    routername: PropTypes.string,
  };

  static defaultProps = {
    ...EditorComponent.defaultProps,
    exact: false,
    path: "",
    routername: "",
  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Router
    </div>);
  }


  prepareDragItemProps() {

    return {
      ...super.prepareDragItemProps(),
      exact: false,
    }
  }


  canBeParent(parent) {

    return parent.constructor === EditorSwitch && super.canBeParent(parent);
  }



  renderMainView() {

    const {
      inEditMode,
    } = this.getEditorContext();

    return inEditMode ? super.renderMainView() : this.renderChildren();

  }



}

export default EditorRoute;
