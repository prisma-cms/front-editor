import React, { Component } from 'react';
import PropTypes from 'prop-types';


import { graphql } from 'react-apollo';
import gql from 'graphql-tag';


import View from "./View";

import Page from "../layout";

import FrontEditor from "../../../../App";

class TemplatesPage extends Page {


  static propTypes = {
    View: PropTypes.func.isRequired,
  };

  static defaultProps = {
    View,
    first: 2,
  }


  componentWillMount() {

    const {
      query: {
        templatesConnection,
      },
    } = this.context;

    const {
      View,
    } = this.props;

    this.Renderer = graphql(gql(templatesConnection))(View);

    super.componentWillMount && super.componentWillMount();
  }



  setFilters(filters) {

    const {
      uri,
      router: {
        history,
      },
    } = this.context;

    const filtersname = "templates-filters";

    let newUri = uri.clone();



    try {

      filters = filters ? JSON.stringify(filters) : undefined;
    }
    catch (error) {
      console.error(error);
    }

    if (filters === "{}") {
      filters = null;
    }



    if (filters) {

      if (newUri.hasQuery) {
        newUri = newUri.setQuery({
          [filtersname]: filters,
        });
      }
      else {
        newUri = newUri.addQuery({
          [filtersname]: filters,
        });
      }

    }
    else {

      newUri.removeQuery(filtersname);

    }

    newUri.removeQuery("page");


    const url = newUri.resource();


    history.push(url);

  }



  getFilters() {

    const filtersname = "templates-filters";

    const {
      uri,
    } = this.context;


    let {
      // [pagevariable]: page,
      [filtersname]: filters,
    } = uri.query(true);

    try {



      filters = filters && JSON.parse(filters) || null;

      if (filters === "{}") {
        filters = undefined;
      }
    }
    catch (error) {
      console.error(console.error(error));
    }



    return filters;
  }


  render() {

    const {
      Renderer,
    } = this;

    const {
      View,
      // where,
      first,
      ...other
    } = this.props;

    const {
      uri,
    } = this.context;

    const where = this.getFilters();

    // console.log("Page", this);

    let {
      templates_page: page,
    } = uri.query(true);

    // console.log("Page page", page);

    page = parseInt(page) || 0;

    const skip = page ? (page - 1) * first : 0;

    return <Renderer
      first={first}
      skip={skip}
      where={{
        ...where,
      }}
      addObject={() => {
        const {
          router: {
            history,
          },
        } = this.context;
        history.push("/templates/create");
      }}
      {...other}
    />
  }


  // render() {

  //   const {
  //     Renderer,
  //   } = this;

  //   const {
  //     View,
  //     where,
  //     ...other
  //   } = this.props;


