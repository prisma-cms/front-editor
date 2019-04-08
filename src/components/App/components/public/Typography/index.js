import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

import Icon from "material-ui-icons/TextFormat";
import MuiTypography from "material-ui/Typography";


class Typography extends EditorComponent {

  static Name = "Typography"

  static defaultProps = {
    ...EditorComponent.defaultProps,
    variant: "body1",
    color: "default",
    text: "",
    displayType: "span",
    display: "inline-block",
  }


  constructor(props) {

    super(props);

    this.id = module.id;
  }


  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Typography
    </div>);
  }



  getRootElement() {
    return MuiTypography;
  }


  getRenderProps() {

    const {
      style,
      display,
      displayType,
      props: {
        text,
        // type,
        // style,
        color,
        display: displayProps,
        displayType: displayTypeProps,
        ...otherProps
      },
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

    // console.log("getRenderProps", { ...other });

    return {
      ...other,
      style: {
        ...style,
        display: displayProps || display,
      },
      color,
      component: displayTypeProps || displayType,
      ...otherProps,
    }
  }


  renderChildren() {

    const {
      text,
      // type,
      // style,
      color,
      display,
      displayType,
      ...otherProps
    } = this.getComponentProps(this);


    // console.log("Typography", this);
    // console.log("Typography id", this.id);
    // console.log("Typography renderMainView this.getRenderProps()", this.getRenderProps());
    // console.log("Typography renderMainView this.getComponentProps()", this.getComponentProps(this));

    const {
      // text,
      // type,
      style,
      // props: {
      //   display,
      //   displayType,
      //   text,
      //   ...props
      // },
      ...other
    } = this.getRenderProps();


    return <Fragment
    // {...other}
    // style={{
    //   ...style,
    //   display,
    // }}
    // color={color}
    // component={displayType}
    // {...otherProps}
    >
      {text}{super.renderChildren()}
    </Fragment>;
  }

  // renderMainView() {

  //   const {
  //     text,
  //     // type,
  //     // style,
  //     color,
  //     display,
  //     displayType,
  //     ...otherProps
  //   } = this.getComponentProps(this);


  //   console.log("Typography", this);
  //   console.log("Typography id", this.id);
  //   // console.log("Typography renderMainView this.getRenderProps()", this.getRenderProps());
  //   // console.log("Typography renderMainView this.getComponentProps()", this.getComponentProps(this));

  //   const {
  //     // text,
  //     // type,
  //     style,
  //     // props: {
  //     //   display,
  //     //   displayType,
  //     //   text,
  //     //   ...props
  //     // },
  //     ...other
  //   } = this.getRenderProps();


  //   return <MuiTypography
  //     {...other}
  //     style={{
  //       ...style,
  //       display,
  //     }}
  //     color={color}
  //     component={displayType}
  //   // {...otherProps}
  //   >
  //     {text}{super.renderMainView()}
  //   </MuiTypography>;
  // }

}

export default Typography;
