import React from 'react';
// import PropTypes from 'prop-types';
import EditorComponent from '../../EditorComponent';

// import Icon from "material-ui-icons/SettingsOverscan";
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';
import Grid from '../../common/Grid';

class Login extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  static Name = "Login"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        Login
    </div>);
  }


  initLocales(locales) {

    if (locales) {
      Object.assign(locales.ru.values, {
        Signin: "Вход",
        Signout: "Выход",
      });
    }

    return super.initLocales(locales);
  }


  renderChildren() {

    const {
      user,
    } = this.context;


    return user ? this.renderAuthorized() : this.renderUnauthorized()
  }

  openLoginForm = () => {

    const {
      openLoginForm,
    } = this.context;

    openLoginForm && openLoginForm();
  };

  renderAuthorized() {

    const {
      user,
      UserLink,
    } = this.context;

    if(!UserLink) {
      console.error("UserLink not defined");
      return null;
    }

    const {
      // id: userId,
      username,
      fullname,
    } = user

    return <Grid
      container
      alignItems="center"
      style={{
        flexWrap: "nowrap",
      }}
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
          onClick={this.logout}
          color="inherit"
        >
          {this.lexicon("Signout")}
        </Button>
      </Grid>

    </Grid>;
  }


  renderUnauthorized() {

    return <Button
      onClick={this.openLoginForm}
      color="inherit"
    >
      {this.lexicon("Signin")}
    </Button>;
  }

  logout = () => {
    const {
      logout,
    } = this.context;

    logout && logout();
  }

}

export default Login;
