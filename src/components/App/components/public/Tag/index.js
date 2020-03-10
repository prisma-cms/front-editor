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

    let isEditable = false;

    const inEditMode = this.inEditorMode();


    // return inEditMode ? true : false;

    if (inEditMode) {

      // console.log('HTMLTag iseditable inEditMode', inEditMode);
      // console.log('HTMLTag iseditable this', this);

      const {
        parent,
      } = this.props;

      /**
       * Элемент может быть редактируемым только если родитель отсутствует
       * или родитель не HtmlTag. 
       * ToDo: надо проверять не просто инстанс, а свойство contentEditable 
       * в родительском элементе.
       */
      if (!parent || !(parent instanceof HtmlTag)) {
        isEditable = true;
      }

      // console.log('HTMLTag iseditable isEditable', isEditable, this.container, this);

    }

    return isEditable;
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
