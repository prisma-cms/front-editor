import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ObjectContext } from '../ListView';

import UserIcon from "material-ui-icons/Face";
import EditorComponent from '../../../..';

class UserLink extends EditorComponent {


  static Name = "UserLink"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <UserIcon /> User link
    </div>);
  }


  renderMainView() {

    const {
      UserLink: PrismaCmsUserLink,
    } = this.context;

    return <span
      {...this.getRenderProps()}
    >
      <ObjectContext.Consumer>
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
    </span>;
  }

}

export default UserLink;
