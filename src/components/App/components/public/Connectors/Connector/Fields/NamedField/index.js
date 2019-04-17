import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../../..';
import { ObjectContext } from '../../ListView';

import Icon from "material-ui-icons/ShortText";

class NamedField extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: "",
  }


  static Name = "NamedField"


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Object field
    </div>);
  }


  getRootElement() {

    return "span";
  }


  renderChildren() {

    // const {
    //   UserLink,
    // } = this.context;

    const {
      // props: {
      //   name,
      //   ...otherProps
      // },
      name,
      ...other
    } = this.getComponentProps(this);


    // console.log("NamedField props", this.props);
    // console.log("NamedField this.getComponentProps(this)", this.getComponentProps(this));


    return <ObjectContext.Consumer>
      {context => {

        {/* console.log("NamedField context", context); */}

        if (!name) {
          return null;
        }

        const {
          object,
          ...other
        } = context;

        if (!object) {
          return null;
        }


        const {
          [name]: value,
        } = object;

        return value && (typeof value !== "object") ? value : null;

      }}
    </ObjectContext.Consumer>;
  }

}

export default NamedField;
