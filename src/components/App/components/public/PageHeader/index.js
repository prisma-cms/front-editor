import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../..';

// import Icon from "material-ui-icons/SettingsOverscan";

// import MainMenu from "@prisma-cms/front/lib/components/App/Renderer/MainMenu";
// import Language from "@prisma-cms/front/lib/components/Language";
import AppBar from 'material-ui/AppBar';
import Typography from 'material-ui/Typography';
import Button from 'material-ui/Button';

class PageHeader extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    position: "relative",
  }

  static Name = "PageHeader"
  

  renderPanelView() {

    return null;

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Page Header
    </div>);
  }


  getRootElement() {

    return AppBar;
  }


  renderChildren() {

    const {
      user,
      Grid,
      Link,
      UserLink,
    } = this.context;

    const {
      // opened,
    } = this.state;

    const {
    } = this.props;

    const {
      id: userId,
      username,
      fullname,
    } = user || {}

    return (

      <Grid
        container
        spacing={16}
        alignItems="center"
        className="MainMenu-root"
      >


        {super.renderChildren()}


        {user
          ?
          [
            <Grid
              key="user"
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
            </Grid>,
            <Grid
              key="logout"
              item
            >
              <Button
                onClick={() => this.logout()}
                color="inherit"
              >
                {this.lexicon("Signout")}
              </Button>

            </Grid>
          ]
          :
          <Grid
            key="login"
            item
          >
            <Button
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
            </Button>

          </Grid>
        }

      </Grid>
    )
  }


  logout() {

    const {
      logout,
    } = this.context;

    logout();

  }


  // renderChildren(){

  //   return <MainMenu 

  //   />
  // }


  // renderMainView() {

  //   // const {
  //   //   marginTop,
  //   //   marginBottom,
  //   // } = this.getComponentProps(this);

  //   const {
  //     style,
  //     marginTop,
  //     marginBottom,
  //     ...other
  //   } = this.getRenderProps();

  //   return <div
  //     style={{
  //       marginTop,
  //       marginBottom,
  //       ...style,
  //     }}
  //     {...other}
  //   >
  //     {super.renderMainView()}
  //   </div>;
  // }

}

export default PageHeader;
