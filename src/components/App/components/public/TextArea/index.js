import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

import TextIcon from "material-ui-icons/Title";

class TextArea extends EditorComponent {


  static Name = "TextArea"

  onBeforeDrop = () => {

  }


  canBeDropped(dragItem) {

    return false;
  }

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <TextIcon /> TextArea
    </div>);
  }


  // getRenderProps() {

  //   const {
  //     inEditMode,
  //   } = this.getEditorContext();

  //   const {
  //     style,
  //     ...props
  //   } = super.getRenderProps();

  //   return {
  //     contentEditable: inEditMode ? true : false,
  //     suppressContentEditableWarning: true,
  //     onInput: event => {

  //       const {
  //         nativeEvent: {
  //           inputType,
  //         },
  //       } = event;

  //     },
  //     style: {
  //       ...style,
  //       display: "inline-block",
  //     },
  //     ...props,
  //   }
  // }


  // renderMainView() {

  //   return <span
  //     {...this.getRenderProps()}
  //   >
  //   </span>;
  // }


}

export default TextArea;
