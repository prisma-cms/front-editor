import React from 'react'
import EditorComponent from '../../EditorComponent'

import MuiAppBar from 'material-ui/AppBar'

class AppBar extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    position: 'static',
  }

  static Name = 'AppBar'

  renderPanelView(content) {
    return super.renderPanelView(
      content || <div className="editor-component--panel-icon">AppBar</div>
    )
  }

  getRootElement() {
    return MuiAppBar
  }
}

export default AppBar
