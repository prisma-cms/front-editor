import React from 'react';
import EditorComponent from '../../..';
import EditableObject from '../../form/EditableObject';
import { EditableObjectContext } from '../../../../context';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import FalleryFilesRenderer from './renderer';


export class GalleryFiles extends EditorComponent {

  static Name = 'GalleryFiles';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: 'Files',
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
        GalleryFiles
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent) && this.findInParent(parent, parent => parent instanceof EditableObject);
  }


  canBeChild(child) {

    return super.canBeChild(child);
  }


  renderChildren() {

    const {
      Image,
      Grid,
    } = this.context;

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      name,
      // ...other
    } = this.getComponentProps(this);

    const children = super.renderChildren();

    if (inEditMode) {
      return children;
    }

    // const {
    //   0: fileConnector,
    // } = children.slice(0).splice(0, 1);

    // console.log('fileConnector', fileConnector);

    // const {

    // } = fileConnector;

    // console.log('fileConnector clone', fileConnector.cloneElement());

    /**
     * Проблема заключается в том, что надо соблюдать сортировку для новых файлов и имеющихся.
     */

    return <EditableObjectContext.Consumer
      key="GalleryFiles"
    >
      {editableObjectContext => {

        // console.log('editableObjectContext', editableObjectContext);

        const {
          object,
          getObjectWithMutations,
          _dirty,
        } = editableObjectContext;

        if (!getObjectWithMutations) {
          return null;
        }

        return <FalleryFilesRenderer
          object={object}
          getObjectWithMutations={getObjectWithMutations}
          name={name}
          dirty={_dirty}
          Grid={Grid}
          Image={Image}
        />

      }}
    </EditableObjectContext.Consumer>
  }

}

export default GalleryFiles;