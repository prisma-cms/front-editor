import React from 'react';
// import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/SettingsOverscan";

class Section extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    // marginTop: 10,
    // marginBottom: 10,
    // fontFamily: "Roboto",
    // fontSize: 20,
  }

  static Name = "Section"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> Section
    </div>);
  }


}

export default Section;
