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


  renderChildren() {

    const {
      props: {
        object,
      },
    } = this.getComponentProps(this);
    
    // TODO: Created ObjectContext Component
    return <ObjectContext.Provider
      key="object_context"
      value={{ object }}
    >
      <EditableObjectContext.Provider
        value={{ object }}
      >
        {super.renderChildren()}
      </EditableObjectContext.Provider>
    </ObjectContext.Provider>

  }

}

export default ResetObjectContext;