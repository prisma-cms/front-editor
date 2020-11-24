import React, { createContext } from 'react';
// import PropTypes from 'prop-types';

import ViewIcon from "material-ui-icons/ViewModule";
import Connector, { ConnectorContext } from '..';
import EditorComponent from '../../../../EditorComponent';

import Iterable from "./Iterable";
import NamedField from '../Fields/NamedField';
import DefaultValue from '../Fields/NamedField/DefaultValue';

export const ObjectContext = createContext({});

class ListView extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    // spacing: 8,
    hide_wrapper_in_default_mode: true,
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


  // getRenderProps() {

  //   const {
  //     style,
  //     ...props
  //   } = super.getRenderProps();

  //   return {
  //     style: {
  //       ...style,
  //       width: "100%",
  //       display: "flex",
  //       flexDirection: "row",
  //       flexWrap: "wrap",
  //     },
  //     ...props,
  //   }
  // }


  canBeParent(parent) {

    return super.canBeParent(parent) && this.findInParent(parent, parent => parent instanceof Connector || parent instanceof NamedField);
  }


  // renderMainView() {

  //   const {
  //     inEditMode,
  //   } = this.getEditorContext();

  //   return inEditMode ? super.renderMainView() : this.renderChildren();

  // }


  renderChildren() {


    return <ConnectorContext.Consumer
      key="connector_context"
    >
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

        const items = objects ? objects : objectsConnection ? objectsConnection.edges.map(n => n.node) : null;

        if (!items) {
          return null;
        }

        let children = super.renderChildren() || [];

        let output = null;

        /**
        Так как в некоторых случаях нам надо вывести полученные данные без лишних оберток,
        проверяем является ли дочерний элемент производным от Iterable.
        Если является таковым, то рендерим в него все полученные объекты
        if (children.length === 1 && children[0].__proto__.isPrototypeOf(Iterable))
         */
        if (children.length === 1 && children[0]
          && (
            // eslint-disable-next-line no-prototype-builtins
            Iterable.isPrototypeOf(children[0].type)
            || children[0].type === Iterable
          )) {

          const child = children[0];

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

          if (items.length) {

            children = children.filter(n => n && n.type !== DefaultValue);

            output = items.map((n, index) => {

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
            });

          }
          else {
            output = children.filter(n => n && n.type === DefaultValue);
          }

        }

        return output;

      }}
    </ConnectorContext.Consumer>

      ;
  }

}


export default ListView;