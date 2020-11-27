/* eslint-disable react/jsx-no-bind */
import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import EditorComponent from '../../../EditorComponent'

// import Icon from "material-ui-icons/SettingsOverscan";

import { Switch as RouterSwitch, Route } from 'react-router-dom'
import Typography from 'material-ui/Typography'
import EditorRoute from '../Route'
import { RouteContext } from '../../../context'
import Grid from '../../../common/Grid'

// import PrismaCmsPerformanceTester from "@prisma-cms/performance";

class EditorSwitch extends EditorComponent {
  static Name = 'EditorSwitch'

  static propTypes = {
    ...EditorComponent.propTypes,
    showRoutes: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    showRoutes: true,
    hide_wrapper_in_default_mode: true,
  }

  /**
   * Не может быть дочерним для другого роутера
   */
  canBeChild(child) {
    return child instanceof EditorRoute && super.canBeChild(child)
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">Router Switch</div>
      )
    )
  }

  renderItems({
    itemComponents,
    menuItems,
    output,
    Components,
    showRoutes,
    createTemplate,
    updateTemplate,
    routesShowed,
  }) {
    itemComponents.map((n, index) => {
      const { id, name, props, ...other } = n

      const { exact, path, routername } = props

      const Component = Components.find((n) => n.Name === name)

      if (Component) {
        let component

        const route = (
          <Route
            key={id || index}
            exact={exact === undefined ? false : exact}
            path={path}
            render={(routerProps) => {
              /**
            ToDo: Удалить routerProps, потому что передает каждый раз новый объект
            и Роуты перерендериваются
             */

              return (
                <RouteContext.Provider value={routerProps}>
                  <Component
                    // key={id || index}
                    mode="main"
                    // component={n}
                    parent={this}
                    props={props}
                    // data={{
                    //   object: n,
                    // }}
                    object={n}
                    exact={exact}
                    path={path}
                    routername={routername}
                    // _dirty={n}
                    showRoutes={showRoutes}
                    createTemplate={createTemplate}
                    updateTemplate={updateTemplate}
                    {...other}
                    {...props}
                    {...routerProps}
                  />
                </RouteContext.Provider>
              )
            }}
          />
        )

        /**
         * Если в режиме редактирования и показывать роутеры, то выводим данные
         */
        // if (inEditMode && showRoutes) {
        if (routesShowed) {
          const key = `${id}-${index}`

          const title = (
            <Typography>
              {routername}{' '}
              <Typography
                component="span"
                variant="caption"
                style={{
                  display: 'inline-block',
                }}
              >
                {path}
                {!exact ? '*' : ''}
              </Typography>
            </Typography>
          )

          component = (
            <Fragment key={key}>
              {title}

              {route}
            </Fragment>
          )

          menuItems.push(
            <Grid key={key} item>
              {title}
            </Grid>
          )
        } else {
          // component = <Route
          //   key={id || index}
          //   exact={exact === undefined ? true : exact}
          //   path={path}
          //   render={() => {
          //     return element;
          //   }}
          // />

          component = route
        }

        output.push(component)
      }
    })
  }

  renderChildren() {
    const { inEditMode } = this.getEditorContext()

    const {
      // mutate,
      createTemplate,
      updateTemplate,
    } = this.props

    const { showRoutes } = this.getComponentProps(this)

    const object = this.getObjectWithMutations()

    const { Components } = this.getEditorContext()

    const {
      // props,
      components: itemComponents,
    } = object

    const output = []

    let header

    const routesShowed = inEditMode && showRoutes

    if (itemComponents) {
      const menuItems = []

      this.renderItems({
        itemComponents,
        menuItems,
        output,
        Components,
        showRoutes,
        createTemplate,
        updateTemplate,
        routesShowed,
      })

      header = (
        <Grid container spacing={16}>
          {menuItems}
        </Grid>
      )
    }

    let result = null

    if (routesShowed) {
      result = (
        <Fragment key="with_header">
          {header}
          {output}
        </Fragment>
      )
    } else {
      result = <RouterSwitch key="router">{output}</RouterSwitch>
    }

    return result
  }
}

export default EditorSwitch
