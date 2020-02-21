import React from 'react';

import EditorComponent from '../../..';

import MaterialUiTextField from 'material-ui/TextField';
import { EditableObjectContext } from '../../../../context';

import moment from "moment";

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

    const {
      name,
      type,
      ...other
    } = this.getComponentProps(this);

    return <EditableObjectContext.Consumer
      key="editableobject_context"
    >
      {context => {

        const {
          getEditor,
          getObjectWithMutations,
        } = context;

        if (!getObjectWithMutations) {
          return null;
        }

        let {
          [name]: value,
        } = getObjectWithMutations();

        switch (type) {

          case "date":

            {
              const date = value ? moment(value) : "";

              if (date && date.isValid()) {

                value = date.format("YYYY-MM-DD");

              }
            }

            break;


          case "time":

            {
              const date = value ? moment(value) : "";

              if (date && date.isValid()) {

                value = date.format("HH:mm");

              }
            }

            break;

          /**
          file value can not be setted
           */
          case "file":
            value = undefined;
            break;

          default: value = value || "";

        }

        return getEditor ? getEditor({
          ...other,
          name,
          type,
          value: value,
          Editor: MaterialUiTextField,
          // ...this.getComponentProps(this),
        }) : super.renderChildren();

      }}
    </EditableObjectContext.Consumer>

    // return super.renderMainView({
    //   label: "FDSgdsf",
    // });
  }


}

export default TextField;
