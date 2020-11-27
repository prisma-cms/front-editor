import React from 'react'
import EditorComponent from '../../../EditorComponent'

class RoutedObject extends EditorComponent {
  static Name = 'RoutedObject'

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">Routed Object</div>
      )
    )
  }
}

export default RoutedObject
