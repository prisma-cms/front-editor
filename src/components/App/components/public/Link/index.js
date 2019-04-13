import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/Link";

import { Link as MuiLink } from "react-router-dom";

class Link extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    native: false,
    to: "javascript:alert('dsfsdf')",
  }

  static Name = "Link"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Link
    </div>);
  }


  getRootElement() {


    return MuiLink;

  }


  prepareDragItemComponents() {

    return super.prepareDragItemComponents().concat([
      {
        name: "Typography",
        props: {},
        components: [],
      }
    ]);
  }


  // getRenderProps() {

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     // props: {
  //     //   ...otherProps
  //     // },
  //     ...other
  //   } = super.getRenderProps();

  //   // const {
  //   //   text,
  //   //   // type,
  //   //   // style,
  //   //   color,
  //   //   display,
  //   //   displayType,
  //   //   ...otherProps
  //   // } = this.getComponentProps(this);


  //   console.log("Link renderProps getRenderProps", { ...super.getRenderProps() });


  //   const renderProps = {
  //     style: {
  //       ...style,
  //       marginTop,
  //       marginBottom,
  //     },
  //     ...other,
  //     // ...otherProps
  //   }


  //   console.log("Link renderProps", renderProps);

  //   return renderProps;
  // }

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

export default Link;
