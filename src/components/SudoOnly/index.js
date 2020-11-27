import React from 'react'
import EditorComponent from '../../EditorComponent'

class SudoOnly extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = 'SudoOnly'

  renderPanelView() {
    return super.renderPanelView(
      <div className="editor-component--panel-icon">SudoOnly</div>
    )
  }

  renderChildren() {
    const { user: currentUser } = this.context

    const { sudo } = currentUser || {}

    if (!sudo) {
      return null
    }

    return super.renderChildren()
  }
}

export default SudoOnly
