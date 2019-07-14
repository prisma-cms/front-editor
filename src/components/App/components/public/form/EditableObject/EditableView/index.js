import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../..';
import EditableObject from '..';

class EditableView extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "EditableView"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }


  canBeParent(parent) {

    return parent instanceof EditableObject && super.canBeParent(parent);
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelEditableView}
      >
        EditableView
    </div>);
  }


}

export default EditableView;
