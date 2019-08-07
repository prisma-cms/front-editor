import React from 'react';
import Iterable from '../../Connectors/Connector/ListView/Iterable';

export class Select extends Iterable {

  static Name = 'Select';

  static defaultProps = {
    ...Iterable.defaultProps,
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        Select
      </div>
    );
  }


  // getRootElement() {

  //   return super.getRootElement();
  // }


  // canBeParent(parent) {

  //   return super.canBeParent(parent);
  // }


  // canBeChild(child) {

  //   return super.canBeChild(child);
  // }

  // renderChildren() {

  //   const {
  //     items,
  //     ObjectContext,
  //     children = null,
  //   } = this.props;

  //   console.log("Select props", this.props);

  //   /**
  //    * Если не были переданы объекты или не был передан контекст,
  //    * возвращаем нативный результат.
  //    * Так сделано, потому что этот компонент может быть вставлен как в тело запроса (и выводить результаты из базы данных),
  //    * так и просто выводить дочерние элементы
  //    */
  //   if (items === undefined || !ObjectContext) {
  //     return super.renderChildren();
  //   }

  //   else if (!items) {
  //     return null;
  //   }

  //   // else

  //   const children = super.renderChildren();

  //   return items.length ? items.map((n, index) => {

  //     const {
  //       id,
  //     } = n;

  //     return <ObjectContext.Provider
  //       key={id || index}
  //       value={{
  //         object: n,
  //       }}
  //     >
  //       {super.renderChildren()}
  //     </ObjectContext.Provider>
  //   }) : children

  // }





  renderItems(items, children) {

    return <select>
      {super.renderItems(items, children)}
    </select>;

  }


  renderItem(item, key, children) {

    const {
      ObjectContext,
    } = this.props;

    const {
      id,
      name,
    } = item;

    return children.length
      ?
      <ObjectContext.Provider
        key={id || key}
        value={{
          object: item,
        }}
      >
        {children}
      </ObjectContext.Provider>
      :
      <option
        value={id}
      >
        {name}
      </option>
  }


}

export default Select;