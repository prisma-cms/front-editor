import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";
import FrontEditor from "../App";

import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'material-ui';



class FrontEditorRoot extends PrismaCmsComponent {

  static propTypes = {
    ...PrismaCmsComponent.propTypes,
    data: PropTypes.object.isRequired,
    createTemplate: PropTypes.func.isRequired,
    updateTemplate: PropTypes.func.isRequired,
    inEditMode: PropTypes.bool.isRequired,
  }


  static defaultProps = {
    inEditMode: false,
  };


  constructor(props) {

    super(props);

    const {
      inEditMode = false,
    } = props;

    this.state = {
      ...this.state,
      inEditMode,
    }
  }


  componentWillMount() {

    const locales = {
      ru: {
        values: {
          Cancel: "Отмена",
          Edit: "Редактировать",
        },
      },
    }

    this.initLocales(locales);

    super.componentWillMount && super.componentWillMount();
  }

  render() {

    const {
      Grid,
      user: currentUser,
      openLoginForm,
    } = this.context;

    const {
      data: {
        loading,
        objects,
      },
      createTemplate,
      updateTemplate,
      CustomComponents,
      inEditMode: inEditModeNull,
      first,
      orderBy,
      ...other
    } = this.props;


    const {
      inEditMode,
    } = this.state;

    // console.log("this.context", this.context);

    let content = null;

    const {
      id: currentUserId,
    } = currentUser || {};

    /**
     * Если не был получен ни один шаблон, то предлагаем создать новый.
     * Если есть, то выводим первый
     */

    const templates = objects || [];

    let editorProps = {
      CustomComponents: [].concat((CustomComponents || [])),
      ...other
    }

    if (!templates.length) {

      if (loading) {
        content = "Loading...";
      }
      else {
        // content = <Grid
        //   container
        // >

        // </Grid>;

        if (!currentUserId) {

          content = <Button
            variant="raised"
            color="secondary"
            onClick={event => openLoginForm()}
          >
            Signin
          </Button>
        }

        else {

          let object = {
            name: "Page",
            rank: 1000,
            props: {},
            components: [],
          }

          content = <FrontEditor
            inEditMode={true}
            data={{
              object,
            }}
            _dirty={object}
            mutate={createTemplate}
            {...editorProps}
          />
        }

      }

    }
    else {

      const template = templates[0];

      let toolbar = null;

      const {
        CreatedBy: {
          id: createdById,
        },
      } = template;


      if (currentUserId && currentUserId === createdById) {

        toolbar = <Grid
          container
          style={{
            // flexDirection: "row-reverse",
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "auto",
            background: "rgba(255,255,255,0.5)",
            zIndex: 1000,
          }}
        >
          <Grid
            item
          >
            <Button
              size="small"
              onClick={event => this.setState({
                inEditMode: !inEditMode,
              })}
              variant="raised"
            >
              {inEditMode ? this.lexicon("Cancel") : this.lexicon("Edit")}
            </Button>
          </Grid>
        </Grid>
      }


      content = <Fragment>
        {toolbar}
        <FrontEditor
          inEditMode={inEditMode}
          data={{
            object: template,
          }}
          mutate={updateTemplate}
          {...editorProps}
        />
      </Fragment>;
    }

    // console.log("result");

    return super.render(
      content
    );
  }
}


export class RootConnector extends Component {

  static contextType = Context;


  static propTypes = {
    View: PropTypes.func.isRequired,
    first: PropTypes.number,
  }

  static defaultProps = {
    View: FrontEditorRoot,
    first: 1,
  }


  componentWillMount() {

    const {
      query: {
        templates,
        createTemplateProcessor,
        updateTemplateProcessor,
      },
    } = this.context;

    const {
      View,
    } = this.props;

    // console.log("context", this.context, templates);

    this.Renderer = compose(
      graphql(gql(templates)),
      graphql(gql(createTemplateProcessor), {
        name: "createTemplate",
      }),
      graphql(gql(updateTemplateProcessor), {
        name: "updateTemplate",
      }),
    )(View);

    super.componentWillMount && super.componentWillMount();
  }

  render() {

    // return null;

    const {
      View,
      ...other
    } = this.props;

    const {
      Renderer,
    } = this;

    return <Renderer
      {...other}
      orderBy="rank_DESC"
    />;
  }

}

export default RootConnector;