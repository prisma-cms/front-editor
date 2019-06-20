import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../../../../..';
import { ObjectContext } from '../../ListView';

import Icon from "material-ui-icons/Subject";

class Content extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    readOnly: true,
  }

  static Name = "Content"


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
      className={classes.panelButton}
    >
      <Icon /> Content
    </div>);
  }


  getRootElement() {

    return "div";
  }



  renderChildren() {

    const {
      Editor,
    } = this.context;


    const {
      readOnly,
    } = this.props;

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
          content,
        } = object;

        return content ? <Editor
          value={content}
          readOnly={readOnly}
        /> : null;

      }}
    </ObjectContext.Consumer>;
  }

}

export default Content;
