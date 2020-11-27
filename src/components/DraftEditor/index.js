import React from 'react'

import Editor from '@prisma-cms/editor'

import EditorComponent from '../../EditorComponent'

class DraftEditor extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    readOnly: false,
    value: null,
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'DraftEditor'

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          {/* <Icon />  */}
          DraftEditor
        </div>
      )
    )
  }

  renderChildren() {
    const { readOnly, value } = this.getComponentProps(this)

    return <Editor key="editor" value={value} readOnly={readOnly} />
  }
}

export default DraftEditor
