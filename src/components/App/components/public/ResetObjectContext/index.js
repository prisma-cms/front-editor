import React from 'react';
import EditorComponent from '../..';
import { ObjectContext } from '../Connectors/Connector/ListView';
import { EditableObjectContext } from '../../../context';


/**
 * Иногда надо иметь возможность сбросить контекст объекта,
 * когда используются вложенные объекты (к примеру, создание нового 
 * объекта внутри контекста другого существующего объекта)
 */

export class ResetObjectContext extends EditorComponent {

  static Name = 'ResetObjectContext';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }


  constructor(props) {

    super(props);

    this.state = {
      ...this.state,
      objectContext: {},
    }

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
        ResetObjectContext
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
      objectContext,
    } = this.state;

    return <ObjectContext.Provider
      key="object_context"
      value={objectContext}
    >
      <EditableObjectContext.Provider
        value={objectContext}
      >
        {super.renderChildren()}
      </EditableObjectContext.Provider>
    </ObjectContext.Provider>

  }

}

export default ResetObjectContext;