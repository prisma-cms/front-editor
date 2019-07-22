import React from 'react';
import EditorComponent from '../..';

export class RichText extends EditorComponent {

  static Name = 'RichText';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }


  constructor(props) {

    super(props);

    this.onChangeEditor = this.onChangeEditor.bind(this);

  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        RichText
      </div>
    );
  }


  canBeChild(child) {

    return false
  }


  onChangeEditor(value) {

    // const {
    //   inEditMode,
    // } = this.getEditorContext();

    this.updateComponentProps({
      content: value,
    });

  }


  isEditorReadOnly() {

    let {
      props: {
        readOnly,
      },
    } = this.getObjectWithMutations();


    if (readOnly === undefined) {

      const {
        inEditMode,
      } = this.getEditorContext();


      readOnly = !inEditMode;

    }

    return readOnly;
  }


  renderChildren() {

    const {
      Editor,
    } = this.context;

    const {
      content,
    } = this.getComponentProps(this);


    // const {
    //   activeItem,
    //   inEditMode,
    // } = this.getEditorContext();



    const readOnly = this.isEditorReadOnly();

    return <Editor
      value={content}
      readOnly={readOnly}
      onChange={this.onChangeEditor}
    />

  }

}

export default RichText;