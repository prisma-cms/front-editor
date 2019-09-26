import React from 'react';

import EditorComponent from '../../..';

import MaterialUiTextField from 'material-ui/TextField';
import { EditableObjectContext } from '../../../../context';


class TextField extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    label: undefined,
    helperText: undefined,
    fullWidth: false,
    multiline: false,
    type: "text",
    hide_wrapper_in_default_mode: true,
  }

  static Name = "TextField"
  static help_url = "https://front-editor.prisma-cms.com/topics/editableobject.html";

  onBeforeDrop = () => {

  }

  canBeDropped = (dragItem) => {
    return false;
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelTextField}
      >
        TextField
    </div>);
  }


  renderChildren() {

    return <EditableObjectContext.Consumer>
      {context => {

        const {
          getEditor,
        } = context;


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
