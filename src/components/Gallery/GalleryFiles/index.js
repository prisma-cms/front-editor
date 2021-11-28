import React from 'react'
import EditorComponent from '../../../EditorComponent'
import EditableObject from '../../form/EditableObject'
import { EditableObjectContext } from '../../../context'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

export class GalleryFiles extends EditorComponent {
  static Name = 'GalleryFiles'

  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: 'Files',
  }

  renderPanelView(content) {
    return super.renderPanelView(
      content || (
        <div className="editor-component--panel-icon">GalleryFiles</div>
      )
    )
  }

  getRootElement() {
    return super.getRootElement()
  }

  canBeParent(parent) {
    return (
      super.canBeParent(parent) &&
      this.findInParent(parent, (parent) => parent instanceof EditableObject)
    )
  }

  canBeChild(child) {
    return super.canBeChild(child)
  }

  renderChildren() {
    const { Image } = this.context

    const { inEditMode } = this.getEditorContext()

    const {
      name,
      // ...other
    } = this.getComponentProps(this)

    const children = super.renderChildren()

    if (inEditMode) {
      return children
    }

    /**
     * Проблема заключается в том, что надо соблюдать сортировку для новых файлов и имеющихся.
     */

    return (
      <EditableObjectContext.Consumer key="GalleryFiles">
        {(editableObjectContext) => {
          const { object, getObjectWithMutations, _dirty } =
            editableObjectContext

          if (!getObjectWithMutations) {
            return null
          }

          const { [name]: files } = object || {}

          const { [name]: dirty_files } = _dirty || {}

          let Files = [].concat(files || [])

          if (
            dirty_files &&
            dirty_files.connect &&
            Array.isArray(dirty_files.connect)
          ) {
            // Files = Files.concat(dirty_files.connect);
            Files = Files.concat(
              dirty_files.connect.map((n) => ({
                connect: {
                  id: n.id,
                },
              }))
            )
          }

          return Files.map((n, index) => {
            let item = null

            const { id, path, connect } = n

            const src = path

            if (connect && typeof connect === 'object') {
              const { id: newFileId } = connect

              if (newFileId) {
                const query = gql`
                  query file($where: FileWhereUniqueInput!) {
                    object: file(where: $where) {
                      ...file
                    }
                  }

                  fragment file on File {
                    id
                    path
                  }
                `

                item = (
                  <Query
                    key={id || index}
                    query={query}
                    variables={{
                      where: {
                        id: newFileId,
                      },
                    }}
                  >
                    {({ data }) => {
                      const { path } = (data && data.object) || {}

                      return path ? (
                        <Image key={id || index} src={path} />
                      ) : null
                    }}
                  </Query>
                )
              }
            }

            if (src) {
              item = <Image key={id || index} src={src} />
            }

            return item
          }).filter((n) => n)
        }}
      </EditableObjectContext.Consumer>
    )
  }
}

export default GalleryFiles
