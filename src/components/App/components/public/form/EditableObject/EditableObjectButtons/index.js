import React from 'react';

import EditorComponent from '../../../..';
import { EditableObjectContext } from '../../../../../context';


class EditableObjectButtons extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "EditableObjectButtons"
  static help_url = "";

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelEditableObjectButtons}
      >
        EditableObjectButtons
    </div>);
  }


  canBeChild() {
    return false;
  }


  renderChildren() {

    return <EditableObjectContext.Consumer
      key="editable_context"
    >
      {context => {

        const {
          getButtons,
        } = context;


        return getButtons ? getButtons() : null;

      }}
    </EditableObjectContext.Consumer>

  }


}

export default EditableObjectButtons;
