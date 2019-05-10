import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';

// import ViewIcon from "material-ui-icons/ViewModule";

import EditorComponent from '../../../../..';



class Iterable extends EditorComponent {

  static Name = "Iterable"

  static propTypes = {
    ...EditorComponent.propTypes,
    items: PropTypes.array.isRequired,
    ObjectContext: PropTypes.object.isRequired,
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


  renderChildren() {

    const {
      items,
      ObjectContext,
      children = null,
    } = this.props;

    if (!items) {
      return null;
    }


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

export class TestIterable extends Iterable {

  constructor(props) {

    super(props);

  }

}


export default Iterable;