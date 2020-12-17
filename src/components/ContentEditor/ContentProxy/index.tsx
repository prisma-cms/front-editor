import React from 'react'

import { ContentProxyProps } from './interfaces'

import TagEditor from '../TagEditor'

export class ContentProxy extends React.Component<ContentProxyProps> {
  // static propTypes = {
  //   updateObject: PropTypes.func.isRequired,
  //   editable: PropTypes.bool.isRequired,
  //   classes: PropTypes.object.isRequired,
  //   TagEditor: PropTypes.func.isRequired,
  // }

  // static defaultProps = {
  //   TagEditor,
  // }

  shouldComponentUpdate() {
    const { editable } = this.props

    return editable ? false : true
  }

  render() {
    const {
      components,
      editable,
      initialContent,
      mode = 'main',
      // TagEditor,
      ...other
    } = this.props

    return (
      <TagEditor
        mode={mode}
        editable={editable}
        object={{
          name: 'HtmlTag',
          component: 'HtmlTag',
          props: {
            tag: 'div',
          },
          components: editable
            ? components && components.length
              ? components
              : initialContent
              ? initialContent
              : []
            : components || [],
        }}
        {...other}
      />
    )
  }
}

export default ContentProxy;
