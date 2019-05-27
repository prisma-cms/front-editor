import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../..';

class EditableView extends EditorComponent {


  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  // }

  static Name = "EditableView"

  onBeforeDrop = () => {

  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelEditableView}
    >
      EditableView
    </div>);
  }


}

export default EditableView;
