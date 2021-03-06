/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaCmsEditorRawContent } from '@prisma-cms/editor'
import React from 'react'
import Editor from '@prisma-cms/editor'

import EditorComponent, { EditorComponentProps } from '../../EditorComponent'

export class RichText extends EditorComponent {
  static Name = 'RichText' as 'RichText'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  constructor(props: EditorComponentProps) {
    super(props)

    this.onChangeEditor = this.onChangeEditor.bind(this)
  }

  renderPanelView(content?: React.ReactNode) {
    return super.renderPanelView(
      content || <div className="editor-component--panel-icon">RichText</div>
    )
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
    })
  }

  isEditorReadOnly() {
    // let {
    //   props: {
    //     readOnly,
    //   },
    // } = this.getObjectWithMutations();

    let readOnly = this.getObjectWithMutations()?.props.readOnly

    if (readOnly === undefined) {
      const { inEditMode } = this.getEditorContext()

      readOnly = !inEditMode
    }

    return readOnly
  }

  renderChildren() {
    const {
      editorKey = 'richtext',
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
    } = this.getComponentProps(this)

    // const {
    //   activeItem,
    //   inEditMode,
    // } = this.getEditorContext();

    const readOnly = this.isEditorReadOnly()

    return (
      <Editor
        editorKey={editorKey}
        key="editor"
        value={content as PrismaCmsEditorRawContent}
        readOnly={readOnly}
        onChange={this.onChangeEditor}
        {...other}
      />
    )
  }
}

export default RichText
