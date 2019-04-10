import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import EditableView from "apollo-cms/lib/DataView/Object/Editable";

// import { withStyles, IconButton } from 'material-ui';

import FrontEditor from "../../../../../../App";

// export const styles = theme => {

//   return {
//     root: {
//       // border: "1px solid blue",
//       height: "100%",
//       display: "flex",
//       flexDirection: "column",
//     },
//     // membersShortList: {
//     //   alignItems: "start",
//     //   display: "inline-flex",

//     //   "& > *": {
//     //     margin: 2,
//     //   },
//     // },
//     editor: {
//       flex: 1,
//       display: "flex",
//       flexDirection: "column",
//     },
//     // messages: {
//     //   overflow: "hidden",
//     //   // border: "1px solid yellow",
//     //   flex: 1,
//     // },
//     // editor: {
//     //   // border: "1px solid red",
//     // },
//   }
// }



// export class TemplateView__ extends EditableView {


//   constructor(props) {

//     super(props);

//     this.updateObject = this.updateObject.bind(this);
//     // this.updateComponentProperty = this.updateComponentProperty.bind(this);
//     // this.onChangeProps = this.onChangeProps.bind(this);
//     // this.updateProps = this.updateProps.bind(this);

//   }


//   canEdit() {

//     const {
//       id,
//       CreatedBy,
//     } = this.getObjectWithMutations() || {}


//     const {
//       id: createdById,
//     } = CreatedBy || {};

//     const {
//       id: currentUserId,
//     } = this.getCurrentUser() || {};

//     return !id || (currentUserId && currentUserId === createdById) ? true : false;
//   }


//   renderDefaultView() {

//     const {
//       Grid,
//     } = this.context;

//     const {
//       classes,
//       ...other
//     } = this.props;

//     // const object = this.getObjectWithMutations();
//     // const canEdit = this.canEdit();
//     // const inEditMode = this.isInEditMode();

//     return <div
//       className={classes.editor}
//     >
//       <FrontEditor
//         inEditMode={true}
//         // object={object}
//         {...other}
//       />
//     </div>;

//   }

//   renderEditableView() {

//     return this.renderDefaultView();
//   }

//   render() {

//     const {
//       classes,
//     } = this.props;

//     return <div
//       className={classes.root}
//     >
//       {super.render()}
//     </div>
//   }

// }


export class TemplateView extends Component {


  render() {

    const {
      classes,
      ...other
    } = this.props;


    // const object = {
    //   "name": "Connector",
    //   "props": {
    //     "orderBy": null,
    //     "skip": null,
    //     "first": 12,
    //     "last": null,
    //     // "query": "templatesConnection"
    //     "query": "usersConnection",
    //     where: {
    //     },
    //   },
    //   "components": [
    //     {
    //       "name": "Grid",
    //       "props": {
    //         "container": true,
    //         "spacing": 8
    //       },
    //       "components": [
    //         {
    //           "name": "Grid",
    //           "props": {
    //             "item": true,
    //             "xs": 12
    //           },
    //           "components": [
    //             {
    //               "name": "Filters",
    //               "props": {},
    //               "components": []
    //             }
    //           ]
    //         },
    //         {
    //           "name": "Grid",
    //           "props": {
    //             "item": true,
    //             "xs": 12
    //           },
    //           "components": [
    //             {
    //               "name": "ListView",
    //               "components": [
    //                 {
    //                   "name": "Grid",
    //                   "props": {
    //                     "item": true,
    //                     "xs": 12,
    //                     "md": 6,
    //                     "xl": 3
    //                   },
    //                   "components": [
    //                     {
    //                       name: "UserLink",
    //                     }
    //                   ]
    //                 }
    //               ]
    //             }
    //           ]
    //         },
    //         {
    //           "name": "Grid",
    //           "props": {
    //             "item": true,
    //             "xs": 12
    //           },
    //           "components": [
    //             {
    //               "name": "Pagination"
    //             }
    //           ]
    //         }
    //       ]
    //     }
    //   ],
    //   // "first": 12
    // }

    // return <FrontEditor
    //   // {...other}
    //   inEditMode={true}
    //   data={{
    //     object,
    //   }}
    // />

    
    const inEditMode = true;

    return <FrontEditor
      inEditMode={inEditMode}
      {...other}
    />
  }
}

export default TemplateView;

// export default withStyles(styles)(props => <TemplateView
//   {...props}
// />);