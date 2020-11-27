import React from 'react'

import EditorComponent from '../../../../EditorComponent'
import { EditableObjectContext } from '../../../../context'

class EditableObjectButtons extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'EditableObjectButtons'
  static help_url = ''

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className={'panelEditableObjectButtons'}>
          EditableObjectButtons
        </div>
      )
    )
  }

  canBeChild() {
    return false
  }

  renderChildren() {
    return (
      <EditableObjectContext.Consumer key="editable_context">
        {(context) => {
          const { getButtons } = context

          return getButtons ? getButtons() : null
        }}
      </EditableObjectContext.Consumer>
    )
  }
}

export default EditableObjectButtons
