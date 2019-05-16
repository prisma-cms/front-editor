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


          /**
          Так как без опеределения типа данных мы можем уйти не в тот контекст, возвращаем ничего,
          если значение отсутствует или null
           */
          if (value !== undefined && value !== null) {

            if (typeof value === "object") {

              if (Array.isArray(value)) {
                /**
                Если это массив, то передаем как массив объектов.
                Если объект, то передаем как объект
                 */

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
