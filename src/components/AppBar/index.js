import React from 'react';
import EditorComponent from '../../EditorComponent';

import MuiAppBar from 'material-ui/AppBar';

class AppBar extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    position: "static",
  }

  static Name = "AppBar"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        AppBar
    </div>);
  }


  getRootElement() {

    return MuiAppBar;
  }

}

export default AppBar;
