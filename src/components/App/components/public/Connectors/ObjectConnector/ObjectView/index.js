import React from 'react';
import PropTypes from 'prop-types';

// import ViewIcon from "material-ui-icons/ViewModule";
import { ConnectorContext } from '../../Connector';
import EditorComponent from '../../../..';


import { ObjectContext } from '../../Connector/ListView';
import ObjectConnector from '..';
import NamedField from '../../Connector/Fields/NamedField';
import DefaultValue from '../../Connector/Fields/NamedField/DefaultValue';

class ObjectView extends EditorComponent {


  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...EditorComponent.propTypes,
    seo_description_field: PropTypes.string,
    seo_keywords_field: PropTypes.string,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    spacing: 8,
    hide_wrapper_in_default_mode: true,
    field_as_pagetitle: "",
    seo_description_field: undefined,
    seo_keywords_field: undefined,
  };

  static Name = "ObjectView"
  static help_url = "https://front-editor.prisma-cms.com/topics/object-view.html";



  canBeParent(parent) {


    let can = false;

    // return false;

    if (super.canBeParent(parent)) {

      while (parent) {

        if (parent instanceof ObjectConnector || parent instanceof NamedField) {

          can = true;

          break;
        }

        parent = parent.props.parent;
      }

    }

    return can;
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
        {/* <ViewIcon />  */}
        Object View
    </div>);
  }


  getRenderProps() {

    const {
      style,
      ...props
    } = super.getRenderProps();

    return {
      style: {
        width: "100%",
        ...style,
      },
      ...props,
    }
  }


  renderChildren() {

    const {
      field_as_pagetitle,
      seo_description_field,
      seo_keywords_field,
    } = this.getComponentProps(this);


    let children = super.renderChildren() || [];

    return <ConnectorContext.Consumer
      key="connector_context"
    >
      {context => {

        const {
          data,
        } = context;


        if (!data) {
          return null;
        }

        // console.log("data", { ...data });

        const {
          object,
          loading,
        } = data;


        if (!object) {

          if (loading) {
            return null;
          }
          else {
            children = children.filter(n => n && n.type === DefaultValue);
          }

        }
        else {
          children = children.filter(n => n && n.type !== DefaultValue);
        }


        let meta;

        /**
        Устанавливает заголовок страницы
         */
        if (field_as_pagetitle) {

          const {
            [field_as_pagetitle]: title,
          } = object || {};

          meta = {
            ...meta,
            title,
          };

        }

        if (seo_description_field) {

          const {
            [seo_description_field]: description,
          } = object || {};

          meta = {
            ...meta,
            description,
          };

        }

        if (seo_keywords_field) {

          const {
            [seo_keywords_field]: keywords,
          } = object || {};

          meta = {
            ...meta,
            keywords,
          };

        }


        if (meta) {
          this.processMeta(meta);
        }

        return <ObjectContext.Provider
          value={data}
        >
          {children}
        </ObjectContext.Provider>

      }}
    </ConnectorContext.Consumer>;
  }

}


export default ObjectView;