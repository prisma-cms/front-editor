import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../../..';
import { ObjectContext } from '../../ListView';

import Icon from "material-ui-icons/ShortText";
import { ConnectorContext } from '../..';

import NumberFormat from "react-number-format";
import moment from "moment";
import { Typography } from 'material-ui';

class NamedField extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: "",
    tag: "span",
    type: undefined,
    format: undefined,
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


  getComponentProps(component) {

    const {
      type,
      ...props
    } = super.getComponentProps(component);

    let otherProps = {};

    switch (type) {

      case "number":

        const {
          thousandSeparator = " ",
          decimalSeparator = ".",
          decimalScale,
          prefix,
          suffix,
          defaultValue,
          isNumericString = false,
          displayType = "text",
          mask,
        } = props;

        otherProps = {
          thousandSeparator,
          decimalSeparator,
          decimalScale: decimalScale ? parseInt(decimalScale) : undefined,
          prefix,
          suffix,
          defaultValue: defaultValue ? parseFloat(defaultValue) : undefined,
          isNumericString,
          displayType,
          mask,
        }

        break;

    }

    return {
      type,
      ...props,
      ...otherProps,
    }

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
      type,
      ...other
    } = this.getComponentProps(this);


    if (!name) {
      return null;
    }


    const {
      inEditMode,
    } = this.getEditorContext();


    /**
     * Дочерние элементы выводим только в том случае, если значение массив или объект,
     * иначе есть вероятность, что на нижних уровнях компоненты попадут в контект не того объекта
     */

    return <ObjectContext.Consumer>
      {context => {



        const {
          object,
          ...otherContext
        } = context;

        if (!object) {
          return null;
        }




        let output = null;


        if (name) {
          const {
            [name]: value,
          } = object;


          /**
          Так как без опеределения типа данных мы можем уйти не в тот контекст, возвращаем ничего,
          если значение отсутствует или null
           */
          if (value !== undefined || true) {

            if (typeof value === "object" && value !== null) {

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

              switch (type) {

                case "number":

                  {
                    const {
                      defaultValue,
                    } = other;

                    output = <NumberFormat
                      value={value || defaultValue || ""}
                      {...other}
                    />;
                  }

                  break;

                case "date":

                  if (value) {


                    const {
                      format,
                    } = other;

                    let date = moment(value);

                    if (date.isValid()) {


                      if (format) {
                        date = date.format(format)
                      }


                      output = date.toString();

                    }
                    else {

                      output = <Typography
                        color="error"
                      >
                        Invalid date
                        </Typography>

                    }

                  }

                  break;

                default: output = value;
              }


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
