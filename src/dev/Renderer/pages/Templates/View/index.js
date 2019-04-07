import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import {
  styles,
  TableView,
} from 'apollo-cms/lib/DataView/List/Table';

import { withStyles } from 'material-ui/styles';

import PublicIcon from "material-ui-icons/Public";


export class TemplatesListView extends TableView {


  static defaultProps = {
    ...TableView.defaultProps,
    title: "Чат-комнаты",
  };


  getColumns() {

    const {
      TemplateLink,
      UserLink,
      Grid,
    } = this.context;

    // console.log("TemplateLink", TemplateLink);
    // console.log("UserLink", UserLink);

    // return [];

    return [
      // {
      //   id: "id",
      // },
      {
        id: "isPublic",
        label: "",
        renderer: (value, record) => {

          return <PublicIcon
            color={value === true ? "primary" : "disabled"}
          />;
        },
      },
      {
        id: "name",
        label: "Название шаблона",
        renderer: (value, record) => {

          return record ? <TemplateLink
            object={record}
          /> : null;
        },
      },
      {
        id: "CreatedBy",
        label: "Владелец",
        renderer: (value) => {

          return value ? <UserLink
            user={value}
          /> : null;
        },
      },
      {
        id: "props",
        label: "Свойства",
        renderer: (value) => {

          return value ? <div
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(value, true, 2)}
          </div> : null;
        },
      },
      {
        id: "components",
        label: "Компоненты",
        renderer: (value) => {

          return value ? <div
            style={{
              whiteSpace: "pre-wrap",
            }}
          >
            {JSON.stringify(value, true, 2)}
          </div> : null;
        },
      },
    ]

  }

}


export {
  styles,
}

export default withStyles(styles)(props => <TemplatesListView
  {...props}
/>);