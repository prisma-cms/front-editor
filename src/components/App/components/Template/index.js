import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EditableObject from "apollo-cms/lib/DataView/Object/Editable";
import gql from 'graphql-tag';

class EditorTemplate extends EditableObject {


  canEdit() {

    return true;
  }


  renderEditableView() {
    return this.renderDefaultView();
  }




  async saveObject(data) {


    const {
      mutate,
    } = this.props;

    if (mutate) {
      return super.saveObject(data);
    }

    const mutation = this.getMutation(data);

    const result = await this.mutate(mutation).then(r => r).catch(e => {

      // throw (e);
      return e;
    });

    // console.log("result 333", result);

    return result;

  }


  async mutate(props) {


    // console.log("mutate props", props);

    // return;

    const {
      query: {
        createTemplateProcessor,
        updateTemplateProcessor,
      },
    } = this.context;

    const {
      id,
    } = this.getObjectWithMutations();

    const mutation = gql(id ? updateTemplateProcessor : createTemplateProcessor);

    return super.mutate({
      mutation,
      ...props
    })
  }


  renderDefaultView() {


    // console.log("EditorTemplate", this.props);

    return (
      <div>
        EditorTemplate
      </div>
    );
  }


}

// EditorTemplate.propTypes = {

// };

export default EditorTemplate;