import React from 'react';
// import PropTypes from 'prop-types';

import Icon from "material-ui-icons/Title";

import HtmlTag from './HtmlTag';


export class Tag extends HtmlTag {

  static Name = "Tag";

  static defaultProps = {
    ...HtmlTag.defaultProps,
    render_badge: true,
    can_be_edited: true,
  }

  // constructor(props) {

  //   console.log('Tag constructor props', props);

  //   super(props);
  // }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> Tag
    </div>);
  }


  editable() {

    return true;

    // const inEditMode = this.inEditorMode();

    // return inEditMode ? true : false;
  }

  // updateContent(node,
  //   content = {
  //     name: "Tag",
  //     component: "Tag",
  //     props: {},
  //     components: [],
  //   }) {

  //   return super.updateContent(node, content);
  // }


  prepareRootElementProps(props) {

    const {
      initialContent,
      read_only,
      updateObject,
      editable,
      ...other
    } = super.prepareRootElementProps(props);

    return other;
  }

}

export {
  HtmlTag,
};

export default Tag;
