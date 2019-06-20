import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';

// import ViewIcon from "material-ui-icons/ViewModule";

import EditorComponent from '../../../../..';
import ListView from '..';



class Iterable extends EditorComponent {

  static Name = "Iterable"

  static propTypes = {
    ...EditorComponent.propTypes,
    items: PropTypes.array,
    ObjectContext: PropTypes.object,
  }


  constructor(props) {

    super(props);
  }


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
      children = null,
    } = this.props;


    /**
     * Если не были переданы объекты или не был передан контекст,
     * возвращаем нативный результат.
     * Так сделано, потому что этот компонент может быть вставлен как в тело запроса (и выводить результаты из базы данных),
     * так и просто выводить дочерние элементы
     */
    if (items === undefined || !ObjectContext) {
      return super.renderChildren();
    }

    else if (!items) {
      return null;
    }

    // else

    return items.length ? items.map((n, index) => {

      const {
        id,
      } = n;

      return <ObjectContext.Provider
        key={id || index}
        value={{
          object: n,
        }}
      >
        {super.renderChildren()}
      </ObjectContext.Provider>
    }) : children

  }


}


export default Iterable;