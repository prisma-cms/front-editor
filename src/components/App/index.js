import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

import Context from "@prisma-cms/context";

import Page from './components/public/Page';
import Grid from './components/public/Grid';
// import TextArea from './components/public/TextArea';
import UsersGrid from './components/public/UsersGrid';
import Connector from './components/public/Connectors/Connector';
import ObjectConnector from './components/public/Connectors/ObjectConnector';
import ListView from './components/public/Connectors/Connector/ListView';
import ObjectView from './components/public/Connectors/ObjectConnector/ObjectView';
import Pagination from './components/public/Connectors/Connector/Pagination';
import UserLink from './components/public/Connectors/Connector/UserLink';
import Filters from './components/public/Connectors/Connector/Filters';
import CreatedBy from './components/public/Connectors/Connector/Fields/CreatedBy';
import NamedField from './components/public/Connectors/Connector/Fields/NamedField';
import Content from './components/public/Connectors/Connector/Fields/Content';
import Section from './components/public/Section';
import Typography from './components/public/Typography';
import Switch from './components/public/Router/Switch';
import Route from './components/public/Router/Route';
import PageHeader from './components/public/PageHeader';
// import ParralaxTest from './components/public/Parallax/Test';
import RoutedObject from './components/public/Router/RoutedObject';
import Link from './components/public/Link';
import { EditorContext } from './context';
import DraftEditor from './components/public/DraftEditor';

const styles = theme => {



  const {
    breakpoints,
  } = theme;

  const desktop = breakpoints.up("sm");

  const dragOveredBorderColor = "#15e408";
  const hoveredBorderColor = "#7509da";
  const activeBorderColor = "#b806bb";
  const dirtyBorderColor = "red";

  const itemsPanelWidth = 290;

  return {

    root: {
      [desktop]: {
        flex: 1,
        display: "flex",
        flexDirection: "row-reverse",
      },

      "&.fullheight": {
        height: "100vh",
      },
    },
    editor: {

      position: "relative",

      [desktop]: {
        flex: 1,
        overflow: "auto",
        height: "100%",
      },

    },
    panel: {

      [desktop]: {
        width: itemsPanelWidth,
        height: "100%",
        // overflow: "auto",
        position: "relative",
      },
    },
    panelItems: {

      [desktop]: {
        height: "100vh",
        width: itemsPanelWidth,
        position: "fixed",
        overflow: "auto",
      },
    },
    toolbar: {
      // border: "1px solid blue",
    },
    panelItem: {
      cursor: "grab",
      padding: 10,
      border: "1px solid #ddd",
      "&:hover": {
        border: `1px solid ${hoveredBorderColor}`,
      },
      "&.active": {
        border: `1px solid ${activeBorderColor}`,
      },
      "&.hovered": {
        border: `1px solid ${hoveredBorderColor}`,
      },
      "&.dragOvered": {
        border: `1px solid ${dragOveredBorderColor}`,
      },
    },
    item: {


    },
    // inEditMode
    itemEditable: {
      minHeight: "30px",
      border: "1px dotted #ddd",
      padding: 7,

      "&.dirty": {
        border: `1px solid ${dirtyBorderColor}`,
      },
      "&.active": {
        border: `1px solid ${activeBorderColor}`,
      },
      "&.dragOvered": {
        border: `1px solid ${dragOveredBorderColor}`,
      },
      "&.hovered": {
        border: `1px solid ${hoveredBorderColor}`,
      },
    },
    panelButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    bordered: {
      border: "1px solid #ddd",
    },
  }
}

class FrontEditor extends Component {

  static contextType = Context;

  static propTypes = {
    debug: PropTypes.bool.isRequired,
    classes: PropTypes.object.isRequired,
    // onDrop: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    components: PropTypes.array,
    Components: PropTypes.arrayOf(PropTypes.func).isRequired,
    CustomComponents: PropTypes.arrayOf(PropTypes.func).isRequired,
    toolbar: PropTypes.oneOf([PropTypes.string, PropTypes.func]),
    className: PropTypes.string,
  };

  static defaultProps = {
    debug: false,
    Components: [
      Grid,
      Typography,
      // TextArea,
      UsersGrid,
      Connector,
      ObjectConnector,
      ListView,
      ObjectView,
      Pagination,
      NamedField,
      UserLink,
      Filters,
      CreatedBy,
      Content,
      Link,
      Section,
      PageHeader,
      Switch,
      Route,
      RoutedObject,
      // ParralaxTest,
      DraftEditor,
    ],
    CustomComponents: [],
    className: "fullheight",
  }


