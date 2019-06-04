import React, { Component, Fragment, createContext } from 'react';
import PropTypes from 'prop-types';

import { Timeline } from 'vertical-timeline-component-for-react';
import Iterable from '../Connectors/Connector/ListView/Iterable';

class VerticalTimeline extends Iterable {

  static Name = "VerticalTimeline"

  static propTypes = {
    ...Iterable.propTypes,
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

    return <Timeline lineColor={'#ddd'}>

      {super.renderChildren()}

    </Timeline>


  }


}


export default VerticalTimeline;