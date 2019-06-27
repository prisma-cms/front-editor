import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import MaterialUiButton from 'material-ui/Button';


class Button extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "Button"

  onBeforeDrop = () => {

  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
      className={classes.panelButton}
    >
      Button
    </div>);
  }



  getRootElement() {

    return MaterialUiButton;
  }


}

export default Button;
