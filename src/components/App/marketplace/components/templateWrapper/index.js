import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../components';
import { Paper } from 'material-ui';
import { ObjectContext } from '../../../components/public/Connectors/Connector/ListView';
import { IconButton } from 'material-ui';

import CloneIcon from 'material-ui-icons/ContentCopy';
import DeleteIcon from 'material-ui-icons/Delete';
import gql from 'graphql-tag';


class TemplateWrapper extends EditorComponent {

  static Name = "TemplateWrapper";


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      TemplateWrapper
    </div>);
  }


  renderMainView() {

    const {
      Grid,
    } = this.context;

    const {
      // activeItem,
      FrontEditor,
    } = this.props;

    const {
      classes,
    } = this.getEditorContext();

    return <ObjectContext.Consumer>
      {context => {

        // console.log("TemplateWrapper context", { ...context });

        const {
          object,
        } = context;

        if (!object) {
          return null;
        }


        {/* let {
          id,
          externalKey,
          createdAt,
          updatedAt,
          rank,
          ...newObject
        } = object; */}


        const {
          id: objectId,
          name,
          component,
        } = object;


        return <Paper
          style={{
            cursor: "pointer",
            padding: 10,
            margin: "10px 0",
            width: "100%",
          }}
          onClick={event => {

            event.preventDefault();
            event.stopPropagation();

            this.insertComponent(object);

          }}
        >

          <Grid
            container
            spacing={0}
          >

            <Grid
              item
            >
              {name}
            </Grid>

            {component !== name ?
              <Grid
                item
              >
                / {component}
              </Grid>
              : null
            }

            <Grid
              item
              xs
            >

            </Grid>

            <Grid
              item
            >
              <IconButton
                className={classes.badgeButton}
                title="Insert with ID"
                onClick={event => {

                  event.preventDefault();
                  event.stopPropagation();

                  this.insertComponent(object, true);

                }}
              >
                <CloneIcon
                />
              </IconButton>
            </Grid>

            <Grid
              item
            >
              <IconButton
                className={classes.badgeButton}
                title="Delete template"
                onClick={event => {

                  event.preventDefault();
                  event.stopPropagation();

                  this.deleteTemplate(object);

                }}
              >
                <DeleteIcon
                />
              </IconButton>
            </Grid>

          </Grid>

          {this.renderChildren()}

          <hr />

          <FrontEditor
            data={{
              object,
            }}
          />

        </Paper>
      }}
    </ObjectContext.Consumer>
  }


  insertComponent(object, withID = false) {


    const {
      activeItem,
    } = this.props;


    let {
      id,
      name,
      description,
      props,
      component,
      components,
      Parent,
    } = object;


    let newObject = {
      name,
      description,
      props,
      component,
      components,
      Parent,
    }

    if (withID) {
      Object.assign(newObject, {
        id,
      });
    }

    newObject = JSON.parse(JSON.stringify(newObject));

    // alert("Sdfsdfs");

    // console.log("TemplateWrapper props", { ...this.props });

    // console.log("newObject", newObject);

    if (activeItem) {
      activeItem.addComponent(newObject);
    }

  }


  async deleteTemplate(object) {

    const {
      id: templateId,
    } = object;


    if (window.confirm("Delete this template?")) {

      const {
        query: {
          deleteTemplate,
        },
      } = this.context;

      // console.log("deleteTemplate", deleteTemplate);

      this.mutate({
        mutation: gql(deleteTemplate),
        variables: {
          where: {
            id: templateId,
          },
        },
      });

    }

  }

}


export default TemplateWrapper;