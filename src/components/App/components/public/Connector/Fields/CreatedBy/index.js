import React, { Component } from 'react';
import PropTypes from 'prop-types';

import UserIcon from "material-ui-icons/SupervisorAccount";
import EditorComponent from '../../../..';
import { ObjectContext } from '../../ListView';



class CreatedBy extends EditorComponent {


  static Name = "CreatedBy"

  renderPanelView() {

    const {
      classes,
    } = this.context;

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <UserIcon /> CreatedBy
    </div>);
  }


  renderMainView() {

    const {
      UserLink,
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

          const {
            CreatedBy: user,
          } = object;

          return <UserLink
            user={user}
            {...other}
          />

        }}
      </ObjectContext.Consumer>
    </span>;
  }

}

export default CreatedBy;
