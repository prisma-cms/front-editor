import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui';

import CloseIcon from 'material-ui-icons/Close';

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
// import DraftEditor from './components/public/DraftEditor';
import TextArea from './components/public/TextArea';
import Tag from './components/public/Tag';
import { Button } from 'material-ui';
import { IconButton } from 'material-ui';

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
        // flexDirection: "row-reverse",
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
    templates: PropTypes.array,
  };

  static defaultProps = {
    debug: false,
    Components: [
      Grid,
      Typography,
      Tag,
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
      // DraftEditor,
    ],
    CustomComponents: [],
    className: "fullheight",
    templates: [],
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


  renderPanels() {

    const {
      Grid,
    } = this.context;

    const {
      classes,
      // Components,
    } = this.props;

    const Components = this.getComponents();


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


  renderTemplates() {


    const {
      Grid,
    } = this.context;

    const {
      activeItem,
      templatesGroup,
    } = this.state;


    if (!activeItem) {
      return null;
    }

    const {
      data,
      _dirty,
      ...other
    } = this.props;

    const templates = this.getTemplates();



    // let components;

    let list = templates.map((n, index) => {

      const {
        label,
        templates,
      } = n;

      return <div
        key={index}
        style={{
          padding: 10,
          margin: "5px 0",
          cursor: "pointer",
          borderTop: "1px solid #ddd",
          borderBottom: "1px solid #ddd",
        }}
        onClick={event => {

          this.setState({
            templatesGroup: templates,
            // templatesGroup: templatesGroup && templatesGroup === templates ? null : templates,
          });

        }}
      >
        {label}
      </div>

    })

    return <div
      style={{
        position: "relative",
        border: "1px solid red",
        height: "100%",
      }}
    >

      {list}

      {templatesGroup && templatesGroup.length ?
        <div
          style={{
            position: "absolute",
            // border: "1px solid blue",
            left: "100%",
            top: 0,
            height: "100%",
            width: "490px",
            padding: 15,
            zIndex: 1200,
            background: "rgba(255, 255, 255, 1)",
            overflowY: "auto",
          }}
        >

          <Grid
            container
          >
            <Grid
              item
              xs
            >

            </Grid>
            <Grid
              item
            >
              <IconButton
                onClick={event => {
                  this.closeTemplates();
                }}
              >
                <CloseIcon

                />
              </IconButton>
            </Grid>
          </Grid>

          {templatesGroup.map((n, index) => {

            const {
              label,
              ...component
            } = n;

            return <div
              key={index}
              style={{
                position: "relative",
                borderBottom: index - 1 === templatesGroup.length ? undefined : "1px solid #ddd",
                margin: "30px 0",
                cursor: "pointer",
              }}
              onClick={event => {

                event.preventDefault();
                event.stopPropagation();

                if (activeItem) {
                  activeItem.addComponent(component);
                }

                this.closeTemplates();

              }}
            >
              <h3
                style={{
                  borderBottom: "2px solid #ddd",
                }}
              >
                {label}
              </h3>
              <FrontEditor
                {...other}
                inEditMode={false}
                data={{
                  object: component,
                }}
              />
            </div>;

          })}

        </div>
        : null
      }
    </div>

    return <Grid
      container
      spacing={8}
      style={{
        justifyContent: "center",
      }}
    >
      {this.getTemplates().map((n, index) => {

        const {
          label,
          ...component
        } = n;

        return <Grid
          key={index}
          item
        >
          <Button
            variant="raised"
            size="small"
            onClick={event => {

              event.preventDefault();
              event.stopPropagation();

              activeItem.addComponent(component);

            }}
          >
            {label}
          </Button>
        </Grid>

      })}
    </Grid>
  }


  closeTemplates() {

    this.setState({
      templatesGroup: null,
    })

  }


  getTemplates() {

    const {
      templates: customTemplates,
    } = this.props;

    let templates = [];

    templates.push({
      label: "Разметка",
      templates: this.getGridTemplates(),
    });

    templates.push({
      label: "Текстовый блок",
      templates: this.getTextTemplates(),
    });

    templates.push({
      label: "Меню",
      templates: this.getMenuTemplates(),
    });

    templates.push({
      label: "Данные сайта",
      templates: this.getDataTemplates(),
    });

    templates.push({
      label: "Медиа",
      templates: this.getMediaTemplates(),
    });

    return templates.concat(customTemplates || []);
  }


  getGridTemplates() {

    let buttons = [];


    buttons.push({
      name: "Section",
      label: "Основной блок",
      props: {
      },
      components: [
        {
          name: "Section",
          props: {
            style: {
              margin: "0 auto",
              maxWidth: "1260px",
            },
          },
          components: [
            {
              name: "Section",
              props: {
                style: {
                  paddingTop: "180px",
                  paddingBottom: "180px",
                },
              },
              components: [
                {
                  name: "Tag",
                  props: {
                    tag: "div",
                  },
                  components: [
                    {
                      name: "Tag",
                      props: {
                        text: `Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.`,
                      },
                      components: [],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });


    buttons.push({
      name: "Tag",
      label: "Таблица",
      props: {
        tag: "div",
      },
      components: [{
        name: "Tag",
        props: {
          tag: "table",
          style: {
            width: "100%",
          },
        },
        components: [
          {
            name: "Tag",
            props: {
              tag: "tbody",
            },
            components: [
              {
                name: "Tag",
                props: {
                  tag: "tr",
                },
                components: [
                  {
                    name: "Tag",
                    props: {
                      tag: "th",
                    },
                    components: [
                      {
                        name: "Tag",
                        props: {
                          text: "th",
                        },
                        components: [
                        ],
                      },
                    ],
                  },
                  {
                    name: "Tag",
                    props: {
                      tag: "td",
                    },
                    components: [
                      {
                        name: "Tag",
                        props: {
                          text: "td",
                        },
                        components: [
                        ],
                      },
                    ],
                  },
                ],
              },
              {
                name: "Tag",
                props: {
                  tag: "tr",
                },
                components: [
                  {
                    name: "Tag",
                    props: {
                      tag: "th",
                    },
                    components: [
                      {
                        name: "Tag",
                        props: {
                          text: "th",
                        },
                        components: [
                        ],
                      },
                    ],
                  },
                  {
                    name: "Tag",
                    props: {
                      tag: "td",
                    },
                    components: [
                      {
                        name: "Tag",
                        props: {
                          text: "td",
                        },
                        components: [
                        ],
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      }
      ],
    });

    return buttons;

  }


  getTextTemplates() {

    let buttons = [];

    buttons.push({
      label: "Обычный текст",
      name: "Tag",
      props: {
        tag: "div",
      },
      components: [
        {
          name: "Tag",
          props: {
            text: `Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.`,
          },
          components: [],
        },
      ],
    });


    buttons.push({
      label: "Средний текст",
      name: "Tag",
      props: {
        tag: "div",
        style: {
          fontSize: "1.5rem",
        },
      },
      components: [
        {
          name: "Tag",
          props: {
            text: `Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.`,
          },
          components: [],
        },
      ],
    });


    buttons.push({
      label: "Крупный текст",
      name: "Tag",
      props: {
        tag: "div",
        style: {
          fontSize: "2rem",
        },
      },
      components: [
        {
          name: "Tag",
          props: {
            text: `Lorem Ipsum является стандартной "рыбой" для текстов на латинице с начала XVI века. В то время некий безымянный печатник создал большую коллекцию размеров и форм шрифтов, используя Lorem Ipsum для распечатки образцов. Lorem Ipsum не только успешно пережил без заметных изменений пять веков, но и перешагнул в электронный дизайн.`,
          },
          components: [],
        },
      ],
    });


    return buttons;

  }


  getMenuTemplates() {

    let buttons = [];

    buttons.push({
      label: "Главное меню",
      name: "PageHeader",
      props: {
      },
      components: [
      ],
    });


    return buttons;

  }


  getDataTemplates() {

    let buttons = [];


    buttons.push({
      label: "Пользователи",
      name: "Section",
      props: {},
      components: [
        {
          "name": "Connector",
          "props": {
            "first": 12,
            "filtersname": "filters",
            query: "usersConnection",
          },
          "components": [
            {
              "name": "Grid",
              "props": {
                "container": true,
                "spacing": 8
              },
              "components": [
                {
                  "name": "Grid",
                  "props": {
                    "item": true,
                    "xs": 12
                  },
                  "components": [
                    {
                      "name": "Filters",
                      "components": []
                    }
                  ]
                },
                {
                  "name": "Grid",
                  "props": {
                    "item": true,
                    "xs": 12
                  },
                  "components": [
                    {
                      "name": "ListView",
                      "components": [
                        {
                          "name": "Grid",
                          "props": {
                            "item": true,
                            "xs": 12,
                            "md": 6,
                            "xl": 3
                          },
                          "components": [
                            {
                              "name": "UserLink",
                              "props": {},
                              "components": []
                            },
                            {
                              "name": "NamedField",
                              "props": {
                                name: "fullname",
                              },
                              "components": []
                            },
                          ]
                        }
                      ]
                    }
                  ]
                },
                {
                  "name": "Grid",
                  "props": {
                    "item": true,
                    "xs": 12
                  },
                  "components": [
                    {
                      "name": "Pagination"
                    }
                  ]
                }
              ]
            }
          ],
        },
      ],
    });


    return buttons;

  }


  getMediaTemplates() {

    let buttons = [];


    buttons.push({
      label: "YouTube",
      name: "Section",
      props: {
        style: {
          height: 0,
          position: "relative",
          paddingTop: "56.25%",
          overflow: "hidden",
        },
      },
      components: [
        {
          name: "Tag",
          props: {
            tag: "iframe",
            src: "https://www.youtube.com/embed/4j9ePxDhHGU",
            frameborder: 0,
            allow: "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
            allowFullScreen: true,
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              border: 0,
              width: "100%",
              height: "100%",
            },
          },
          components: [],
        },
      ],
    });


    return buttons;

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
                {this.renderTemplates()}
              </div>
              <div
                className={[classes.editor, classes.bordered].join(" ")}
              >
                {items}

              </div>
              <div
                className={[classes.panel, classes.bordered].join(" ")}
              >
                {this.renderPanels()}
              </div>
            </div>
          </Fragment>
          : items
        }
      </EditorContext.Provider>
    );

  }
}


export default withStyles(styles)(props => <FrontEditor
  {...props}
/>);

