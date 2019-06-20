import React from 'react';

import Table from '..';
import TableCell from '../TableCell';
import EditorComponent from '../../..';
import ListView from '../../Connectors/Connector/ListView';
import Iterable from '../../Connectors/Connector/ListView/Iterable';

export class TableRow extends EditorComponent {

  static Name = 'TableRow';

  static defaultProps = {
    ...EditorComponent.defaultProps,
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
        TableRow
      </div>
    );
  }


  // getRootElement() {

  //   return "tr";
  // }


  canBeParent(parent) {

    return parent instanceof Table
      || parent instanceof ListView
      || parent instanceof Iterable
      ;
  }


  canBeChild(child) {

    return child instanceof TableCell;

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
          width: "100%",
          flexBasis: "100%",
        },
      };
      return super.renderMainView(inEditModeProps);
    }
    else {
      return this.renderChildren();
    }

  }


  renderChildren() {

    const {
    } = this.context;

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      children,
      ...other
    } = this.getComponentProps(this);


    let inEditModeProps;

    if (inEditMode) {

      const {
        style,
      } = this.getComponentProps(this);

      inEditModeProps = {
        style: {
          ...style,
          display: "flex",
          width: "100%",
          // borderColor: "red",
          // border: "1px solid",
        },
      };
    }


    return <tr
      {...other}
      {...inEditModeProps}
    >
      {super.renderChildren()}
    </tr>
  }

}

export default TableRow;