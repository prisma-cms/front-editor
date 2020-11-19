import React from 'react';

import EditorComponent from '../..';
// import { ObjectContext } from '../../ListView';

// import Icon from "material-ui-icons/Subject";

class DraftEditor extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    readOnly: false,
    value: null,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "DraftEditor"


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        {/* <Icon />  */}
        DraftEditor
    </div>);
  }


  renderChildren() {

    const {
      Editor,
    } = this.context;


    const {
      readOnly,
      value,
    } = this.getComponentProps(this);

    return <Editor
      key="editor"
      value={value}
      readOnly={readOnly}
    />
  }

}

export default DraftEditor;
