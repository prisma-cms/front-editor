import React from 'react';
import EditorComponent from '../../../';

import Icon from "material-ui-icons/SwapHoriz";
import CloseIcon from "material-ui-icons/Close";

import QueryBuilder from "@prisma-cms/query-builder";
import Drawer from 'material-ui/Drawer';
import Button from 'material-ui/Button';

class Query extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "Query"
  static help_url = "https://front-editor.prisma-cms.com/topics/query.html";


  constructor(props){

    super(props);

    this.state = {
      ...this.state,
      expanded: false,
    }

  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> Query
    </div>);
  }


  onClick(event) {

    if (event.target === event.currentTarget) {

      const {
        active,
        expanded,
      } = this.state;

      if (active && !expanded) {
        this.setState({
          expanded: true,
        });
      }

    }

    return super.onClick(event);

  }


  renderChildren() {

    const {
      activeItem,
    } = this.getEditorContext();

    let output = null;


    const {
      query,
    } = this.getComponentProps(this);


    const {
      expanded,
    } = this.state;


    if (activeItem && activeItem === this && expanded) {
      // output = <div
      //   style={{
      //     height: "80vh",
      //   }}
      // >
      //   <QueryBuilder
      //     query={query || ""}
      //     onEditQuery={query => {
      //       this.updateComponentProperty("query", query)
      //     }}
      //   />
      // </div>;


      output = <Drawer
        anchor="top"
        open={true}
        onClose={this.close}
        // ModalProps={{

        // }}
        style={{
          // height: "100%",
          zIndex: 3000,
        }}
        PaperProps={{
          style: {
            height: "100%",
          },
        }}
      >
        {/* <div
          style={{
            height: "80vh",
          }}
        > */}

        <div
          style={{
            textAlign: "right",
          }}
        >
          <Button
            onClick={this.close}
          >
            <CloseIcon />
          </Button>
        </div>

        <QueryBuilder
          query={query || ""}
          onEditQuery={query => {
            this.updateComponentProperty("query", query)
          }}
        />
        {/* </div> */}
      </Drawer>

    }
    else {
      output = super.renderChildren();
    }

    return output;

  }


  close = event => {

    event.preventDefault();
    event.stopPropagation();

    // const {
    //   setActiveItem,
    // } = this.getEditorContext();

    // setActiveItem(null);

    this.setState({
      expanded: false,
    });

  }

}

export default Query;
