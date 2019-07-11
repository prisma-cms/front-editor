import React from 'react';

import Tabs from '..';
import EditorComponent from '../../..';

export class Tab extends EditorComponent {

  static Name = 'Tab';

  static saveable = false;

  static defaultProps = {
    ...EditorComponent.defaultProps,
    label: "",
    disabled: false,
    value: undefined,
  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      <div
        className={classes.panelButton}
      >
        Tab
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return parent instanceof Tabs;
  }


  canBeChild(child) {

    return super.canBeChild(child);
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

export default Tab;