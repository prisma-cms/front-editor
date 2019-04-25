import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableObject from "apollo-cms/lib/DataView/Object/Editable";

class Template extends EditableObject {



  renderEditableView() {

    return this.renderDefaultView();
  }


  renderDefaultView() {

    const object = this.getObjectWithMutations();

    const inEditMode = this.isInEditmode();

    return <FrontEditor
      inEditMode={inEditMode}
      data={{
        object,
      }}
    />

  }

}


export default Template;