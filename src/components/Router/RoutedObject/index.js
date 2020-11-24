import React from 'react';
import EditorComponent from '../../../EditorComponent';


class RoutedObject extends EditorComponent {

  static Name = "RoutedObject"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        Routed Object
    </div>);
  }

}

export default RoutedObject;
