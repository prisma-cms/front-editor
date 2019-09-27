import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditorComponent from "../../../../";

// import Icon from "material-ui-icons/SettingsOverscan";

// import CustomUserPage from "../../../../../UsersPage/UserPage";

// import PrismaCmsUserPage from "@prisma-cms/front/lib/components/pages/UsersPage/UserPage";

class UserPage extends EditorComponent {

  static Name = "UserPage"

  static propTypes = {
    ...EditorComponent.propTypes,
    UserPageClass: PrismaCmsUserPage,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    UserPageClass: PrismaCmsUserPage,
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
        {/* <Icon />  */}
        User page
    </div>);
  }


  renderChildren() {

    // const {
    //   ...other
    // } = this.getComponentProps(this);


    const {
      parent,
      UserPageClass,
    } = this.props;

    if (!parent || !UserPageClass) {
      return false;
    }

    const {
      props: {
        match,
      },
    } = parent;



    const {
      params: where,
    } = match || {};

    if (!where) {
      return null;
    }

    return <UserPageClass
      key="user_page"
      where={where}
    />;
  }

}

export default UserPage;
