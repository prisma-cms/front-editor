import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../../..';
import { ObjectContext } from '../../ListView';

import Icon from "material-ui-icons/ShortText";
import { ConnectorContext } from '../..';

class NamedField extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: "",
    tag: "span",
  }


  static Name = "NamedField"


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      <Icon /> Object field
    </div>);
  }


  getRootElement() {

    const {
      tag,
    } = this.getComponentProps(this);

    return tag || "span";
  }


  renderChildren() {

    // const {
    //   UserLink,
    // } = this.context;

    const {
      // props: {
      //   name,
      //   ...otherProps
      // },
      name,
      ...other
    } = this.getComponentProps(this);


    if (!name) {
      return null;
    }


    /**
     * Дочерние элементы выводим только в том случае, если значение массив или объект,
     * иначе есть вероятность, что на нижних уровнях компоненты попадут в контект не того объекта
     */
    // const children = super.renderChildren();

    // console.log("NamedField children", children);

    return <ObjectContext.Consumer>
      {context => {



        const {
          object,
          ...other
        } = context;

        if (!object) {
          return null;
        }




        let output = null;

        {/* 
        if (children && children.length) {

          output = children;

        }
        else { */}

        if (name) {
          const {
            [name]: value,
          } = object;

          {/* console.log("NamedField value", value); */ }

          if (value !== undefined) {

            if (typeof value === "object") {

              if (Array.isArray(value)) {
                /**
                Если это массив, то передаем как массив объектов.
                Если объект, то передаем как объект
                 */

                {/* console.log("NamedField Array.isArray", value); */ }

                {/* output = value.filter(n => n).map((n, index) => {
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
                }); */}

                output = <ConnectorContext.Provider
                  value={{
                    data: {
                      objects: value,
                    },
                  }}
                >
                  {super.renderChildren()}
                </ConnectorContext.Provider>

              }
              else {

                {/* console.log("NamedField value is object", { ...value }); */ }

                return <ObjectContext.Provider
                  value={{
                    object: value,
                  }}
                >
                  {super.renderChildren()}
                </ObjectContext.Provider>

              }

            }
            else {
              output = value;
            }

          }

        }
        {/* 
        } */}



        return output;

        // return value && (typeof value !== "object") ? value : null;

      }}
    </ObjectContext.Consumer>;
  }

}

export default NamedField;
