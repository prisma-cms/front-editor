import React, { Fragment } from 'react';

import Tab from './Tab';
import EditorComponent from '../..';

import MuiTabs, {
  Tab as MuiTab,
} from "material-ui/Tabs";

export class Tabs extends EditorComponent {

  static Name = 'Tabs';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    centered: false,
    fullWidth: false,
    indicatorColor: "secondary",
    scrollable: false,
    scrollButtons: "auto",
    textColor: "inherit",
    content_node_class: undefined,
  }


  constructor(props) {

    super(props);

    this.state = {
      ...this.state,
      tabIndex: 0,
    }

  }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      <div
        className={classes.panelButton}
      >
        Tabs
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    return child instanceof Tab;
  }


  renderChildren() {

    const {
    } = this.context;

    const {
    } = this.getEditorContext();

    const {
      content_node_class,
      ...other
    } = this.getComponentProps(this);


    const {
      tabIndex,
    } = this.state;

    const {
      components,
    } = this.getObjectWithMutations();

    // console.log("Tabs props", this.props);

    // console.log("Tabs components", components);


    // const children = super.renderChildren();

    // console.log("Tabs children", children);


    let tabs = [];

    let content = null;


    if (components && components.length) {

      components.map((n, index) => {

        if (!n) {
          return;
        }

        const {
          props: {
            label,
          },
        } = n;

        // const label = props

        // if(!label) {
        //   return;
        // }

        tabs.push(<MuiTab
          key={index}
          label={label || ""}
        />);

        if (index === tabIndex) {

          content = this.renderComponent(n, index);

        }

      });

    }


    return <Fragment>

      <MuiTabs
        {...other}
        value={tabIndex}
        onChange={(item, tabIndex) => {
          this.setState({
            tabIndex,
          });
        }}
      >
        {tabs}
      </MuiTabs>

      {content ?
        <div
          className={content}
        >
          {content}
        </div> : null
      }

    </Fragment>;
  }

}

export default Tabs;