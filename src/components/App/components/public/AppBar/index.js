import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import MuiAppBar from 'material-ui/AppBar';

class AppBar extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    position: "relative",
  }

  static Name = "AppBar"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        AppBar
    </div>);
  }


  getRootElement() {

    return MuiAppBar;
  }

}

export default AppBar;
