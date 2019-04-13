import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/SettingsOverscan";

class Section extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    marginTop: 10,
    marginBottom: 10,
  }

  static Name = "Section"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Section
    </div>);
  }



  getRenderProps() {

    const {
      style,
      marginTop,
      marginBottom,
      // props: {
      //   ...otherProps
      // },
      ...other
    } = super.getRenderProps();

    // const {
    //   text,
    //   // type,
    //   // style,
    //   color,
    //   display,
    //   displayType,
    //   ...otherProps
    // } = this.getComponentProps(this);


    console.log("Section renderProps getRenderProps", { ...super.getRenderProps() });


    const renderProps = {
      style: {
        ...style,
        marginTop,
        marginBottom,
      },
      ...other,
      // ...otherProps
    }


    console.log("Section renderProps", renderProps);

    return renderProps;
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

export default Section;
