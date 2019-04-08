import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';

import ViewIcon from "material-ui-icons/ViewModule";
import { ConnectorContext } from '..';
import EditorComponent from '../../..';


export const ObjectContext = createContext({});

class ListView extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    spacing: 8,
  };

  static Name = "ListView"


  renderPanelView() {

    const {
      classes,
    } = this.context;


    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <ViewIcon /> List View
    </div>);
  }


  getRenderProps() {

    const {
      style,
      ...props
    } = super.getRenderProps();

    return {
      style: {
        width: "100%",
        ...style,
      },
      ...props,
    }
  }

  // renderMainView() {

  //   const {
  //     ...other
  //   } = this.getRenderProps();



  //   const {
  //     Grid,
  //   } = this.context;

  //   return <div
  //     {...other}
  //   >
  //     <ConnectorContext.Consumer>
  //       {context => {



  //         const {
  //           data,
  //         } = context;

  //         if (!data) {
  //           return null;
  //         }


  //         const {
  //           objects,
  //           objectsConnection,
  //         } = data;

  //         let items = objects ? objects : objectsConnection ? objectsConnection.edges.map(n => n.node) : null;

  //         if (!items) {
  //           return null;
  //         }

  //         return <Grid
  //           container
  //           {...this.getComponentProps(this)}
  //         >

  //           {items.length ? items.map((n, index) => {

  //             const {
  //               id,
  //             } = n;

  //             return <ObjectContext.Provider
  //               key={id || index}
  //               value={{
  //                 object: n,
  //               }}
  //             >
  //               {super.renderMainView()}
  //             </ObjectContext.Provider>
  //           }) : super.renderMainView()}

  //         </Grid>;
  //       }}
  //     </ConnectorContext.Consumer>
  //   </div>

  //     ;
  // }

  renderChildren() {

    const {
      ...other
    } = this.getRenderProps();



    const {
      Grid,
    } = this.context;

    let children = super.renderChildren();

    return <ConnectorContext.Consumer>
      {context => {



        const {
          data,
        } = context;

        if (!data) {
          return null;
        }


        const {
          objects,
          objectsConnection,
        } = data;

        let items = objects ? objects : objectsConnection ? objectsConnection.edges.map(n => n.node) : null;

        if (!items) {
          return null;
        }

        return <Grid
          container
          {...this.getComponentProps(this)}
        >

          {items.length ?
            items.map((n, index) => {

              const {
                id,
              } = n;

              return <ObjectContext.Provider
                key={id || index}
                value={{
                  object: n,
                }}
              >
                {children}
              </ObjectContext.Provider>
            })
            :
            children
          }

        </Grid>;
      }}
    </ConnectorContext.Consumer>

      ;
  }

}


export default ListView;