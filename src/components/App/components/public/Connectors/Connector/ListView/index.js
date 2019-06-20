import React, { Component, Fragment, createContext, Children } from 'react';
import PropTypes from 'prop-types';

import ViewIcon from "material-ui-icons/ViewModule";
import Connector, { ConnectorContext } from '..';
import EditorComponent from '../../../..';

import Iterable from "./Iterable";
import NamedField from '../Fields/NamedField';

export const ObjectContext = createContext({});

class ListView extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    spacing: 8,
  };

  static Name = "ListView"
  static help_url = "https://front-editor.prisma-cms.com/topics/list-view.html";


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();


    return super.renderPanelView(
      content ||
      <div
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


  canBeParent(parent) {


    let can = false;

    // return false;

    if (super.canBeParent(parent)) {

      while (parent) {

        if (parent instanceof Connector || parent instanceof NamedField) {

          can = true;

          break;
        }

        parent = parent.props.parent;
      }

    }

    return can;
  }


  renderMainView() {

    const {
      inEditMode,
    } = this.getEditorContext();

    return inEditMode ? super.renderMainView() : this.renderChildren();

  }


  renderChildren() {

    const {
      style,
      ...other
      // } = this.getRenderProps();
    } = this.getComponentProps(this);



    const {
      Grid,
    } = this.context;



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
          ...otherData
        } = data;

        let items = objects ? objects : objectsConnection ? objectsConnection.edges.map(n => n.node) : null;

        if (!items) {
          return null;
        }

        const children = super.renderChildren();

        let output = null;

        /**
        Так как в некоторых случаях нам надо вывести полученные данные без лишних оберток,
        проверяем является ли дочерний элемент производным от Iterable.
        Если является таковым, то рендерим в него все полученные объекты
         */
        {/* if (children.length === 1 && children[0].__proto__.isPrototypeOf(Iterable)) { */ }
        if (children.length === 1 && children[0]
          && (
            Iterable.isPrototypeOf(children[0].type)
            || children[0].type === Iterable
          )) {

          let child = children[0];



          {/* 
          
          console.log("child", child);
          console.log("child type", child.type);
          console.log("Iterable", Iterable);

          console.log("child === Iterable", child, child.type === Iterable);

          console.log("child === Iterable 2", child.__proto__.isPrototypeOf(Iterable));
          console.log("child === Iterable 3", Iterable.isPrototypeOf(child.type));
          console.log("child === Iterable 4", child.type.isPrototypeOf(Iterable));
          console.log("child === Iterable 5", child.type === Iterable);

          console.log("child === TestIterable", child, child.type === TestIterable);

          console.log("child === TestIterable constructor", child.type.constructor === TestIterable.constructor);
          console.log("child === Iterable constructor", child.type.constructor === Iterable.constructor);

          console.log("child === Instance", child.type instanceof Iterable);
          console.log("child === Instance 2", child instanceof Iterable);
          console.log("child === Instance 3", child.type.prototype === Iterable);

          */}

          const {
            type: Type,
            props,
          } = child;


          output = <Type
            {...props}
            items={items}
            ObjectContext={ObjectContext}
          >
            {/* {output} */}
          </Type>

        }
        else {

          output = <Grid
            container
            {...other}
          >

            {items.length ? items.map((n, index) => {

              const {
                id,
              } = n;

              return <ObjectContext.Provider
                key={id || index}
                value={{
                  object: n,
                  ...otherData,
                }}
              >
                {children}
              </ObjectContext.Provider>
            }) : children}

          </Grid>;
        }

        return output;

      }}
    </ConnectorContext.Consumer>

      ;
  }

  // renderChildren() {

  //   const {
  //     style,
  //     ...other
  //     // } = this.getRenderProps();
  //   } = this.getComponentProps(this);



  //   const {
  //     Grid,
  //   } = this.context;

  //   let children = super.renderChildren();

  //   return <ConnectorContext.Consumer>
  //     {context => {

  //       const {
  //         data,
  //       } = context;

  //       if (!data) {
  //         return null;
  //       }


  //       const {
  //         objects,
  //         objectsConnection,
  //       } = data;

  //       let items = objects ? objects : objectsConnection ? objectsConnection.edges.map(n => n.node) : null;

  //       if (!items) {
  //         return null;
  //       }

  //       return <Grid
  //         container
  //         {...other}
  //       >

  //         {items.length ?
  //           items.map((n, index) => {

  //             const {
  //               id,
  //             } = n;

  //             return <ObjectContext.Provider
  //               key={id || index}
  //               value={{
  //                 object: n,
  //               }}
  //             >
  //               {children}
  //             </ObjectContext.Provider>
  //           })
  //           :
  //           children
  //         }

  //       </Grid>;
  //     }}
  //   </ConnectorContext.Consumer>

  //     ;
  // }

}


export default ListView;