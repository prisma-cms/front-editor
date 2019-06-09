import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';


import { TimelineItem as TimelineItemProto } from 'vertical-timeline-component-for-react';

import EditorComponent from '../../..';
import { ObjectContext } from '../../Connectors/Connector/ListView';

import classNames from "classnames"
import VisibilitySensor from 'react-visibility-sensor';
import VerticalTimeline from '..';

export class TimelineItem extends TimelineItemProto {


  render() {
    const {
      id,
      children,
      dateText,
      dateStyle,
      dateComponent: DateComponent,
      dateInnerStyle,
      bodyContainerStyle,
      style,
      className,
      visibilitySensorProps,
    } = this.props;
    const { visible } = this.state;

    const isSSR = typeof window === "undefined";

    return (
      <div
        id={id}
        className={classNames(className, 'entry', {
          'timeline-item--no-children': children === '',
        })}
        style={style}
      >
        <VisibilitySensor
          {...visibilitySensorProps}
          onChange={this.onVisibilitySensorChange}
        >
          <Fragment>
            <div className="title">
              <div className={`${visible || isSSR ? 'bounce-in' : 'is-hidden'}`}>
                {DateComponent ? typeof DateComponent === "function" ? <DateComponent

                /> : (
                    DateComponent
                  ) : (
                    <span style={dateStyle} className="timeline-item-date">
                      <time
                        style={dateInnerStyle}
                        className="timeline-item-dateinner"
                        title={dateText}
                      >
                        {dateText}
                      </time>
                    </span>
                  )}
              </div>
            </div>
            <div className="body">
              <div
                className={`body-container ${
                  visible || isSSR ? 'bounce-in' : 'is-hidden'
                  }`}
                style={bodyContainerStyle}
              >
                {children}
              </div>
            </div>
          </Fragment>
        </VisibilitySensor>
      </div>
    );
  }

}


class VerticalTimelineItem extends EditorComponent {


  static defaultProps = {
    ...EditorComponent.defaultProps,
    label: undefined,
    helperText: undefined,
    readOnly: true,
    backgroundColor: "#76bb7f",
  }

  static Name = "VerticalTimelineItem"
  static help_url = "https://front-editor.prisma-cms.com/topics/verticaltimeline.html";

  onBeforeDrop = () => {

  }

  // canBeDropped = (dragItem) => {
  //   return false;
  // }


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelVerticalTimelineItem}
    >
      VerticalTimelineItem
    </div>);
  }


  // getRootElement() {

  //   return VerticalTimelineItemComponent
  // }

  getRootElement() {

    return this.renderRoot
  }


  renderRoot = props => {

    const {
      style,
      dateText,
      dateStyle,
      dateInnerStyle,
      dateComponent,
      bodyContainerStyle,
      visibilitySensorProps,
      ...other
    } = props;

    return <TimelineItem
      {...{
        style,
        dateText,
        dateStyle,
        dateInnerStyle,
        dateComponent,
        bodyContainerStyle,
        visibilitySensorProps,
      }}
    >
      <div
        {...other}
      >

      </div>
    </TimelineItem>
  }


  renderMainView() {

    return <ObjectContext.Consumer>
      {context => {

        const {
          object,
        } = context;


        return super.renderMainView({
          object,
          dateComponent: this.renderDateComponent,
        });
      }}
    </ObjectContext.Consumer>
  }


  renderDateComponent = () => {

    const object = this.getObjectWithMutations();

    const {
      components,
    } = object || {};

    const {
      backgroundColor,
    } = this.getComponentProps(this);


    return <div
      className="timeline-item-date"
      style={{
        position: "relative",
        zIndex: 100,
        clipPath: "unset",
        display: "flex",
        flexDirection: "row",
        background: "transparent",
        whiteSpace: "nowrap",
      }}
    >
      <div
        className="timeline-item-dateinner"
        style={{
          clipPath: "unset",
          flex: 1,
          backgroundColor: backgroundColor ? backgroundColor : "transparent",
        }}
      >
        {components && components.length ? this.renderComponent(components[0]) : null}
      </div>
      <div
        style={backgroundColor ? {
          "width": "0",
          "height": "0",
          "borderStyle": "solid",
          "borderWidth": "25px 0 25px 10px",
          "borderColor": `transparent transparent transparent ${backgroundColor}`
        } : undefined}
      >
      </div>
    </div>
  }


  getComponents(itemComponents) {

    return itemComponents && itemComponents.length ? itemComponents.slice(1) : [];
  }



  canBeParent(parent) {

    return parent instanceof VerticalTimeline && super.canBeParent(parent);
  }

}

export default VerticalTimelineItem;
