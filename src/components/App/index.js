import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

import Context from "@prisma-cms/context";

// import Page from './components/Page';
// import Grid from './components/Grid';
// import TextArea from './components/TextArea';
// import UsersGrid from './components/UsersGrid';
// import Connector from './components/Connector';
// import ListView from './components/Connector/ListView';
// import Pagination from './components/Connector/Pagination';
// import UserLink from './components/Connector/UserLink';
// import Filters from './components/Connector/Filters';
// import CreatedBy from './components/Connector/Fields/CreatedBy';
// import NamedField from './components/Connector/Fields/NamedField';
// import Content from './components/Connector/Fields/Content';
// import Section from './components/Section';
// import Typography from './components/Typography';

const styles = theme => {

  // console.log("theme", theme);

  const {
    breakpoints,
  } = theme;

  const desktop = breakpoints.up("sm");

  const dragOveredBorderColor = "red";
  const hoveredBorderColor = "#7509da";
  const activeBorderColor = "#b806bb";
  const dirtyBorderColor = "red";

  return {

    root: {
      [desktop]: {
        flex: 1,
        display: "flex",
        flexDirection: "row-reverse",
      },
    },
    editor: {

      [desktop]: {
        flex: 1,
        overflow: "auto",
        height: "100%",
      },

    },
    panel: {

      [desktop]: {
        width: 270,
        height: "100%",
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

      "&.active": {
        border: `1px solid ${activeBorderColor}`,
      },
      "&.dragOvered": {
        border: `1px solid ${dragOveredBorderColor}`,
      },
      "&.hovered": {
        border: `1px solid ${hoveredBorderColor}`,
      },
      "&.dirty": {
        border: `1px solid ${dirtyBorderColor}`,
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
  };

  static defaultProps = {
    debug: false,
    Components: [
      // Grid,
      // Typography,
      // TextArea,
      // UsersGrid,
      // Connector,
      // ListView,
      // Pagination,
      // NamedField,
      // UserLink,
      // Filters,
      // CreatedBy,
      // Content,
      // Section,
    ],
    CustomComponents: [],
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


  // prepareComponents() {

  //   const {
  //     Components,
  //     CustomComponents,
  //   } = this.props;

  //   // Components.map(n => {

  //   //   console.log("Components name", n.name, n.Name);

  //   // });

  //   // CustomComponents.map(n => {

  //   //   console.log("CustomComponents name", n.name, n.Name);

  //   // });


  //   let baseComponents = [Page].concat(Components)
  //     .filter(n => n && !CustomComponents.find(i => i.Name === n.Name));

  //   // console.log("baseComponents", baseComponents);

  //   // baseComponents.map(n => {

  //   //   console.log("name", n.name, n.Name, n.constructor.Name);

  //   // });

  //   return baseComponents.concat(CustomComponents).filter(n => n && n.Name);
  // }

  prepareComponents() {

    const {
      Components,
      CustomComponents,
    } = this.props;



    // var cache = {};

    let modules = [];

    function importAll(r) {
      r.keys().forEach(key => {

        // cache[key] = r(key)

        // console.log("module", key, r(key));

        modules.push(r(key).default);
      });
    }

    importAll(require.context('./components/public/', true, /\.js$/));


    // console.log("modules", modules);

    return modules.filter(n => n).filter(n => n.Name);
  }


  renderPanels() {

    const {
      Grid,
    } = this.context;

    const {
      classes,
      // Components,
    } = this.props;

    const Components = this.getComponents();

    const {
      activeItem,
    } = this.state;


    /**
     * Если выбран активный элемент, выводим настройки для него
     */

    let settingsView;

    if (activeItem) {


      const Element = activeItem.constructor;


      settingsView = <div>
        <Element
          mode="settings"
        />
      </div>

    }

    return <Grid
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
        {settingsView}
      </Grid>

    </Grid>

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

    // console.log("FrontEditor.props", this.props);

    // const Page = Components.find(n => n.Name === "Page");
    const Component = RenderComponents.find(n => n.Name === name);

    // console.log("FrontEditor Component", Component);

    // console.log("FrontEditor._dirty", _dirty);

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

    // console.log("FrontEditor", this.props);

    const {
      classes,
      children,
      components,
      updateObject,
      // Components,
      inEditMode,
      debug,
    } = this.props;

    const {
      dragItem,
      dragTarget,
      activeItem,
      hoveredItem,
    } = this.state;

    const Components = this.getComponents();

    let items = this.renderItems();

    return (
      <Context.Consumer>
        {context => <Context.Provider
          value={Object.assign(context, {
            inEditMode,
            classes,
            components,
            updateObject: data => this.updateObject(data),
            dragItem,
            dragTarget,
            activeItem,
            hoveredItem,
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

              console.log("setActiveItem", component);

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

              // console.log("FrontEditor forceUpdate", this);

              this.forceUpdate()

            },
          })}
        >
          {inEditMode
            ? <Fragment>
              <div
                className={[classes.toolbar, classes.bordered].join(" ")}
              >
                {this.renderToolbar()}
              </div>
              <div
                className={classes.root}
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
        </Context.Provider>}
      </Context.Consumer>
    );
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


// console.log("cache", cache);

