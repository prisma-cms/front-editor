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
      components: [
        {
          name: 'Section',
          props: {},
          components: [],
          component: 'Section',
        },
        {
          id: 'section_2',
          name: 'Section',
          props: {},
          components: [],
          component: 'Section',
        },
      ],
    },
  ],
}

export default object
