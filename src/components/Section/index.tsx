import React from 'react'
// import PropTypes from 'prop-types';
import EditorComponent from '../../EditorComponent'

import { SectionProps, SectionState } from './interfaces'
export * from './interfaces'

class Section<
  P extends SectionProps = SectionProps,
  S extends SectionState = SectionState
> extends EditorComponent<P, S> {
  // static defaultProps = {
  //   ...EditorComponent.defaultProps,
  //   // marginTop: 10,
  //   // marginBottom: 10,
  //   // fontFamily: "Roboto",
  //   // fontSize: 20,
  // }

  static Name = 'Section' as 'Section'

  renderPanelView(content?: React.ReactNode) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">
          <span>&#9881;</span> Section
        </div>
      )
    )
  }
}

export default Section