  constructor(props) {

    super(props);

    this.state = {

      /**
       * Элемент в панели управления, который может быть перетянут на страницу
       */
      dragItem: null,

      /**
       * Текущий элемент на странице, в который может быть заброшен новый элемент
       */
      dragTarget: null,

      /**
       * Текущий элемент на странице, свойства которого можно редактировать (выбирается по клику)
       */
      activeItem: null,

      /**
       * Элемент, на который наведена мышь
       */
      hoveredItem: null,

      Components: this.prepareComponents(),
    }

  }


  prepareComponents() {

    const {
      Components,
      CustomComponents,
    } = this.props;


    let baseComponents = [Page].concat(Components)
      .filter(n => n && !CustomComponents.find(i => i.Name === n.Name));


    return baseComponents.concat(CustomComponents).filter(n => n && n.Name);
  }

  // prepareComponents() {

  //   const {
  //     Components,
  //     CustomComponents,
  //   } = this.props;



  //   // var cache = {};

  //   let modules = [];

  //   function importAll(r) {
  //     r.keys().forEach(key => {

  //       // cache[key] = r(key)



  //       modules.push(r(key).default);
  //     });
  //   }

  //   importAll(require.context('./components/public/', true, /\.js$/));




  //   return modules.filter(n => n).filter(n => n.Name);
  // }


  renderPanels() {

    const {
      Grid,
    } = this.context;

    const {
      classes,
      // Components,
    } = this.props;

    const Components = this.getComponents();

    // const {
    //   activeItem,
    // } = this.state;


    /**
     * Если выбран активный элемент, выводим настройки для него
     */

    // let settingsView;

    // if (activeItem) {


    //   const Element = activeItem.constructor;


    //   settingsView = <div>
    //     <Element
    //       mode="settings"
    //     />
    //   </div>

    // }

    return <div
      className={classes.panelItems}
    >
      <Grid
        container
        spacing={8}
      >

        {Components.map(Component => {

          const name = Component.Name;

          return <Component
            key={name}
            mode="panel"
            className={classes.panelItem}
          />
        })}

        <Grid
          item
          xs={12}
        >
          {/* 
            Сюда будут выводиться настройки активного компонента
           */}
          <div
            ref={el => {
              this.settingsViewContainer = el;
            }}
          >
          </div>

          {/* {settingsView} */}
        </Grid>

      </Grid>
    </div>

  }


  renderItems() {


    const {
      staticContext,
      inEditMode,
      debug,
      // object,
      components,
      data,
      // _dirty,
      // onSave,
      setPageMeta,
      Components,
      CustomComponents,
      ...other
    } = this.props;

    const {
      name,
    } = data.object || {};

    if (!name) {
      return null;
    }

    const RenderComponents = this.getComponents();



    // const Page = Components.find(n => n.Name === "Page");
    const Component = RenderComponents.find(n => n.Name === name);





    if (!Component) {
      return null;
    }

    return <Component
      mode="main"
      // data={{
      //   object,
      // }}
      data={data}
      // _dirty={_dirty}
      // onSave={onSave}
      {...other}
    />;

    // return <Page
    //   mode="main"
    //   data={{
    //     object: {},
    //   }}
    //   _dirty={{
    //     name: "Page",
    //     props: {},
    //     components: [
    //       {
    //         "name": "Grid",
    //         "props": {
    //           "container": true
    //         },
    //         "components": [
    //           {
    //             "name": "Grid",
    //             "props": {
    //               "item": true,
    //               xs: 12,
    //               sm: 6,
    //             },
    //             "components": [

    //             ]
    //           },
    //           {
    //             "name": "Grid",
    //             "props": {
    //               "item": true,
    //               xs: 12,
    //               sm: 6,
    //             },
    //             "components": [
    //               {
    //                 name: "Typography",
    //                 props: {
    //                   text: "SDfdsf gerg ergergergerger",
    //                 },
    //                 components: [],
    //               },
    //             ]
    //           },

    //         ]
    //       },

    //     ],
    //   }}
    // />;

    let output = [];


    if (components && Array.isArray(components)) {

      components.map((n, index) => {

        const {
          name,
          props,
          children,
          ...other
        } = n;

        let Component = Components.find(n => n.Name === name);


        if (Component) {

          output.push(<Component
            key={index}
            mode="main"
            {...other}
          />);

        }



      })



    }


    return output;

  }


  updateObject(data) {


    const {
      components,
    } = data;

    const {
      onChange,
    } = this.props;

    if (onChange && components !== undefined) {

      return onChange(components);

    }

  }


