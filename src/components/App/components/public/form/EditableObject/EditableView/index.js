import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../..';
import EditableObject from '..';
import { EditableObjectContext } from '../../../../../context';

class EditableView extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "EditableView"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }


  // canBeParent(parent) {

  //   return parent instanceof EditableObject && super.canBeParent(parent);
  // }


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


  renderMainView() {

    return <EditableObjectContext.Consumer>
      {editableObjectContext => {

        const {
          inEditMode: objectInEditMode,
        } = editableObjectContext;


        return !objectInEditMode ? null : super.renderMainView();

      }}
    </EditableObjectContext.Consumer>

  }


}

export default EditableView;
