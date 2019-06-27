import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import PrismaCmsComponent from "@prisma-cms/component";
import RootConnector from '../../Root';



class DevRoot extends PrismaCmsComponent {

  render() {

    return <RootConnector
      inEditMode={false}
      {...this.props}
      // _dirty={{
      //   components: [
      //     {
      //       name: "Tag",
      //       props: {
      //         tag: "div",
      //       },
      //       components: [
      //       ],
      //     }
      //   ]
      // }}
      // _dirty={{
      //   components: [
      //     {
      //       name: "Tag",
      //       props: {
      //         tag: "div",
      //       },
      //       components: [
      //         {
      //           "name": "Tag",
      //           "props": {
      //             "text": "rte"
      //           },
      //           "components": []
      //         },
      //         {
      //           "name": "Tag",
      //           "props": {
      //             "tag": "b"
      //           },
      //           "components": [
      //             {
      //               "name": "Tag",
      //               "props": {
      //                 "text": "rt"
      //               },
      //               "components": []
      //             },
      //             {
      //               "name": "Tag",
      //               "props": {
      //                 "tag": "i"
      //               },
      //               "components": [
      //                 {
      //                   "name": "Tag",
      //                   "props": {
      //                     "text": "ert"
      //                   },
      //                   "components": []
      //                 }
      //               ]
      //             },
      //             {
      //               "name": "Tag",
      //               "props": {
      //                 "text": "e"
      //               },
      //               "components": []
      //             }
      //           ]
      //         },
      //         {
      //           "name": "Tag",
      //           "props": {
      //             "text": "rtert"
      //           },
      //           "components": []
      //         }
      //       ],
      //     }
      //   ]
      // }}
    // _dirty={{
    //   components: [
    //     {
    //       name: "Tag",
    //       props: {
    //         tag: "div",
    //       },
    //       components: [
    //         {
    //           name: "Tag",
    //           props: {
    //             tag: "",
    //             text: "DSfsdf ewr234",
    //           },
    //         },
    //         {
    //           name: "Tag",
    //           props: {
    //             tag: "b",
    //             text: "Bold text",
    //           },
    //           components: [
    //             {
    //               name: "Tag",
    //               props: {
    //                 text: "DSfsdf ewr234",
    //               },
    //               components: [

    //               ],
    //             },
    //             {
    //               name: "Tag",
    //               props: {
    //                 tag: "span",
    //               },
    //               components: [
    //                 {
    //                   name: "Tag",
    //                   props: {
    //                     tag: "",
    //                     text: "DSfsdf ewr234",
    //                   },
    //                   components: [

    //                   ],
    //                 },

    //               ],
    //             },
    //           ],
    //         },
    //       ],
    //     }
    //   ]
    // }}
    />
  }

}

export default DevRoot;