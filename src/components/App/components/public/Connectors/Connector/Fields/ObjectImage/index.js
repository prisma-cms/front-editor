import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Icon from "material-ui-icons/Image";
import EditorComponent from '../../../../..';
import { ObjectContext } from '../../ListView';



class ObjectImage extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    field_name: "image",
    type: 'thumb',
    style: {
      ...EditorComponent.defaultProps.style,
      maxWidth: "100%",
    },
  }

  static Name = "ObjectImage"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> Object Image
    </div>);
  }


  getRootElement() {

    return "span";
  }


  renderMainView() {

    const {
      inEditMode,
    } = this.getEditorContext();

    if (!inEditMode) {
      return this.renderChildren();
    }

    // else
    return super.renderMainView();
  }


  renderChildren() {

    const {
      Image,
    } = this.context;

    // {...this.getRenderProps()}


    return <ObjectContext.Consumer>
      {context => {

        const {
          object,
          ...other
        } = context;

        if (!object) {
          return null;
        }

        const {
          image,
        } = object;


        /**
          Если нет картинки, то смотрим на текущий режим.
          Если в режиме редактирования работаем, 
         */
        if (!image) {
          return null;
        }


        return <Image
          {...this.getComponentProps(this)}
          src={image}
        >
        </Image>;

      }}
    </ObjectContext.Consumer>
  }

}

export default ObjectImage;
