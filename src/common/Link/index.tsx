import React, { Component } from 'react'

import NextLink from 'next/link'

import Typography from 'material-ui/Typography'

import withStyles from 'material-ui/styles/withStyles'

import { UiLinkProps } from './interfaces'
export * from './interfaces'

export const styles = {
  root: {},
  text: {
    display: 'inline-block',
  },
}

export class Link<P extends UiLinkProps> extends Component<P> {
  render() {
    const {
      className,
      textClassName,
      classes,
      children,
      href,
      color,
      variant,
      to,
      ...other
    } = this.props

    return (
      <NextLink href={to ?? href}>
        <a className={[classes?.root, className].join(' ')} {...other}>
          <Typography
            component="span"
            className={[classes?.text, textClassName].join(' ')}
            color={color}
            variant={variant}
          >
            {children || ''}
          </Typography>
        </a>
      </NextLink>
    )
  }
}

export default withStyles(styles)((props: UiLinkProps) => <Link {...props} />)
