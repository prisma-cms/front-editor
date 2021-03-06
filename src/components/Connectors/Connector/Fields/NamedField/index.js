import React from 'react'
// import PropTypes from 'prop-types';
import EditorComponent from '../../../../../EditorComponent'
import { ObjectContext } from '../../ListView'

import Icon from 'material-ui-icons/ShortText'
import { ConnectorContext } from '../..'

import NumberFormat from 'react-number-format'
import moment from 'moment'
import Typography from 'material-ui/Typography'
import DefaultValue from './DefaultValue'
import Grid from '../../../../../common/Grid'

class NamedField extends EditorComponent {
  static Name = 'NamedField'

  // static propTypes = {
  //   // eslint-disable-next-line react/forbid-foreign-prop-types
  //   ...EditorComponent.propTypes,

  //   /**
  //    * Если нет, то контекст родителя не будет перетерт.
  //    * Это удобно для того, чтобы просто проверять на наличие значения.
  //    */
  //   override_context: PropTypes.bool.isRequired,
  // }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: '',
    tag: 'span',
    type: undefined,
    format: undefined,
    override_context: true,
    hide_wrapper_in_default_mode: true,
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <Icon /> Object field
        </div>
      )
    )
  }

  getRootElement() {
    const { tag } = this.getComponentProps(this)

    return tag || 'span'
  }

  renderBadgeTitle(title) {
    const { name } = this.getComponentProps(this)

    return (
      <Grid
        container
        spacing={8}
        alignItems="center"
        style={{
          flexWrap: 'nowrap',
        }}
      >
        <Grid item>{super.renderBadgeTitle(title)}</Grid>
        {name ? (
          <Grid item>
            <b>{name}</b>
          </Grid>
        ) : null}
      </Grid>
    )
  }

  getComponentProps(component) {
    const { type, ...props } = super.getComponentProps(component)

    let otherProps = {}

    switch (type) {
      case 'number':
        {
          const {
            thousandSeparator = ' ',
            decimalSeparator = '.',
            decimalScale,
            prefix,
            suffix,
            defaultValue,
            isNumericString = false,
            displayType = 'text',
            mask,
          } = props

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
        }
        break

      default:
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
      override_context,
      ...other
    } = this.getComponentProps(this)

    if (!name) {
      return null
    }

    // const {
    //   inEditMode,
    // } = this.getEditorContext();

    /**
     * Дочерние элементы выводим только в том случае, если значение массив или объект,
     * иначе есть вероятность, что на нижних уровнях компоненты попадут в контект не того объекта
     */

    return (
      <ObjectContext.Consumer key="object_context">
        {(context) => {
          const { object } = context

          if (!object) {
            return null
          }

          let output = null

          if (name) {
            let { [name]: value } = object

            let children = super.renderChildren() || []
            const childrenWithoutDefaultValue = children.filter(
              (n) => n && n.type !== DefaultValue
            )

            /**
          Так как без опеределения типа данных мы можем уйти не в тот контекст, возвращаем ничего,
          если значение отсутствует или null
           */
            {
              /* TODO: Check if broken */
            }
            {
              /* if (value !== undefined || true) { */
            }
            if (value !== undefined) {
              if (typeof value === 'object' && value !== null) {
                if (Array.isArray(value)) {
                  /**
                Если это массив, то передаем как массив объектов.
                Если объект, то передаем как объект
                 */

                  output = value.length
                    ? children.filter((n) => n && n.type !== DefaultValue)
                    : children.filter((n) => n && n.type === DefaultValue)

                  if (override_context) {
                    output = (
                      <ConnectorContext.Provider
                        value={{
                          data: {
                            objects: value,
                          },
                        }}
                      >
                        {output}
                      </ConnectorContext.Provider>
                    )
                  }
                } else {
                  // children = children.filter(n => n && n.type !== DefaultValue);
                  // output = value ? children.filter(n => n && n.type !== DefaultValue) : children.filter(n => n && n.type === DefaultValue);

                  output = value
                    ? childrenWithoutDefaultValue
                    : children.filter((n) => n && n.type === DefaultValue)

                  if (override_context) {
                    output = (
                      <ObjectContext.Provider
                        value={{
                          object: value,
                        }}
                      >
                        {output}
                      </ObjectContext.Provider>
                    )
                  }
                }
              } else if (!value) {
                /**
              Есть предположение, что надо перетирать контекст, даже если нет объекта.
              Но это сейчас больше неудобств добавить.
              Вероятнее всего надо добавлять сущность новую Child для предполагаемого дочернего объекта 
              и Children для предполагаемого массива дочерних объектов
               */
                children = children.filter((n) => n && n.type === DefaultValue)

                output = children
              } else {
                /**
                  Если есть скалярное значение
                  Если есть дочерние элементы, то выводим их.
                */
                if (childrenWithoutDefaultValue.length) {
                  /**
                  Даже если за вычетом дефолтных элементов не останется дочерних элементов,
                  все равно выводим остаточный пустой массив, а не само значение,
                  так как логика может быть заложена именно на проверку значения,
                  чтобы ничего не выводить, если значение есть.
                 */

                  output = childrenWithoutDefaultValue
                } else {
                  /**
                    Иначе выводим просто скалярное значение
                  */
                  value = this.prepareScalarValue(value, context)

                  switch (type) {
                    case 'number':
                      {
                        const { defaultValue } = other

                        output = (
                          <NumberFormat
                            value={value || defaultValue || ''}
                            {...other}
                          />
                        )
                      }

                      break

                    case 'date':
                      if (value) {
                        const { format } = other

                        let date = moment(value)

                        if (date.isValid()) {
                          if (format) {
                            date = date.format(format)
                          }

                          output = date.toString()
                        } else {
                          output = (
                            <Typography color="error">Invalid date</Typography>
                          )
                        }
                      }

                      break

                    default:
                      output = value
                  }
                }
              }
            }
          }

          return output
        }}
      </ObjectContext.Consumer>
    )
  }

  prepareScalarValue(value) {
    return value
  }
}

export default NamedField
