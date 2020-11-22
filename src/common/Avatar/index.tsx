import React, { Component } from 'react'
import PropTypes from 'prop-types'

import Context from '@prisma-cms/context'

import Avatar from 'material-ui/Avatar'

import withStyles from 'material-ui/styles/withStyles'
import { UserAvatarProps } from './interfaces'

export * from './interfaces'

const styles = {
  row: {
    display: 'flex',
    justifyContent: 'center',
  },
  avatar: {
    margin: 10,
    textDecoration: 'none',
    // maxWidth: "100%",
    // height: "auto",
  },
  smallAvatar: {
    width: 40,
    height: 40,
  },
  bigAvatar: {
    width: 120,
    height: 120,
  },
  editable: {
    cursor: 'pointer',
  },
}

export class UserAvatar extends Component<UserAvatarProps> {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    size: PropTypes.string.isRequired,
    editable: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    size: 'normal',
    // size: "big",
    editable: false,
  }

  static contextType = Context

  render() {
    const { user, classes, size, editable, ...other } = this.props

    if (!user) {
      return null
    }

    const { assetsBaseUrl } = this.context

    const {
      // id,
      image,
      username,
      fullname,
      // firstname,
      // lastname,
    } = user ?? {}

    // const name = [firstname, lastname].filter(n => n).reduce((prev, next) => [prev, " ", next]) || username;
    // const name = fullname || [firstname, lastname].filter(n => n).join(" ") || username;
    const name = fullname || username || ''

    const classNames = [classes?.avatar]

    let url

    if (image) {
      // url = `/images/avatar/${image}`;
      // url = `/images/resized/thumb/uploads/${image}`;
      url = `${
        assetsBaseUrl !== undefined ? assetsBaseUrl : '/'
      }images/resized/thumb/${image}`
    }

    switch (size) {
      case 'small':
        classNames.push(classes?.smallAvatar)
        break

      case 'big':
        classNames.push(classes?.bigAvatar)

        break
    }

    if (editable) {
      classNames.push(classes?.editable)
    }

    return (
      <Avatar
        alt={name}
        src={url || undefined}
        className={classNames.join(' ')}
        {...other}
      >
        {url ? '' : (name && name.substr(0, 1).toLocaleUpperCase()) || 'A'}
      </Avatar>
    )
  }
}

export default withStyles(styles)((props: UserAvatarProps) => (
  <UserAvatar {...props} />
))
