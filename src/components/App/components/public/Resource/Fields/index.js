import React, { Fragment } from 'react';
import PropTypes from "prop-types";

import EditorComponent from '../../..';
// import Button from 'material-ui/Button';
import { EditableObjectContext, EditorContext } from '../../../../context';
import Typography from 'material-ui/Typography';
import EditableObject from '../../form/EditableObject';


export class ResourceFieldsProxy extends EditorComponent {


  static propTypes = {
    objectContext: PropTypes.object.isRequired,
  }


  isDeletable() {

    return false;
  }

  /**
   * Обновление данных объекта.
   * Так как компоненты рендерятся на основании передаваемых свойств,
   * надо обновить данные абсолютного родителя, а не просто текущего элемента
   */
  updateObject(data) {

    // console.log("ResourceFieldsProxy updateObject data", JSON.stringify(data, true, 2));

    // return;

    // const object = this.getObjectWithMutations();

    const {
      objectContext,
    } = this.props;

    // console.log("ResourceFieldsProxy updateObject objectContext", { ...objectContext });

    const {
      updateObject,
    } = objectContext;



    return updateObject(data);

  }

}


export class ResourceFields extends EditorComponent {

  static Name = 'ResourceFields';

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      <div
        className={classes.panelButton}
      >
        ResourceFields
      </div>
    );
  }


  renderMainView() {

    return <EditableObjectContext.Consumer>
      {context => {

        Object.assign(this, {
          objectContext: context,
        });

        return super.renderMainView();

      }}
    </EditableObjectContext.Consumer>;
  }


  updateObject(data) {

    const {
      inEditMode,
    } = this.getEditorContext();


    if (inEditMode) {
      return super.updateObject(data);
    }
    else {

      const {
        objectContext,
      } = this;

      const {
        updateObject,
        getObjectWithMutations,
      } = objectContext || {};


      if (updateObject && getObjectWithMutations) {
        // console.log("updateObject updateObject", updateObject);

        const {
          components,
        } = getObjectWithMutations() || {}

        if (components) {
          updateObject({
            components,
          });
        }

      }

    }

    return false;
  }




  addComponent(item) {


    const {
      inEditMode,
    } = this.getEditorContext();



    if (inEditMode) {
      return super.addComponent(item);
    }


    const {
      name,
      component,
    } = item;

    if (!component) {
      item.component = name;
    }

    this.addItem(item);

  }

  addItem(item) {


    const {
      objectContext: {
        updateObject,
        getObjectWithMutations,
      },
    } = this;


    const {
      components,
    } = getObjectWithMutations() || {};

    updateObject({
      components: (components || []).concat([item]),
    });

  }


  canBeParent(parent) {

    return super.canBeParent(parent) && this.findInParent(parent, parent => parent instanceof EditableObject)
  }


  // getActiveParent() {

  //   const {
  //     inEditMode,
  //   } = this.getEditorContext();

  //   let parent;

  //   if (inEditMode) {

  //     parent = super.getActiveParent();

  //   }
  //   else {
  //     parent = this;
  //   }


  //   return parent;

  // }


  // getActionPanel() {
  //   return this.actionPanel;
  // }


  renderChildren() {

    const {
      inEditMode,
    } = this.getEditorContext();


    const {
      objectContext,
    } = this;

    const {
      inEditMode: objectInEditMode,
      getObjectWithMutations,
    } = objectContext;


    if (!getObjectWithMutations) {

      if (inEditMode) {

        return <Typography
          color="error"
        >
          EditableObject can not be found in parents
        </Typography>
      }
      else {
        return null;
      }
    }

    const {
      components,
    } = getObjectWithMutations() || {};


    let customComponents;
    let actionPanel;


    if (!inEditMode && (
      (components && components.length) || objectInEditMode)
    ) {

      if (objectInEditMode) {
        actionPanel = <div
          ref={el => {
            this.actionPanel = el;
          }}
          className={["front-editor--action-panel"].join(" ")}
        ></div>
      }

      customComponents = <EditorContext.Consumer>
        {context => {

          if (objectInEditMode) {

            context = {
              ...context,
              inEditMode: true,
              getActionPanel: () => {
                return this.actionPanel;
              },
            };

          }

          return <EditorContext.Provider
            value={context}
          >

            <ResourceFieldsProxy
              object={{
                props: {},
                components,
              }}
              parent={this}
              mode="main"
              objectContext={objectContext}
            />

          </EditorContext.Provider>
        }}
      </EditorContext.Consumer>

    }


    return <Fragment
      key="ResourceFields"
    >

      {super.renderChildren()}

      {customComponents}

      {actionPanel}

    </Fragment>

  }

}

export default ResourceFields;