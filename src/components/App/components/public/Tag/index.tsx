/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';
// import PropTypes from 'prop-types';

import Icon from "material-ui-icons/Title";

import HtmlTag, { HtmlTagProps } from './HtmlTag';


export class Tag extends HtmlTag {

  static Name = "Tag";

  static defaultProps = {
    ...HtmlTag.defaultProps,
    render_badge: true,
    can_be_edited: true,
  }


  renderPanelView(content?: React.ReactNode) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes?.panelButton}
      >
        <Icon /> Tag
    </div>);
  }


  editable() {

    const inEditMode = this.inEditorMode();

    return inEditMode ? true : false;
  }

  prepareRootElementProps(props: HtmlTagProps & Record<string, any>) {

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

export default Tag;