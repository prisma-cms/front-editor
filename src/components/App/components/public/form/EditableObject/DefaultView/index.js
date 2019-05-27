import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../..';

class DefaultView extends EditorComponent {


  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  // }

  static Name = "DefaultView"

  onBeforeDrop = () => {

  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelDefaultView}
    >
      DefaultView
    </div>);
  }


}

export default DefaultView;
