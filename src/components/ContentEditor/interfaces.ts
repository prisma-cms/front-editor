import { EditorComponentObject, EditorComponentProps } from '../..'

export interface ContentEditorProps extends EditorComponentProps {
  render_toolbar?: boolean

  //   read_only: PropTypes.bool.isRequired,
  //   initialContent: PropTypes.arrayOf(
  //     PropTypes.shape({
  //       name: PropTypes.string.isRequired,
  //       component: PropTypes.string.isRequired,
  //       props: PropTypes.object.isRequired,
  //       components: PropTypes.array.isRequired,
  //     })
  //   ),
  //   TagEditor: PropTypes.func.isRequired,
  //   render_toolbar: PropTypes.bool.isRequired,

  initialContent?: EditorComponentObject[]
}
