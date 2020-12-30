import React, { useCallback, useState } from 'react'
import Head from 'next/head'
import App, { registerComponents } from '../../../src'
import Section from '../../../src/components/Section'
import ContentEditor from '../../../src/components/ContentEditor'
import HtmlTag from '../../../src/components/Tag/HtmlTag'
import Switch from 'material-ui/Switch'
import { FlexContainer } from '../styles/FlexContainer'
import Typography from '../../../src/components/Typography'

const createTemplate = async () => {
  console.error('called createTemplate')
  return new Error('called createTemplate')
}

const updateTemplate = async () => {
  console.error('called updateTemplate')
  return new Error('called updateTemplate')
}

const Components = [Section, ContentEditor, HtmlTag, Typography]

export const initLayout = registerComponents(Components)

const object = initLayout({
  id: 'test-content-editor',
  name: 'Section',
  props: {},
  components: [
    {
      name: 'ContentEditor',
      component: 'ContentEditor',
      props: {
        experimental: 'true',
      },
      components: [
        {
          name: 'HtmlTag',
          component: 'HtmlTag',
          props: {
            name: 'HtmlTag',
            tag: 'div',
            className: '',
            id: 'HtmlTagRootElement',
          },
          components: [
            {
              name: 'Section',
              component: 'Section',
              props: {},
              components: [
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
                    text: 'text eeeeere',
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
        // {
        //   name: 'HtmlTag',
        //   component: 'HtmlTag',
        //   props: {
        //     name: 'HtmlTag',
        //     tag: 'div',
        //     className: '',
        //   },
        //   components: [
        //     {
        //       name: 'HtmlTag',
        //       component: 'HtmlTag',
        //       props: {
        //         text: 'text',
        //       },
        //       components: [],
        //     },
        //     {
        //       name: 'HtmlTag',
        //       component: 'HtmlTag',
        //       props: {
        //         tag: 'br',
        //       },
        //       components: [],
        //     },
        //   ],
        // },
        //   {
        //     name: 'HtmlTag',
        //     component: 'HtmlTag',
        //     props: {
        //       name: 'HtmlTag',
        //       tag: 'p',
        //       className: '',
        //     },
        //     components: [
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'b',
        //         },
        //         components: [
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               text: 'Content',
        //             },
        //             components: [],
        //           },
        //         ],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: ' ',
        //         },
        //         components: [],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'i',
        //         },
        //         components: [
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               text: 'editor',
        //             },
        //             components: [],
        //           },
        //         ],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: ' ',
        //         },
        //         components: [],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'u',
        //         },
        //         components: [
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               text: 'text ',
        //             },
        //             components: [],
        //           },
        //         ],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: 'sdfdsf ',
        //         },
        //         components: [],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'strike',
        //         },
        //         components: [
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               text: 'dsfsdf',
        //             },
        //             components: [],
        //           },
        //         ],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: ' sd',
        //         },
        //         components: [],
        //       },
        //     ],
        //   },
        //   {
        //     name: 'HtmlTag',
        //     component: 'HtmlTag',
        //     props: {
        //       name: 'HtmlTag',
        //       tag: 'div',
        //       className: '',
        //     },
        //     components: [
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'ul',
        //         },
        //         components: [
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'li',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   text: 'sadasd',
        //                 },
        //                 components: [],
        //               },
        //             ],
        //           },
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'li',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   text: 'asd',
        //                 },
        //                 components: [],
        //               },
        //             ],
        //           },
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'ul',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   tag: 'li',
        //                 },
        //                 components: [
        //                   {
        //                     name: 'HtmlTag',
        //                     component: 'HtmlTag',
        //                     props: {
        //                       text: 'wq',
        //                     },
        //                     components: [],
        //                   },
        //                 ],
        //               },
        //             ],
        //           },
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'li',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   text: 'dqwd',
        //                 },
        //                 components: [],
        //               },
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   {
        //     name: 'HtmlTag',
        //     component: 'HtmlTag',
        //     props: {
        //       name: 'HtmlTag',
        //       tag: 'div',
        //       className: '',
        //     },
        //     components: [
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'ol',
        //         },
        //         components: [
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'li',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   text: 'dqwdqw',
        //                 },
        //                 components: [],
        //               },
        //             ],
        //           },
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'ol',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   tag: 'li',
        //                 },
        //                 components: [
        //                   {
        //                     name: 'HtmlTag',
        //                     component: 'HtmlTag',
        //                     props: {
        //                       text: 'dwq',
        //                     },
        //                     components: [],
        //                   },
        //                 ],
        //               },
        //             ],
        //           },
        //           {
        //             name: 'HtmlTag',
        //             component: 'HtmlTag',
        //             props: {
        //               tag: 'li',
        //             },
        //             components: [
        //               {
        //                 name: 'HtmlTag',
        //                 component: 'HtmlTag',
        //                 props: {
        //                   text: 'dqw',
        //                 },
        //                 components: [],
        //               },
        //             ],
        //           },
        //         ],
        //       },
        //     ],
        //   },
        //   {
        //     name: 'HtmlTag',
        //     component: 'HtmlTag',
        //     props: {
        //       name: 'HtmlTag',
        //       tag: 'p',
        //       className: '',
        //     },
        //     components: [
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: 'dq ',
        //         },
        //         components: [],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: 'rwerwerwer',
        //         },
        //         components: [],
        //       },
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           text: ' wer werwe',
        //         },
        //         components: [],
        //       },
        //     ],
        //   },
        //   {
        //     name: 'HtmlTag',
        //     component: 'HtmlTag',
        //     props: {
        //       name: 'HtmlTag',
        //       tag: 'p',
        //       className: '',
        //     },
        //     components: [
        //       {
        //         name: 'HtmlTag',
        //         component: 'HtmlTag',
        //         props: {
        //           tag: 'br',
        //         },
        //         components: [],
        //       },
        //     ],
        //   },
      ],
    },
  ],
  component: 'Section',
})

const ContentEditorPage: React.FC = (props) => {
  const [inEditMode, setInEditMode] = useState(true)

  const onChange = useCallback(() => setInEditMode(!inEditMode), [inEditMode])

  return (
    <>
      <Head>
        <title>@prisma-cms/front-editor ContentEditor</title>
        <meta
          name="description"
          content="Component boilerplate for prisma-cms"
        />
      </Head>
      <FlexContainer>
        <div>
          <Switch checked={inEditMode} onChange={onChange} /> Selected
        </div>
        <App
          {...props}
          object={object}
          createTemplate={createTemplate}
          updateTemplate={updateTemplate}
          inEditMode={inEditMode}
          Components={Components}
        />
      </FlexContainer>
    </>
  )
}

export default ContentEditorPage
