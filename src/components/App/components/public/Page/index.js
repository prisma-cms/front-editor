import React from 'react';

import EditorComponent from '../..';


class Page extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    // deletable: false,
  }


  static Name = "Page"

  // constructor(props) {

  //   super(props);

  //   this.name = "Page";
  //   this.Name = "Page";

  // }

  canBeParent(parent) {

    return false;
  }


  renderPanelView() {

    return null;
  }

  renderAddButton() {

    return null;
  }


  // renderMainView() {


  //   return <div
  //     {...this.getRenderProps()}
  //   >
  //     {super.renderMainView()}
  //   </div>;
  // }


  // renderChildren() {

  //   let output = super.renderChildren();


  //   let footer;

  //   const {
  //     Grid,
  //   } = this.context;

  //   const {
  //     inEditMode,
  //   } = this.getEditorContext();


  //   if (inEditMode) {

  //     let buttons = this.getBlockButtons();

  //     footer = <div>

  //       <Grid
  //         container
  //         spacing={8}
  //         style={{
  //           justifyContent: "center",
  //         }}
  //       >
  //         {buttons.map((n, index) => {

  //           const {
  //             label,
  //             ...component
  //           } = n;

  //           return <Grid
  //             key={index}
  //             item
  //           >
  //             <Button
  //               variant="raised"
  //               size="small"
  //               onClick={event => {

  //                 event.preventDefault();
  //                 event.stopPropagation();

  //                 const {
  //                   activeItem,
  //                 } = this.getEditorContext();

  //                 if (activeItem) {
  //                   activeItem.addComponent(component);
  //                 }
  //                 else {
  //                   this.addComponent(component);
  //                 }

  //               }}
  //             >
  //               {label}
  //             </Button>
  //           </Grid>

  //         })}
  //       </Grid>

  //     </div>
  //   }

  //   return <Fragment>

  //     {output}

  //     {footer}
  //   </Fragment>
  // }


  // getBlockButtons() {

  //   let buttons = [];


  //   buttons.push({
  //     name: "Section",
  //     label: "Блок",
  //     components: [
  //       {
  //         name: "Section",
  //         components: [
  //         ],
  //         props: {
  //           style: {
  //             margin: "0 auto",
  //             maxWidth: "1260px",
  //           },
  //         },
  //       },
  //     ],
  //     props: {
  //     },
  //   });

  //   buttons.push({
  //     name: "Tag",
  //     label: "Таблица",
  //     props: {
  //       tag: "div",
  //     },
  //     components: [{
  //       name: "Tag",
  //       props: {
  //         tag: "table",
  //         style: {
  //           width: "100%",
  //         },
  //       },
  //       components: [
  //         {
  //           name: "Tag",
  //           props: {
  //             tag: "tbody",
  //           },
  //           components: [
  //             {
  //               name: "Tag",
  //               props: {
  //                 tag: "tr",
  //               },
  //               components: [
  //                 {
  //                   name: "Tag",
  //                   props: {
  //                     tag: "th",
  //                   },
  //                   components: [
  //                   ],
  //                 },
  //                 {
  //                   name: "Tag",
  //                   props: {
  //                     tag: "td",
  //                   },
  //                   components: [
  //                   ],
  //                 },
  //               ],
  //             },
  //             {
  //               name: "Tag",
  //               props: {
  //                 tag: "tr",
  //               },
  //               components: [
  //                 {
  //                   name: "Tag",
  //                   props: {
  //                     tag: "th",
  //                   },
  //                   components: [
  //                   ],
  //                 },
  //                 {
  //                   name: "Tag",
  //                   props: {
  //                     tag: "td",
  //                   },
  //                   components: [
  //                   ],
  //                 },
  //               ],
  //             },
  //             {
  //               name: "Tag",
  //               props: {
  //                 tag: "tr",
  //               },
  //               components: [
  //                 {
  //                   name: "Tag",
  //                   props: {
  //                     tag: "th",
  //                   },
  //                   components: [
  //                   ],
  //                 },
  //                 {
  //                   name: "Tag",
  //                   props: {
  //                     tag: "td",
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
  //     ],
  //   });


  //   buttons.push({
  //     name: "Section",
  //     label: "Средний текст",
  //     components: [
  //       {
  //         name: "Tag",
  //         components: [],
  //         props: {
  //           tag: "div",
  //           // text: "Some text",
  //         },
  //       },
  //     ],
  //     props: {
  //       style: {
  //         fontSize: 20,
  //       },
  //     },
  //   });


  //   buttons.push({
  //     name: "Section",
  //     label: "Крупный текст",
  //     components: [
  //       {
  //         name: "TextArea",
  //         components: [],
  //         props: {
  //           // text: "Some text",
  //         },
  //       },
  //     ],
  //     props: {
  //       style: {
  //         fontSize: 30,
  //       },
  //     },
  //   });


  //   buttons.push({
  //     "name": "Section",
  //     label: "Пользователи",
  //     "props": {},
  //     "components": [
  //       {
  //         "name": "Connector",
  //         "props": {
  //           "first": 12,
  //           "filtersname": "filters",
  //           query: "usersConnection",
  //         },
  //         "components": [
  //           {
  //             "name": "Grid",
  //             "props": {
  //               "container": true,
  //               "spacing": 8
  //             },
  //             "components": [
  //               {
  //                 "name": "Grid",
  //                 "props": {
  //                   "item": true,
  //                   "xs": 12
  //                 },
  //                 "components": [
  //                   {
  //                     "name": "Filters",
  //                     "components": []
  //                   }
  //                 ]
  //               },
  //               {
  //                 "name": "Grid",
  //                 "props": {
  //                   "item": true,
  //                   "xs": 12
  //                 },
  //                 "components": [
  //                   {
  //                     "name": "ListView",
  //                     "components": [
  //                       {
  //                         "name": "Grid",
  //                         "props": {
  //                           "item": true,
  //                           "xs": 12,
  //                           "md": 6,
  //                           "xl": 3
  //                         },
  //                         "components": [
  //                           {
  //                             "name": "UserLink",
  //                             "props": {},
  //                             "components": []
  //                           },
  //                           {
  //                             "name": "NamedField",
  //                             "props": {
  //                               name: "fullname",
  //                             },
  //                             "components": []
  //                           },
  //                         ]
  //                       }
  //                     ]
  //                   }
  //                 ]
  //               },
  //               {
  //                 "name": "Grid",
  //                 "props": {
  //                   "item": true,
  //                   "xs": 12
  //                 },
  //                 "components": [
  //                   {
  //                     "name": "Pagination"
  //                   }
  //                 ]
  //               }
  //             ]
  //           }
  //         ]
  //       }
  //     ]
  //   });


  //   return buttons;

  // }

}

export default Page;
