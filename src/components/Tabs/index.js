import React from 'react'

import Tab from './Tab'
import EditorComponent from '../../EditorComponent'

import MuiTabs, { Tab as MuiTab } from 'material-ui/Tabs'

export class Tabs extends EditorComponent {
  static Name = 'Tabs'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    centered: false,
    fullWidth: false,
    indicatorColor: 'secondary',
    scrollable: false,
    scrollButtons: 'auto',
    textColor: 'inherit',
    hide_wrapper_in_default_mode: true,
  }

  constructor(props) {
    super(props)

    this.state = {
      ...this.state,
      tabIndex: 0,
    }
  }

  renderPanelView() {
    return super.renderPanelView(
      <div className="editor-component--panel-icon">Tabs</div>
    )
  }

  getRootElement() {
    return super.getRootElement()
  }

  canBeParent(parent) {
    return super.canBeParent(parent)
  }

  canBeChild(child) {
    return child instanceof Tab
  }

  onTabChange = (item, tabIndex) => {
    this.setState({
      tabIndex,
    })
  }

  renderChildren() {
    const {
      centered,
      fullWidth,
      indicatorColor,
      scrollable,
      scrollButtons,
      textColor,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      hide_wrapper_in_default_mode,
      ...other
    } = this.getComponentProps(this)

    const { tabIndex } = this.state

    const { components } = this.getObjectWithMutations()

    const tabs = []

    let content = null

    if (components && components.length) {
      components.map((n, index) => {
        if (!n) {
          return null
        }

        const {
          props: { label },
        } = n

        tabs.push(<MuiTab key={index} label={label || ''} />)

        if (index === tabIndex) {
          content = this.renderComponent(n, index)
        }

        return null
      })
    }

    return (
      <div key="tabs" {...other}>
        <MuiTabs
          centered={centered}
          fullWidth={fullWidth}
          indicatorColor={indicatorColor}
          scrollable={scrollable}
          scrollButtons={scrollButtons}
          textColor={textColor}
          value={tabIndex}
          onChange={this.onTabChange}
        >
          {tabs}
        </MuiTabs>

        {content}
      </div>
    )
  }
}

export default Tabs
