/* eslint-disable react/jsx-no-bind */
import React from 'react'
import EditorComponent from '../../EditorComponent'

import AppBar from 'material-ui/AppBar'
import Typography from 'material-ui/Typography'
import Button from 'material-ui/Button'
import Grid from '../../common/Grid'

class PageHeader extends EditorComponent {
  static defaultProps = {
    ...EditorComponent.defaultProps,
    position: 'static',
  }

  static Name = 'PageHeader'

  renderPanelView() {
    return null
  }

  getRootElement() {
    return AppBar
  }

  renderChildren() {
    const { user, UserLink } = this.context

    if (!UserLink) {
      console.error('UserLink not defined')
      return null
    }

    const { username, fullname } = user || {}

    return (
      <Grid
        container
        spacing={16}
        alignItems="center"
        className="MainMenu-root"
      >
        {super.renderChildren()}

        {user ? (
          [
            <Grid key="user" item>
              <UserLink
                user={user}
                style={{
                  marginLeft: 5,
                }}
                variant={null}
              >
                <Typography color="inherit">{fullname || username}</Typography>
              </UserLink>
            </Grid>,
            <Grid key="logout" item>
              <Button onClick={() => this.logout()} color="inherit">
                {this.lexicon('Signout')}
              </Button>
            </Grid>,
          ]
        ) : (
          <Grid key="login" item>
            <Button
              onClick={() => {
                const { openLoginForm } = this.context
                openLoginForm()
              }}
              color="inherit"
            >
              {this.lexicon('Signin')}
            </Button>
          </Grid>
        )}
      </Grid>
    )
  }

  logout() {
    const { logout } = this.context

    logout()
  }
}

export default PageHeader
