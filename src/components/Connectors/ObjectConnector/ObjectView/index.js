import React from 'react'
import PropTypes from 'prop-types'

// import ViewIcon from "material-ui-icons/ViewModule";
import { ConnectorContext } from '../../Connector'
import EditorComponent from '../../../../EditorComponent'

import { ObjectContext } from '../../Connector/ListView'
import ObjectConnector from '..'
import NamedField from '../../Connector/Fields/NamedField'
import DefaultValue from '../../Connector/Fields/NamedField/DefaultValue'

class ObjectView extends EditorComponent {
  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...EditorComponent.propTypes,
    seo_description_field: PropTypes.string,
    seo_keywords_field: PropTypes.string,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    spacing: 8,
    hide_wrapper_in_default_mode: true,
    field_as_pagetitle: '',
    seo_description_field: undefined,
    seo_keywords_field: undefined,
  }

  static Name = 'ObjectView'
  static help_url =
    'https://front-editor.prisma-cms.com/topics/object-view.html'

  canBeParent(parent) {
    let can = false

    // return false;

    if (super.canBeParent(parent)) {
      while (parent) {
        if (parent instanceof ObjectConnector || parent instanceof NamedField) {
          can = true

          break
        }

        parent = parent.props.parent
      }
    }

    return can
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          {/* <ViewIcon />  */}
          Object View
        </div>
      )
    )
  }

  getRenderProps() {
    const { style, ...props } = super.getRenderProps()

    return {
      style: {
        width: '100%',
        ...style,
      },
      ...props,
    }
  }

  renderChildren() {
    let children = super.renderChildren() || []

    return (
      <ConnectorContext.Consumer key="connector_context">
        {(context) => {
          const { data } = context

          if (!data) {
            return null
          }

          const { object, loading } = data

          if (!object) {
            if (loading) {
              return null
            } else {
              children = children.filter((n) => n && n.type === DefaultValue)
            }
          } else {
            children = children.filter((n) => n && n.type !== DefaultValue)
          }

          return (
            <ObjectContext.Provider value={data}>
              {children}
            </ObjectContext.Provider>
          )
        }}
      </ConnectorContext.Consumer>
    )
  }
}

export default ObjectView
