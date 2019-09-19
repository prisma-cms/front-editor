import React from 'react';
import PropTypes from 'prop-types';

// import ViewIcon from "material-ui-icons/ViewModule";

import EditorComponent from '../../../../..';
// import ListView from '..';
import DefaultValue from '../../Fields/NamedField/DefaultValue';



class Iterable extends EditorComponent {

  static Name = "Iterable"

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...EditorComponent.propTypes,
    items: PropTypes.array,
    ObjectContext: PropTypes.object,
  }


  // constructor(props) {

  //   super(props);
  // }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();


    return super.renderPanelView(content !== undefined ? content : <div
      className={classes.panelButton}
    >
      {/* <Icon />  */}
      Iterable
    </div>);
  }

  // canBeParent(parent) {

  //   return parent instanceof ListView && super.canBeParent(parent);
  // }


  renderMainView() {

    const {
      inEditMode,
    } = this.getEditorContext();

    return inEditMode ? super.renderMainView() : this.renderChildren();

  }


  renderChildren() {

    const {
      items,
      ObjectContext,
      // children = null,
    } = this.props;


    /**
     * Если не были переданы объекты или не был передан контекст,
     * возвращаем нативный результат.
     * Так сделано, потому что этот компонент может быть вставлен как в тело запроса (и выводить результаты из базы данных),
     * так и просто выводить дочерние элементы
     */

    const children = super.renderChildren();
    const childrenWithoutDefault = children.filter(n => n && n.type !== DefaultValue);

    if (items === undefined || !ObjectContext) {
      // return children;
      return null;
    }

    else if (!items) {
      return null;
    }

    // else

    return items.length ? this.renderItems(items, childrenWithoutDefault) : children.filter(n => n && n.type === DefaultValue);

  }


  renderItems(items, children) {

    return items.map((n, index) => {

      return this.renderItem(n, index, children);
    });

  }


  renderItem(item, key, children) {

    const {
      ObjectContext,
    } = this.props;

    const {
      id,
    } = item;

    return <ObjectContext.Provider
      key={id || key}
      value={{
        object: item,
      }}
    >
      {children}
    </ObjectContext.Provider>
  }


}


export default Iterable;