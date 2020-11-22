/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaCmsEditorRawContent } from '@prisma-cms/editor/dist';
import React from 'react';
import EditorComponent, { EditorComponentProps } from '../..';

export class RichText extends EditorComponent {

  static Name = 'RichText';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }


  constructor(props: EditorComponentProps) {
    super(props);

    this.onChangeEditor = this.onChangeEditor.bind(this);
  }


  renderPanelView(content?: React.ReactNode) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes?.panelButton}
      >
        RichText
      </div>
    );
  }


  canBeChild() {

    return false
  }


  onChangeEditor(value: PrismaCmsEditorRawContent) {

    // const {
    //   inEditMode,
    // } = this.getEditorContext();

    this.updateComponentProps({
      content: value,
    });

  }


  isEditorReadOnly() {

    // let {
    //   props: {
    //     readOnly,
    //   },
    // } = this.getObjectWithMutations();

    let readOnly = this.getObjectWithMutations()?.props.readOnly;


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

    if(!Editor) {
      console.error("Editor not defined");
      return null;
    }

    const {
      editorKey = "richtext",
      content,
      components,
      contentEditable,
      data,
      hide_wrapper_in_default_mode,
      lang,
      object,
      props,
      // style,
      ...other
    } = this.getComponentProps(this);


    // const {
    //   activeItem,
    //   inEditMode,
    // } = this.getEditorContext();



    const readOnly = this.isEditorReadOnly();

    return <Editor
      editorKey={editorKey}
      key="editor"
      value={content as PrismaCmsEditorRawContent}
      readOnly={readOnly}
      onChange={this.onChangeEditor}
      {...other}
    />

  }

}

export default RichText;