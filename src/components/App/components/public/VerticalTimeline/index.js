import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';

import { Timeline } from 'vertical-timeline-component-for-react';
import Iterable from '../Connectors/Connector/ListView/Iterable';
import VerticalTimelineItem from './VerticalTimelineItem';

class VerticalTimeline extends Iterable {

  static Name = "VerticalTimeline"
  static help_url = "https://front-editor.prisma-cms.com/topics/verticaltimeline.html";

  static defaultProps = {
    ...Iterable.defaultProps,
    hide_wrapper_in_default_mode: true,
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();


    return super.renderPanelView(content !== undefined ? content : <div
      className={classes.panelButton}
    >
      {/* <Icon />  */}
      VerticalTimeline
    </div>);
  }


  renderChildren() {

    return <Timeline
      key="timeline"
      lineColor={'#ddd'}
    >

      {super.renderChildren()}

    </Timeline>


  }

  canBeChild(child) {

    return child instanceof VerticalTimelineItem && super.canBeChild(child);
  }


}


export default VerticalTimeline;