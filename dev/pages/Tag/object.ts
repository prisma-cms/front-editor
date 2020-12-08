import { EditorComponentObject } from '../../../src/EditorComponent'

const object: EditorComponentObject = {
  id: 'test-tag',
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
