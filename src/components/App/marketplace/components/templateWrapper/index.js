import React, { Component } from 'react';
import PropTypes from 'prop-types';
import EditorComponent from '../../../components';
import { Paper } from 'material-ui';
import { ObjectContext } from '../../../components/public/Connectors/Connector/ListView';



class TemplateWrapper extends EditorComponent {

  static Name = "TemplateWrapper";


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      TemplateWrapper
    </div>);
  }


  renderMainView() {

    const {
      activeItem,
      FrontEditor,
    } = this.props;

    return <ObjectContext.Consumer>
      {context => {

        // console.log("TemplateWrapper context", { ...context });

        const {
          object,
        } = context;

        if (!object) {
          return null;
        }

        return <Paper
          style={{
            cursor: "pointer",
            padding: 10,
            margin: "10px 0",
            width: "100%",
          }}
          onClick={event => {

            event.preventDefault();
            event.stopPropagation();

            // alert("Sdfsdfs");

            // console.log("TemplateWrapper props", { ...this.props });


            if (activeItem) {
              activeItem.addComponent(object);
            }

          }}
        >

          {this.renderChildren()}

          <hr />

          <FrontEditor
            data={{
              object,
            }}
          />

        </Paper>
      }}
    </ObjectContext.Consumer>
  }

}


export default TemplateWrapper;