  //   return <FrontEditor
  //     inEditMode={false}
  //     data={{
  //       object: {
  //         name: "Page",
  //         component: "Page",
  //         props: {},
  //         components: [
  //           {
  //             "name": "Connector",
  //             "props": {
  //               "first": 10,
  //               "filtersname": "filters",
  //               "orderBy": null,
  //               "query": "templatesConnection"
  //             },
  //             "components": [
  //               {
  //                 "name": "Grid",
  //                 "component": "Grid",
  //                 "props": {
  //                   "container": true,
  //                   "spacing": 8
  //                 },
  //                 "components": [
  //                   {
  //                     "name": "Grid",
  //                     "component": "Grid",
  //                     "props": {
  //                       "item": true,
  //                       "xs": 12
  //                     },
  //                     "components": [
  //                       {
  //                         "name": "Filters",
  //                         "component": "Filters",
  //                         "props": {},
  //                         "components": []
  //                       }
  //                     ]
  //                   },
  //                   {
  //                     "name": "Grid",
  //                     "component": "Grid",
  //                     "props": {
  //                       "item": true,
  //                       "xs": 12
  //                     },
  //                     "components": [
  //                       {
  //                         "name": "ListView",
  //                         "component": "ListView",
  //                         "props": {},
  //                         "components": [
  //                           {
  //                             "name": "Grid",
  //                             "component": "Grid",
  //                             "props": {
  //                               "item": true,
  //                               "xs": 12
  //                             },
  //                             "components": [
  //                               {
  //                                 "name": "Grid",
  //                                 "props": {
  //                                   "container": true,
  //                                   "spacing": 0,
  //                                   "alignItems": "flex-end"
  //                                 },
  //                                 "components": [
  //                                   {
  //                                     "name": "Grid",
  //                                     "props": {
  //                                       "spacing": 0,
  //                                       "xs": true,
  //                                       "item": true
  //                                     },
  //                                     "components": [
  //                                       {
  //                                         "name": "Link",
  //                                         "props": {
  //                                           "to": "/templates/:id"
  //                                         },
  //                                         "components": [
  //                                           {
  //                                             "name": "NamedField",
  //                                             "props": {
  //                                               "name": "name"
  //                                             },
  //                                             "components": [],
  //                                             "component": "NamedField"
  //                                           },
  //                                           {
  //                                             "name": "Tag",
  //                                             "props": {
  //                                               "tag": "span"
  //                                             },
  //                                             "components": [
  //                                               {
  //                                                 "name": "Tag",
  //                                                 "component": "Tag",
  //                                                 "props": {
  //                                                   "text": "/"
  //                                                 },
  //                                                 "components": []
  //                                               }
  //                                             ],
  //                                             "component": "Tag"
  //                                           },
  //                                           {
  //                                             "name": "NamedField",
  //                                             "props": {
  //                                               "name": "component"
  //                                             },
  //                                             "components": [],
  //                                             "component": "NamedField"
  //                                           }
  //                                         ],
  //                                         "component": "Link"
  //                                       }
  //                                     ],
  //                                     "component": "Grid"
  //                                   },
  //                                   {
  //                                     "name": "Grid",
  //                                     "props": {
  //                                       "spacing": 0,
  //                                       "item": true
  //                                     },
  //                                     "components": [
  //                                       {
  //                                         "name": "CreatedBy",
  //                                         "props": {},
  //                                         "components": [],
  //                                         "component": "CreatedBy"
  //                                       }
  //                                     ],
  //                                     "component": "Grid"
  //                                   },
  //                                   {
  //                                     "name": "Grid",
  //                                     "props": {
  //                                       "spacing": 0,
  //                                       "xs": 12,
  //                                       "item": true
  //                                     },
  //                                     "components": [
  //                                       {
  //                                         "name": "NamedField",
  //                                         "props": {
  //                                           "name": "description"
  //                                         },
  //                                         "components": [],
  //                                         "component": "NamedField"
  //                                       }
  //                                     ],
  //                                     "component": "Grid"
  //                                   },
  //                                   {
  //                                     "name": "Grid",
  //                                     "props": {
  //                                       "spacing": 0,
  //                                       "xs": 12,
  //                                       "item": true
  //                                     },
  //                                     "components": [
  //                                       {
  //                                         "name": "NamedField",
  //                                         "props": {},
  //                                         "components": [],
  //                                         "component": "NamedField"
  //                                       }
  //                                     ],
  //                                     "component": "Grid"
  //                                   }
  //                                 ],
  //                                 "component": "Grid"
  //                               }
  //                             ]
  //                           }
  //                         ]
  //                       }
  //                     ]
  //                   },
  //                   {
  //                     "name": "Grid",
  //                     "component": "Grid",
  //                     "props": {
  //                       "item": true,
  //                       "xs": 12
  //                     },
  //                     "components": [
  //                       {
  //                         "name": "Pagination",
  //                         "component": "Pagination",
  //                         "props": {},
  //                         "components": []
  //                       }
  //                     ]
  //                   }
  //                 ]
  //               }
  //             ],
  //             "component": "Connector"
  //           },
  //         ],
  //       },
  //     }}
  //   />
  // }
}


export default TemplatesPage; 