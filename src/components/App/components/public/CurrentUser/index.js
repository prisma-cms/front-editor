import React from 'react';
import EditorComponent from '../..';
import { ObjectContext } from '../Connectors/Connector/ListView';
import DefaultValue from '../Connectors/Connector/Fields/NamedField/DefaultValue';

export class CurrentUser extends EditorComponent {

  static Name = 'CurrentUser';

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
        CurrentUser
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    return super.canBeChild(child);
  }


  renderChildren() {

    // const {
    // } = this.context;

    // const {
    // } = this.getEditorContext();

    // const {
    //   ...other
    // } = this.getComponentProps(this);

    const {
      user: currentUser,
    } = this.context;

    let children = super.renderChildren();

    if (!currentUser) {
      children = children.filter(n => n && n.type === DefaultValue);
    }
    else {
      children = children.filter(n => n && n.type !== DefaultValue);
    }

    return <ObjectContext.Provider
      key="object_context"
      value={{
        object: currentUser,
      }}
    >
      {children}
    </ObjectContext.Provider>

  }

}

export default CurrentUser;