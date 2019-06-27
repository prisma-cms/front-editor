import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';


import withStyles from 'material-ui/styles/withStyles';

import PrismaCmsComponent from "@prisma-cms/component";

import TemplateView from '../Template/View';


import PrismaCmsFilters from "@prisma-cms/filters";

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




    const {
      data: {
        objectsConnection,
        variables: {
          first,
        },
      },
      classes,
      getFilters,
      setFilters,
    } = this.props;

    const templates = objectsConnection ? objectsConnection.edges.map(({ node }) => node) : []
    const total = objectsConnection ? objectsConnection.aggregate.count : 0


    const pageVariable = "templates_page";

    const filters = getFilters();


    const {
      [pageVariable]: page = 1,
    } = uri.query(true);

    return super.render(<Fragment>

      <Grid
        container
        spacing={16}
      >
        <Grid
          item
          xs={12}
        >
          <PrismaCmsFilters
            queryName={"templates"}
            filters={filters || {}}
            setFilters={setFilters}
          />
        </Grid>

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
              edit_button_styles={{
                position: "absolute",
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