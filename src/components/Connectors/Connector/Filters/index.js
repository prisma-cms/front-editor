import React from 'react'
import PropTypes from 'prop-types'

import Connector, { ConnectorContext } from '..'

import FiltersIcon from 'material-ui-icons/FilterList'
import EditorComponent from '../../../../EditorComponent'

import PrismaCmsFilters from '@prisma-cms/filters'
import ObjectConnector from '../../ObjectConnector'

class Filters extends EditorComponent {
  static Name = 'Filters'

  static propsTypes = {
    ...EditorComponent.propsTypes,
    visible: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    visible: true,
    hide_wrapper_in_default_mode: true,
  }

  canBeChild() {
    return false
  }

  canBeParent(parent) {
    let can = false

    if (super.canBeParent(parent)) {
      while (parent) {
        if (parent instanceof Connector || parent instanceof ObjectConnector) {
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
          <FiltersIcon /> Filters
        </div>
      )
    )
  }

  renderChildren() {
    const { inEditMode } = this.getEditorContext()

    const { visible } = this.getComponentProps(this)

    if (!visible && !inEditMode) {
      return null
    }

    return (
      <ConnectorContext.Consumer key="connector_context">
        {(context) => {
          const { queryName, filters, setFilters } = context

          if (!queryName) {
            return null
          }

          return (
            <PrismaCmsFilters
              queryName={queryName}
              filters={filters}
              setFilters={setFilters}
            />
          )
        }}
      </ConnectorContext.Consumer>
    )
  }
}

export default Filters
