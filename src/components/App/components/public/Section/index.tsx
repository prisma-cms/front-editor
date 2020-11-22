import React from 'react';
// import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/SettingsOverscan";
import { SectionProps, SectionState } from './interfaces';
export * from './interfaces';


class Section<P extends SectionProps = SectionProps, S extends SectionState = SectionState>
  extends EditorComponent<P, S> {

  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  //   // marginTop: 10,
  //   // marginBottom: 10,
  //   // fontFamily: "Roboto",
  //   // fontSize: 20,
  // }

  static Name = "Section"

  renderPanelView(content?: React.ReactNode) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes?.panelButton}
      >
        <Icon /> Section
    </div>);
  }

}

export default Section;
