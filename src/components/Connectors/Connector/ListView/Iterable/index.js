import React from 'react'
import PropTypes from 'prop-types'
import EditorComponent from '../../../../../EditorComponent'
import DefaultValue from '../../Fields/NamedField/DefaultValue'
import ListView from '..'

class Iterable extends EditorComponent {
  static Name = 'Iterable'

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...EditorComponent.propTypes,
    items: PropTypes.array,
    ObjectContext: PropTypes.object,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content !== undefined ? (
        content
      ) : (
        <div className="editor-component--panel-icon">
          {/* <Icon />  */}
          Iterable
        </div>
      )
    )
  }

  canBeParent(parent) {
    return super.canBeParent(parent) && parent instanceof ListView
  }

  renderChildren() {
    const {
      items,
      ObjectContext,
      // children = null,
    } = this.props

    /**
     * Если не были переданы объекты или не был передан контекст,
     * возвращаем нативный результат.
     * Так сделано, потому что этот компонент может быть вставлен как в тело запроса (и выводить результаты из базы данных),
     * так и просто выводить дочерние элементы
     */

    const children = super.renderChildren()
    const childrenWithoutDefault = children.filter(
      (n) => n && n.type !== DefaultValue
    )

    if (items === undefined || !ObjectContext) {
      // return children;
      return null
    } else if (!items) {
      return null
    }

    // else

    return items.length
      ? this.renderItems(items, childrenWithoutDefault)
      : children.filter((n) => n && n.type === DefaultValue)
  }

  renderItems(items, children) {
    return items.map((n, index) => {
      return this.renderItem(n, index, children)
    })
  }

  renderItem(item, key, children) {
    const { ObjectContext } = this.props

    const { id } = item

    return (
      <ObjectContext.Provider
        key={id || key}
        value={{
          object: item,
        }}
      >
        {children}
      </ObjectContext.Provider>
    )
  }
}

export default Iterable
