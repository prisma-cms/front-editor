import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';


class SudoOnly extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "SudoOnly"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      SudoOnly
    </div>);
  }


  renderChildren() {

    const {
      user: currentUser,
    } = this.context;

    const {
      sudo,
    } = currentUser || {};

    if (!sudo) {
      return null;
    }

    return super.renderChildren();

  }


}

export default SudoOnly;
