import React from 'react';

import TableRow from './TableRow';
import EditorComponent from '../../EditorComponent';
import ListView from '../Connectors/Connector/ListView';
import Iterable from '../Connectors/Connector/ListView/Iterable';

export class Table extends EditorComponent {

  static Name = 'Table';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    style: {
      ...EditorComponent.defaultProps.style,
      cellBorder: "1px solid red",
      borderCollapse: "collapse",
      width: "100%",
    },
    hide_wrapper_in_default_mode: true,
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
        Table
      </div>
    );
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    return child instanceof TableRow
      || child instanceof ListView
      || child instanceof Iterable
      ;

  }


  renderChildren() {

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      children,
      ...other
    } = this.getComponentProps(this);

    return <table
      key="table"
      {...other}
    >
      <tbody>
        {super.renderChildren()}
      </tbody>
    </table>
  }

}

export default Table;