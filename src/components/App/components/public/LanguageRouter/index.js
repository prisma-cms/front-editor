import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from '../..';

class LanguageRouter extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    tag: "div",
  }

  static Name = "LanguageRouter"
  static help_url = "https://front-editor.prisma-cms.com/topics/language-router.html";

  onBeforeDrop = () => {

  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelLanguageRouter}
      >
        Language Router
    </div>);
  }


  getRootElement() {

    const {
      tag,
    } = this.getComponentProps(this);

    return tag;
  }


  renderChildren() {

    const {
      activeItem,
    } = this.getEditorContext();

    const {
      getLanguage,
    } = this.context;

    const language = getLanguage();

    let children = super.renderChildren();

    // console.log("lang children", children);

    if (children) {

      if (activeItem && (activeItem === this || activeItem.props.parent === this)) {

      }
      else {

        children = children.filter(n => {

          if (n) {

            const {
              props,
            } = n.props;

            const {
              lang,
            } = props || {};

            if (lang && lang !== language) {
              return false;
            }

          }

          return true;
        });

      }

    }

    return children;
  }


}

export default LanguageRouter;
