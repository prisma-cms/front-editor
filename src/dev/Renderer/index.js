import React, { Component } from 'react';
import PropTypes from "prop-types";

import App, {
  ContextProvider,
  SubscriptionProvider,
} from "../../App";

import { Renderer as PrismaCmsRenderer } from '@prisma-cms/front'
import Context from "@prisma-cms/context";

import MainMenu from './MainMenu';
import { withStyles } from 'material-ui';
import DevMainPage from './pages/MainPage';
import TemplatesPage from '../../components/pages/Templates';
import TemplatePage from '../../components/pages/Templates/Template';


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
        path: "/templates",
        component: TemplatesPage,
      },
      // {
      //   exact: true,
      //   path: "/templates/create",
      //   component: TemplateCreatePage,
      // },
      {
        exact: true,
        path: "/templates/:id",
        render: props => {

          const {
            match: {
              params: {
                id,
              },
            },
          } = props;

          return <TemplatePage
            key={id}
            where={{
              id,
            }}
            {...props}
          />
        },
      },
      {
        exact: false,
        path: "/",
        // component: DevMainPage,
        render: props => {
          // console.log("props", { ...props });
          return <DevMainPage
          >
          </DevMainPage>;
        }
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

    const {
      queryFragments,
    } = this.props;

    // console.log("queryFragments", queryFragments);

    // return "Sdfsdf";

    return <Context.Consumer>
      {context => <Context.Provider
        value={Object.assign(context, this.context, {
          queryFragments,
        })}
      >
        <ContextProvider>
          <SubscriptionProvider>
            {super.renderWrapper()}
          </SubscriptionProvider>
        </ContextProvider>
      </Context.Provider>
      }
    </Context.Consumer>


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