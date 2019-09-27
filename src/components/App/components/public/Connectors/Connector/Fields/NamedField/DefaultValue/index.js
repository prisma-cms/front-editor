import React from 'react';
import EditorComponent from '../../../../../..';
import NamedField from '..';
import ObjectView from '../../../../ObjectConnector/ObjectView';
import ListView from '../../../ListView';
import CurrentUser from '../../../../../CurrentUser';

export class DefaultValue extends EditorComponent {

  static Name = 'DefaultValue';

  static defaultProps = {
    ...EditorComponent.defaultProps,
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
        DefaultValue
      </div>
    );
  }


  // getRootElement() {

  //   return super.getRootElement();
  // }


  canBeParent(parent) {

    return parent instanceof NamedField
      || parent instanceof ObjectView
      || parent instanceof ListView
      || parent instanceof CurrentUser
  }


  // canBeChild(child) {

  //   return super.canBeChild(child);
  // }


  // renderChildren() {

  //   const {
  //   } = this.context;

  //   const {
  //   } = this.getEditorContext();

  //   const {
  //     ...other
  //   } = this.getComponentProps(this);

  //   return super.renderChildren();
  // }

}

export default DefaultValue;