  getComponents() {

    const {
      Components,
    } = this.state;

    return Components;

  }


  renderToolbar() {

    const {
      toolbar,
    } = this.props;

    return toolbar ? toolbar : null;
  }


  render() {

    const {
      classes,
      children,
      components,
      updateObject,
      // Components,
      inEditMode,
      debug,
      className,
    } = this.props;

    const {
      dragItem,
      dragTarget,
      activeItem,
      hoveredItem,
    } = this.state;

    const {
      settingsViewContainer,
    } = this;

    const Components = this.getComponents();

    let items = this.renderItems();


    // console.log("FrontEditor props", { ...this.props });

    return (
      <EditorContext.Provider
        value={{
          inEditMode,
          classes,
          components,
          updateObject: data => this.updateObject(data),
          dragItem,
          dragTarget,
          activeItem,
          hoveredItem,
          settingsViewContainer,
          onDragStart: item => {

            this.setState({
              dragItem: item,
            });

          },
          onDragEnd: item => {

            this.setState({
              dragItem: null,
              dragTarget: null,
              activeItem: null,
              hoveredItem: null,
            });
          },
          setDragTarget: component => {
            this.setState({
              dragTarget: component,
            });
          },
          setActiveItem: component => {

            this.setState({
              activeItem: component,
            });
          },
          setHoveredItem: component => {
            this.setState({
              hoveredItem: component,
            });
          },
          Components,
          forceUpdate: () => {

            this.forceUpdate()

          },
        }}
      >
        {inEditMode
          ? <Fragment>
            <div
              className={[classes.toolbar, classes.bordered].join(" ")}
            >
              {this.renderToolbar()}
            </div>
            <div
              className={[classes.root, className].join(" ")}
            >
              <div
                className={[classes.panel, classes.bordered].join(" ")}
              >
                {this.renderPanels()}
              </div>
              <div
                className={[classes.editor, classes.bordered].join(" ")}
              >
                {items}

                {/* {children} */}

                {/* {debug && components ? <div
                    style={{
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {JSON.stringify(components, true, 2)}
                  </div> : null} */}

              </div>
            </div>
          </Fragment>
          : items
        }
      </EditorContext.Provider>
    );

    // return (
    //   <Context.Consumer>
    //     {context => <Context.Provider
    //       value={Object.assign(context, {
    //         inEditMode,
    //         classes,
    //         components,
    //         updateObject: data => this.updateObject(data),
    //         dragItem,
    //         dragTarget,
    //         activeItem,
    //         hoveredItem,
    //         onDragStart: item => {

    //           this.setState({
    //             dragItem: item,
    //           });

    //         },
    //         onDragEnd: item => {

    //           this.setState({
    //             dragItem: null,
    //             dragTarget: null,
    //             activeItem: null,
    //             hoveredItem: null,
    //           });
    //         },
    //         setDragTarget: component => {
    //           this.setState({
    //             dragTarget: component,
    //           });
    //         },
    //         setActiveItem: component => {



    //           this.setState({
    //             activeItem: component,
    //           });
    //         },
    //         setHoveredItem: component => {
    //           this.setState({
    //             hoveredItem: component,
    //           });
    //         },
    //         Components,
    //         forceUpdate: () => {



    //           this.forceUpdate()

    //         },
    //       })}
    //     >
    //       {inEditMode
    //         ? <Fragment>
    //           <div
    //             className={[classes.toolbar, classes.bordered].join(" ")}
    //           >
    //             {this.renderToolbar()}
    //           </div>
    //           <div
    //             className={[classes.root, className].join(" ")}
    //           >
    //             <div
    //               className={[classes.panel, classes.bordered].join(" ")}
    //             >
    //               {this.renderPanels()}
    //             </div>
    //             <div
    //               className={[classes.editor, classes.bordered].join(" ")}
    //             >
    //               {items}

    //               {/* {children} */}

    //               {/* {debug && components ? <div
    //                 style={{
    //                   whiteSpace: "pre-wrap",
    //                 }}
    //               >
    //                 {JSON.stringify(components, true, 2)}
    //               </div> : null} */}

    //             </div>
    //           </div>
    //         </Fragment>
    //         : items
    //       }
    //     </Context.Provider>}
    //   </Context.Consumer>
    // );
  }
}


export default withStyles(styles)(props => <FrontEditor
  {...props}
/>);



// var cache = {};

// function importAll (r) {
//   r.keys().forEach(key => cache[key] = r(key));
// }

// importAll(require.context('./components/', true, /\.js$/));




