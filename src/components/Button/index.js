import React from 'react'

import EditorComponent from '../../EditorComponent'

import MaterialUiButton from 'material-ui/Button'

class Button extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = 'Button'

  onBeforeDrop = () => {
    return
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || <div className="editor-component--panel-icon">Button</div>
    )
  }

  getRootElement() {
    return MaterialUiButton
  }
}

export default Button
