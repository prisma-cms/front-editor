import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../..';

import { TextField as MaterialUiTextField } from 'material-ui';
import { EditableObjectContext } from '../../../../context';


class TextField extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    label: undefined,
    helperText: undefined,
    fullWidth: false,
    multiline: false,
    type: "text",
  }

  static Name = "TextField"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }

  canBeDropped = (dragItem) => {
    return false;
  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelTextField}
    >
      TextField
    </div>);
  }



  // getRootElement() {

  //   return MaterialUiTextField;
  // }


  // renderMainView(renderProps) {

  //   return <EditableObjectContext.Consumer>
  //     {context => {

  //       const {
  //         getEditor,
  //       } = context;

  //       // return getEditor ? getEditor

  //       console.log("EditableObjectContext context", context);
  //       {/* 
  //       return getEditor ? getEditor({
  //         Editor: TextField,
  //       }) : super.renderMainView(renderProps); */}

  //       {/* return getEditor ? getEditor({
  //         Editor: super.renderMainView,
  //         // Editor: renderProps => "Sdfsdfsdf",
  //       }) : super.renderMainView(renderProps); */}

  //       return super.renderMainView(renderProps)

  //     }}
  //   </EditableObjectContext.Consumer>

  //   // return super.renderMainView({
  //   //   label: "FDSgdsf",
  //   // });
  // }


  renderChildren() {

    return <EditableObjectContext.Consumer>
      {context => {

        const {
          getEditor,
        } = context;

        // return getEditor ? getEditor

        {/* console.log("EditableObjectContext context", context); */}

        return getEditor ? getEditor({
          ...this.getComponentProps(this),
          Editor: MaterialUiTextField,
        }) : super.renderChildren();

      }}
    </EditableObjectContext.Consumer>

    // return super.renderMainView({
    //   label: "FDSgdsf",
    // });
  }


}

export default TextField;
