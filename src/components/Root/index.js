import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";
import PrismaCmsComponent from "@prisma-cms/component";
import FrontEditor from "../App";

import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import Button from 'material-ui/Button';



class FrontEditorRoot extends PrismaCmsComponent {

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...PrismaCmsComponent.propTypes,
    data: PropTypes.object.isRequired,
    createTemplate: PropTypes.func.isRequired,
    updateTemplate: PropTypes.func.isRequired,
    inEditMode: PropTypes.bool.isRequired,
    clonable: PropTypes.bool.isRequired,
  }


  static defaultProps = {
    inEditMode: false,
    clonable: true,
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
          Close: "Закрыть",
          "Edit template": "Редактировать шаблон",
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
      clonable,
      ...other
    } = this.props;




    const {
      inEditMode,
    } = this.state;



    let content = null;

    const {
      id: currentUserId,
      sudo,
    } = currentUser || {};

    /**
     * Если не был получен ни один шаблон, то предлагаем создать новый.
     * Если есть, то выводим первый
     */

    const templates = objects || [];

    let editorProps = {
      CustomComponents: [].concat((CustomComponents || [])),
      createTemplate,
      updateTemplate,
      ...other
    }




    if (!templates.length) {

      if (loading) {
        // content = "Loading...";
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
            component: "Page",
            rank: 1000,
            props: {},
            components: [],
          }

          content = <FrontEditor
            // key="new"
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
        CreatedBy,
      } = template;

      const {
        id: createdById,
      } = CreatedBy || {};


      /**
       * Если разрешено клонировать шаблоны или владелец - текущий пользователь, то выводим кнопки
       */
      if (clonable || sudo || (currentUserId && currentUserId === createdById)) {
        toolbar = <Grid
          rel="noindex, nofollow"
          container
          style={{
            // flexDirection: "row-reverse",
            position: "fixed",
            bottom: 0,
            right: 0,
            width: "auto",
            background: "rgba(255,255,255,0.5)",
            zIndex: 2000,
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
              {inEditMode ? this.lexicon("Close") : this.lexicon("Edit template")}
            </Button>
          </Grid>
        </Grid>
      }



      if (sudo || (currentUserId && currentUserId === createdById)) {
        Object.assign(editorProps, {
          mutate: updateTemplate,
        });
      }
      else {

        // let {
        //   id: templateId,
        //   name,
        //   props,
        //   components,
        // } = template;

        Object.assign(editorProps, {
          mutate: createTemplate,
          // _dirty: {
          //   name,
          //   props,
          //   components,
          //   Parent: {
          //     connect: {
          //       id: templateId,
          //     },
          //   },
          // },
        });
      }


      content = <Fragment
      // key={template ? `${template.id}-${template.updatedAt}` : "null"}
      >
        {toolbar}
        <FrontEditor
          inEditMode={inEditMode}
          data={{
            object: template,
          }}
          {...editorProps}
        />
      </Fragment>;
    }



    return super.render(
      content
    );
  }
}


export class RootConnector extends Component {

  static contextType = Context;


  static propTypes = {
    View: PropTypes.func.isRequired,
    // first: PropTypes.number,

    // Get templates for current project only (via domain)
    currentProjectOnly: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    View: FrontEditorRoot,
    // first: 1,

    currentProjectOnly: true,
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
      // orderBy,
      // first,
      View,
      currentProjectOnly,
      ...other
    } = this.props;

    const {
      Renderer,
    } = this;

    const {
      // user: currentUser,
      uri,
    } = this.context;


    // const {
    //   id: currentUserId,
    // } = currentUser || {};


    let OR = [
      {
        Parent: null,
        component: "Page",
      },
    ];

    let conditions = {
    };

    // if (currentUserId) {
    //   OR.push({
    //     CreatedBy: {
    //       id: currentUserId,
    //     },
    //   });

    //   Object.assign(conditions, {
    //     orderBy: "createdAt_DESC",
    //     first: 2,
    //   });

    // }
    // else {
    //   Object.assign(conditions, {
    //     orderBy: "rank_DESC",
    //     first: 1,
    //   });
    // }


    let where = {
      OR,
    };


    if (currentProjectOnly) {

      const domain = uri.hostname() || "localhost";


      // if(!domain) {

      //   console.error("Can not get domain");
      //   return null;
      // }

      Object.assign(where, {
        PrismaProject: {
          domain,
        },
      });

    }


    Object.assign(conditions, {
      orderBy: "rank_DESC",
      first: 1,
    });

    Object.assign(conditions, {
      where,
    });

    return <Renderer
      // key={currentUserId}
      {...conditions}
      {...other}
    />;
  }

}

export default RootConnector;