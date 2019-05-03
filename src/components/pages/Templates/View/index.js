import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';


import { withStyles } from 'material-ui/styles';

import PrismaCmsComponent from "@prisma-cms/component";
import { Paper } from 'material-ui';
import { Typography } from 'material-ui';

// import FrontEditor from "../../../App";
import TemplateView from '../Template/View';

const styles = theme => {

  return {
  }
}


export class TemplatesListView extends PrismaCmsComponent {




  // getColumns() {

  //   const {
  //     TemplateLink,
  //     UserLink,
  //     Grid,
  //   } = this.context;




  //   // return [];

  //   return [
  //     // {
  //     //   id: "id",
  //     // },
  //     // {
  //     //   id: "isPublic",
  //     //   label: "",
  //     //   renderer: (value, record) => {

  //     //     return <PublicIcon
  //     //       color={value === true ? "primary" : "disabled"}
  //     //     />;
  //     //   },
  //     // },
  //     {
  //       id: "name",
  //       label: "Название шаблона",
  //       renderer: (value, record) => {

  //         return record ? <TemplateLink
  //           object={record}
  //         /> : null;
  //       },
  //     },
  //     {
  //       id: "CreatedBy",
  //       label: "Владелец",
  //       renderer: (value) => {

  //         return value ? <UserLink
  //           user={value}
  //         /> : null;
  //       },
  //     },
  //     {
  //       id: "props",
  //       label: "Свойства",
  //       renderer: (value) => {

  //         return value ? <div
  //           style={{
  //             whiteSpace: "pre-wrap",
  //           }}
  //         >
  //           {JSON.stringify(value, true, 2)}
  //         </div> : null;
  //       },
  //     },
  //     {
  //       id: "components",
  //       label: "Компоненты",
  //       renderer: (value) => {

  //         return value ? <div
  //           style={{
  //             whiteSpace: "pre-wrap",
  //           }}
  //         >
  //           {JSON.stringify(value, true, 2)}
  //         </div> : null;
  //       },
  //     },
  //   ]

  // }


  render() {

    const {
      Grid,
      // TemplateLink,
      // UserLink,
      Pagination,
      uri,
    } = this.context;

    // console.log("TemplatesListView", this);
    // console.log("TemplatesListView props", { ...this.props });

    const {
      data: {
        objectsConnection,
        variables: {
          first,
        },
      },
      classes,
    } = this.props;

    const templates = objectsConnection ? objectsConnection.edges.map(({ node }) => node) : []
    const total = objectsConnection ? objectsConnection.aggregate.count : 0


    const pageVariable = "templates_page";


    const {
      [pageVariable]: page = 1,
    } = uri.query(true);

    return super.render(<Fragment>

      <Grid
        container
        spacing={16}
      >
        {templates.map(n => {

          const {
            id,
          } = n;

          return <Grid
            key={id}
            item
            xs={12}
            xl={6}
          >
            <TemplateView
              data={{
                object: n,
              }}
            />
          </Grid>

        })}
      </Grid>

      <Pagination
        pageVariable={pageVariable}
        limit={first}
        total={total}
        page={page || 1}
      />

    </Fragment>);
  }

}



export default withStyles(styles)(props => <TemplatesListView
  {...props}
/>);