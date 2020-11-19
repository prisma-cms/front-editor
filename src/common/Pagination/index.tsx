import React, { Component } from 'react'

import { withStyles } from 'material-ui/styles'

import Link from 'next/link'

import URI from 'urijs'
import { PaginationProps } from './interfaces'
import { PrismaCmsContext } from '@prisma-cms/context'

import Context from '@prisma-cms/context'

const styles = {
  row: {
    display: 'flex',
    flexDirection: 'row' as 'row',
    flexWrap: 'nowrap' as 'nowrap',
    justifyContent: 'center',
    listStyle: 'none',
    // margin: 0,
    padding: 0,
  },
  active: {
    background: '#ddd',
  },
  control: {},
  link: {
    padding: '3px 6px',
    border: '1px solid #ddd',
    marginLeft: 3,
    marginRight: 3,
    textDecoration: 'none',
    '&:hover': {
      background: '#dfdfdf',
    },
  },
}

export class Pagination extends Component<PaginationProps> {
  context!: PrismaCmsContext

  static contextType = Context

  static defaultProps = {
    pagevariable: 'page',
  }

  getNewLocation = (page: number) => {
    const { router } = this.context

    const { pagevariable = 'page' } = this.props

    const asPath = router?.asPath

    const uri = new URI(asPath)

    const query = uri.query(true)

    Object.assign(query, {
      [pagevariable]: page > 1 ? page : undefined,
    })

    uri.query(query)

    return uri.resource()
  }

  getPage() {
    const {
      // pagevariable,
      page,
    } = this.props

    // const page = this.props[pagevariable];

    return page || 1
  }

  render() {
    const {
      classes,
      limit,
      total,
      rowProps,
      // pagevariable,
      ...other
    } = this.props

    const page = this.getPage()

    if (!page || !limit || !total) {
      return null
    }

    const pages = Math.ceil(total / limit)

    if (pages < 2) {
      return null
    }

    const {
      row: rowClass,
      wrapper: wrapperClass,
      control: controlClass,
      link: linkClass,
      active: activeClass,
    } = classes || {}

    const rows = []

    if (page > 1) {
      // var href = this.getNewLocation(1);

      const href = this.getNewLocation(page - 1)

      rows.push(
        <li key="page-1-0" className={controlClass}>
          <Link href={href}>
            <a className={linkClass}>«</a>
          </Link>
        </li>
      )
    }

    let lstr = false
    let rstr = false
    for (let i = 1; i <= pages; i++) {
      if (
        (page > 2 && i < page - 1 && i > 1) ||
        (pages - page > 3 && i > page + 1 && i < pages - 1)
      ) {
        if (!lstr && i > 1 && i < page) {
          rows.push(
            <li key={i} className={controlClass}>
              <span>...</span>
            </li>
          )
          lstr = true
        }
        if (!rstr && i > page && i < pages) {
          rows.push(
            <li key={i} className={controlClass}>
              <span>...</span>
            </li>
          )
          rstr = true
        }
      } else {
        const href = this.getNewLocation(i)

        rows.push(
          <li key={i} className={controlClass}>
            <Link href={href}>
              <a
                className={[linkClass, i === page ? activeClass : null].join(
                  ' '
                )}
              >
                {i}
              </a>
            </Link>
          </li>
        )
      }
    }
    if (page < pages) {
      const href = this.getNewLocation(page + 1)

      rows.push(
        <li key={'page-' + pages + '-0'} className={controlClass}>
          <Link href={href}>
            <a className={linkClass}>»</a>
          </Link>
        </li>
      )
    }

    return (
      <div className={[wrapperClass, 'Pagination--root'].join(' ')} {...other}>
        <ul className={rowClass} {...rowProps}>
          {rows}
        </ul>
      </div>
    )
  }
}

export default withStyles(styles)((props: PaginationProps) => (
  <Pagination {...props} />
))
