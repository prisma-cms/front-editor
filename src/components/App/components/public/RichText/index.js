import React from 'react';
import EditorComponent from '../..';

export class RichText extends EditorComponent {

  static Name = 'RichText';

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
        RichText
      </div>
    );
  }


  canBeChild(child) {

    return false
  }


  renderChildren() {

    const {
      Editor,
    } = this.context;

    const {
      content,
    } = this.getComponentProps(this);


    const {
      activeItem,
      inEditMode,
    } = this.getEditorContext();


    const isActive = activeItem === this;

    const readOnly = !inEditMode || !isActive ? true : false;

    return <Editor
      value={content}
      readOnly={readOnly}
      onChange={!readOnly ? value => {

        this.updateComponentProps({
          content: value,
        });

      } : undefined}
    />

  }

}

export default RichText;