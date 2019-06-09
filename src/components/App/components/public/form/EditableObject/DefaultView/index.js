import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../..';
import EditableObject from '..';

class DefaultView extends EditorComponent {


  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  // }

  static Name = "DefaultView"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }


  canBeParent(parent) {

    return parent instanceof EditableObject && super.canBeParent(parent);
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
