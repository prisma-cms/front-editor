import { EditorComponentObject } from '../../../src/EditorComponent'

const object: EditorComponentObject = {
  name: 'Section',
  component: 'Section',
  props: {},
  components: [
    {
      name: 'Section',
      component: 'Section',
      props: {
        children: 'Some text',
      },
      components: [],
    },
  ],
}

export default object
