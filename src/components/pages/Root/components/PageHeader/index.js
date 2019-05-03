import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from "material-ui-icons/SettingsOverscan";

// import MainMenu from "@prisma-cms/front/lib/components/App/Renderer/MainMenu";
import MainMenu from "./MainMenu";
import EditorComponent from '../../../../App/components';

class PageHeader extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "PageHeader"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Page Header
    </div>);
  }


  // getRootElement() {

  //   return MainMenu;
  // }

  renderChildren(){

    return <MainMenu 

    />
  }


  // renderMainView() {

  //   // const {
  //   //   marginTop,
  //   //   marginBottom,
  //   // } = this.getComponentProps(this);

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     ...other
  //   } = this.getRenderProps();

  //   return <div
  //     style={{
  //       marginTop,
  //       marginBottom,
  //       ...style,
  //     }}
  //     {...other}
  //   >
  //     {super.renderMainView()}
  //   </div>;
  // }

}

export default PageHeader;
