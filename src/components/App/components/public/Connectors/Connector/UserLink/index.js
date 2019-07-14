import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ObjectContext } from '../ListView';

import UserIcon from "material-ui-icons/Face";
import EditorComponent from '../../../..';

class UserLink extends EditorComponent {


  static Name = "UserLink"


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
        <UserIcon /> User link
    </div>);
  }


  getRootElement() {

    return "span";
  }


  renderChildren() {

    const {
      UserLink: PrismaCmsUserLink,
    } = this.context;

    return <ObjectContext.Consumer>
      {context => {

        const {
          object,
          ...other
        } = context;

        if (!object) {
          return null;
        }

        return <PrismaCmsUserLink
          user={object}
          {...other}
        />

      }}
    </ObjectContext.Consumer>
  }

}

export default UserLink;
