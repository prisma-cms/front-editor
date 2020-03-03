import React from 'react';
import EditorComponent from '../..';

export class Debug extends EditorComponent {

  static Name = 'Debug';

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
        Debug
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

    // return super.canBeChild(child);
    return false;
  }


  renderChildren() {

    // const {
    // } = this.context;

    // const {
    // } = this.getEditorContext();

    // const {
    //   ...other
    // } = this.getComponentProps(this);

    // return super.renderChildren();

    const {
      parent,
    } = this.props;

    if (!parent) {
      return null;
    }

    // console.log('parent', parent);
    // console.log('parent.getObjectWithMutations', parent.getObjectWithMutations);

    const {
      props,
      components,
    } = parent.getObjectWithMutations();

    return <div
      style={{
        whiteSpace: "pre-wrap",
      }}
    >
      {JSON.stringify({
        props,
        components,
      }, true, 2)}
    </div>;
  }

}

export default Debug;