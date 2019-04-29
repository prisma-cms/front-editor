import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import { Button as MaterialUiButton } from 'material-ui';


class Button extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "Button"

  onBeforeDrop = () => {

  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
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
