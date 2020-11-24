import React from 'react';
import PropTypes from "prop-types";

import TableRow from '../TableRow';
import EditorComponent from '../../../EditorComponent';

export class TableCell extends EditorComponent {

  static Name = 'TableCell';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    rowSpan: undefined,
    colSpan: undefined,
    tag: "td",
  }

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...EditorComponent.propTypes,
    tag: PropTypes.oneOf(["td", "th"]).isRequired,
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


}

export default TableCell;