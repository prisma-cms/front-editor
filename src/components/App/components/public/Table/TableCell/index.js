import React from 'react';
import PropTypes from "prop-types";

import TableRow from '../TableRow';
import EditorComponent from '../../..';

export class TableCell extends EditorComponent {

  static Name = 'TableCell';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    rowspan: undefined,
    colspan: undefined,
    tag: "td",
  }

  static propTypes = {
    ...EditorComponent.propTypes,
    tag: PropTypes.oneOf("td", "th").isRequired,
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
        TableCell
      </div>
    );
  }


  getRootElement() {

    const {
      tag,
    } = this.getComponentProps(this);

    return tag || "td";
  }


  canBeParent(parent) {

    return parent instanceof TableRow;
  }


  canBeChild(child) {

    return super.canBeChild(child);
  }


  renderMainView() {

    const {
      inEditMode,
    } = this.getEditorContext();

    let inEditModeProps;

    if (inEditMode) {

      const {
        style,
      } = this.getComponentProps(this);

      inEditModeProps = {
        style: {
          ...style,
          flex: 1,
        },
      };
    }


    return super.renderMainView(inEditModeProps);
  }


  renderChildren() {

    const {
    } = this.context;

    const {
    } = this.getEditorContext();

    const {
      ...other
    } = this.getComponentProps(this);

    return super.renderChildren();
  }

}

export default TableCell;