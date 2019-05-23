import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

// import Icon from "material-ui-icons/SettingsOverscan";
import { Typography } from 'material-ui';
import { Button } from 'material-ui';

class Login extends EditorComponent {

  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  // }

  static Name = "Login"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Login
    </div>);
  }


  renderChildren() {

    const {
      user,
    } = this.context;


    return user ? this.renderAuthorized() : this.renderUnauthorized()
  }


  renderAuthorized() {

    const {
      user,
      Grid,
      Link,
      UserLink,
    } = this.context;

    const {
      id: userId,
      username,
      fullname,
    } = user

    return <Grid
      container
      alignItems="center"
    >

      <Grid
        item
      >
        <UserLink
          user={user}
          style={{
            marginLeft: 5,
          }}
          variant={null}
        >
          <Typography
            color="inherit"
          >
            {fullname || username}
          </Typography>
        </UserLink>

      </Grid>
      <Grid
        item
      >
        <Button
          onClick={() => this.logout()}
          color="inherit"
        >
          {this.lexicon("Signout")}
        </Button>
      </Grid>

    </Grid>;
  }


  renderUnauthorized() {

    return <Button
      onClick={e => {
        // this.setState({
        //   opened: true,
        // });
        const {
          openLoginForm,
        } = this.context;
        openLoginForm();
      }}
      color="inherit"
    >
      {this.lexicon("Signin")}
    </Button>;
  }

  logout() {

    const {
      logout,
    } = this.context;

    logout();

  }

}

export default Login;
