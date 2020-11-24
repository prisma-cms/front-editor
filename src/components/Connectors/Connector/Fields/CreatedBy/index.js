import React from 'react';

import UserIcon from "material-ui-icons/SupervisorAccount";
import EditorComponent from '../../../../../EditorComponent';
import { ObjectContext } from '../../ListView';



class CreatedBy extends EditorComponent {


  static Name = "CreatedBy"


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
        <UserIcon /> CreatedBy
    </div>);
  }


  getRootElement() {
    return "span";
  }


  renderChildren() {

    const {
      UserLink,
    } = this.context;
    
    if(!UserLink) {
      console.error("UserLink not defined");
      return null;
    }

    return <ObjectContext.Consumer
      key="object_context"
    >
      {context => {

        const {
          object,
          ...other
        } = context;

        if (!object) {
          return null;
        }

        const {
          CreatedBy: user,
        } = object;

        return <UserLink
          user={user}
          {...other}
        />

      }}
    </ObjectContext.Consumer>
  }

}

export default CreatedBy;
