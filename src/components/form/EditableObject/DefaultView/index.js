import React from 'react'

import EditorComponent from '../../../../EditorComponent'
import { EditableObjectContext } from '../../../../context'

class DefaultView extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'DefaultView'
  static help_url =
    'https://front-editor.prisma-cms.com/topics/editableobject.html'

  onBeforeDrop = () => {
    return
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || <div className={'panelDefaultView'}>DefaultView</div>
    )
  }

  renderMainView() {
    return (
      <EditableObjectContext.Consumer>
        {(editableObjectContext) => {
          const { inEditMode: objectInEditMode } = editableObjectContext

          return objectInEditMode ? null : super.renderMainView()
        }}
      </EditableObjectContext.Consumer>
    )
  }
}

export default DefaultView
