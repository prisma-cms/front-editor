import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../..';
import EditableObject from '..';

class EditableView extends EditorComponent {


  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  // }

  static Name = "EditableView"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }
  

  canBeParent(parent) {

    return parent.constructor === EditableObject && super.canBeParent(parent);
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
