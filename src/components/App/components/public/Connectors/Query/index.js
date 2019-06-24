import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../';

import Icon from "material-ui-icons/SwapHoriz";
import CloseIcon from "material-ui-icons/Close";

import QueryBuilder from "@prisma-cms/query-builder";
import { Drawer } from 'material-ui';
import { Button } from 'material-ui';
import { IconButton } from 'material-ui';


class Query extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
  }

  static Name = "Query"
  static help_url = "https://front-editor.prisma-cms.com/topics/query.html";

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


  renderChildren() {

    const {
      activeItem,
    } = this.getEditorContext();

    let output = null;


    const {
      query,
    } = this.getComponentProps(this);


    if (activeItem && activeItem === this) {
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

    const {
      setActiveItem,
    } = this.getEditorContext();

    setActiveItem(null);
  }

}

export default Query;
