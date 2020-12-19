import ContentEditor from '../..'
import Section from '../../../Section'
import HtmlTag from '../../../Tag/HtmlTag'
import Typography from '../../../Typography'
import { registerComponents } from '../../../..'

export const Components = [Section, ContentEditor, HtmlTag, Typography]

export const initLayout = registerComponents(Components)

export const object = initLayout({
  id: 'test-content-editor',
  name: 'Section',
  props: {},
  components: [
    {
      name: 'ContentEditor',
      component: 'ContentEditor',
      props: {
        className: 'ContentEditor',
      },
      components: [
        {
          name: 'Section',
          component: 'Section',
          props: {
            id: 'Section',
          },
          components: [
            {
              name: 'HtmlTag',
              component: 'HtmlTag',
              props: {
                name: 'HtmlTag',
                tag: 'div',
                className: 'HtmlTag',
              },
              components: [
                {
                  name: 'Section',
                  component: 'Section',
                  props: {},
                  components: [],
                },
              ],
            },
          ],
        },
        {
          name: 'HtmlTag',
          component: 'HtmlTag',
          props: {
            name: 'HtmlTag',
            tag: 'div',
            id: 'HtmlTag',
          },
          components: [
            {
              name: 'Section',
              component: 'Section',
              props: {
                className: 's1',
              },
              components: [
                {
                  name: 'HtmlTag',
                  component: 'HtmlTag',
                  props: {
                    name: 'HtmlTag',
                    tag: 'div',
                    className: 'h1',
                  },
                  components: [
                    {
                      name: 'Section',
                      component: 'Section',
                      props: {
                        className: 's2',
                      },
                      components: [
                        {
                          name: 'HtmlTag',
                          component: 'HtmlTag',
                          props: {
                            tag: 'div',
                            className: 'h2',
                          },
                          components: [
                            {
                              name: 'HtmlTag',
                              component: 'HtmlTag',
                              props: {
                                text: 'text',
                              },
                              components: [],
                            },
                          ],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
        {
          name: 'HtmlTag',
          component: 'HtmlTag',
          props: {
            name: 'HtmlTag',
            tag: 'div',
            className: '',
          },
          components: [
            {
              name: 'HtmlTag',
              component: 'HtmlTag',
              props: {
                text: 'text',
              },
              components: [],
            },
            {
              name: 'HtmlTag',
              component: 'HtmlTag',
              props: {
                tag: 'br',
              },
              components: [],
            },
          ],
        },
      ],
    },
  ],
  component: 'Section',
})
