import React, { Component } from 'react';
import PropTypes from "prop-types";

import App, {
  ContextProvider,
  SubscriptionProvider,
} from "../../App";

import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'

import MainMenu from './MainMenu';
import { withStyles } from 'material-ui';
import DevMainPage from './pages/MainPage';


export const styles = {

  root: {
    // border: "1px solid blue",
    height: "100%",
    display: "flex",
    flexDirection: "column",

    "& #Renderer--body": {
      // border: "1px solid green",
      flex: 1,
      overflow: "auto",
      display: "flex",
      flexDirection: "column",
    },
  },
}


class DevRenderer extends PrismaCmsRenderer {


  static propTypes = {
    ...PrismaCmsRenderer.propTypes,
    pure: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...PrismaCmsRenderer.defaultProps,
    pure: false,
  }


  getRoutes() {

    let routes = super.getRoutes();

    return [
      {
        exact: true,
        path: "/",
        component: DevMainPage,
        // render: props => {
        //   // console.log("props", { ...props });
        //   return <DevMainPage
        //     {...props}
        //   >
        //     <div>
        //     Test
        //     </div>
        //   </DevMainPage>;
        // }
        // render: props => {
        //   console.log("props", { ...props });
        //   return null;
        // }
      },
      // {
      //   path: "*",
      //   render: props => this.renderOtherPages(props),
      // },
    ].concat(routes);

  }



  renderMenu() {

    return <MainMenu />
  }


  renderWrapper() {

    return <ContextProvider>
      <SubscriptionProvider>
        {super.renderWrapper()}
      </SubscriptionProvider>
    </ContextProvider>;

  }


  render() {

    const {
      pure,
      classes,
      ...other
    } = this.props;

    return pure ? <App
      {...other}
    /> :
      <div
        className={classes.root}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
            body, html, #root{
              height: 100%;
            }
          `,
          }}
        />
        {super.render()}
      </div>;

  }

}

export default withStyles(styles)(props => <DevRenderer
  {...props}
/>);