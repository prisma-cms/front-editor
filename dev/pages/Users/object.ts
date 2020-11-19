import { EditorComponentObject } from '../../../src/components/App/components/interfaces'

const object: EditorComponentObject = {
  name: 'Query',
  props: {
    query:
      'query technologiesConnection (\n  $first:Int = 10\n  $skip:Int\n  $where: TechnologyWhereInput\n  $orderBy: TechnologyOrderByInput\n){\n  objectsConnection: technologiesConnection (\n    first: $first\n    skip: $skip\n    where:$where\n    orderBy: $orderBy\n  ){\n    aggregate{\n      count\n    }\n    edges{\n      node{\n        ...technology\n        CreatedBy{\n          ...user\n        }\n        UserTechnologies {\n          ...userTechnology\n          CreatedBy{\n            ...user\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment technology on Technology @prismaCmsFragmentAllFields {\n  id\n}\n\nfragment user on User @prismaCmsFragmentAllFields {\n  id\n}\n\nfragment userTechnology on UserTechnology @prismaCmsFragmentAllFields{\n  id\n}',
  },
  components: [
    {
      name: 'Connector',
      props: {
        first: 10,
        filtersname: 'filters',
      },
      components: [
        {
          name: 'Grid',
          component: 'Grid',
          props: {
            container: true,
            spacing: 8,
          },
          components: [
            {
              name: 'Grid',
              component: 'Grid',
              props: {
                item: true,
                xs: 12,
              },
              components: [
                {
                  name: 'Grid',
                  props: {
                    container: true,
                    spacing: 8,
                    alignItems: 'center',
                  },
                  components: [
                    {
                      name: 'Grid',
                      props: {
                        spacing: 0,
                        xs: true,
                        item: true,
                      },
                      components: [
                        {
                          name: 'Filters',
                          props: {},
                          components: [],
                          component: 'Filters',
                        },
                      ],
                      component: 'Grid',
                    },
                    {
                      name: 'Grid',
                      props: {
                        spacing: 0,
                        item: true,
                      },
                      components: [
                        {
                          name: 'CreateObjectLink',
                          props: {
                            to: '/technologies/create/',
                          },
                          components: [],
                          component: 'CreateObjectLink',
                        },
                      ],
                      component: 'Grid',
                    },
                  ],
                  component: 'Grid',
                },
              ],
            },
            {
              name: 'Grid',
              component: 'Grid',
              props: {
                item: true,
                xs: 12,
              },
              components: [
                {
                  name: 'Table',
                  props: {
                    className: 'prisma-cms bordered',
                  },
                  components: [
                    {
                      name: 'TableRow',
                      props: {},
                      components: [
                        {
                          name: 'TableCell',
                          props: {
                            tag: 'th',
                            style: {
                              paddingTop: '5px',
                              paddingBottom: '5px',
                            },
                          },
                          components: [
                            {
                              name: 'Tag',
                              props: {
                                tag: 'span',
                              },
                              components: [
                                {
                                  name: 'HtmlTag',
                                  component: 'HtmlTag',
                                  props: {
                                    text: 'Технология',
                                  },
                                  components: [],
                                },
                              ],
                              component: 'Tag',
                            },
                          ],
                          component: 'TableCell',
                        },
                        {
                          name: 'TableCell',
                          props: {
                            tag: 'th',
                          },
                          components: [
                            {
                              name: 'Tag',
                              props: {
                                tag: 'span',
                              },
                              components: [
                                {
                                  name: 'HtmlTag',
                                  component: 'HtmlTag',
                                  props: {
                                    text: 'Кем добавлена',
                                  },
                                  components: [],
                                },
                              ],
                              component: 'Tag',
                            },
                          ],
                          component: 'TableCell',
                        },
                        {
                          name: 'TableCell',
                          props: {
                            tag: 'th',
                          },
                          components: [
                            {
                              name: 'Tag',
                              props: {
                                tag: 'span',
                              },
                              components: [
                                {
                                  name: 'HtmlTag',
                                  component: 'HtmlTag',
                                  props: {
                                    text: 'Кто использует',
                                  },
                                  components: [],
                                },
                              ],
                              component: 'Tag',
                            },
                          ],
                          component: 'TableCell',
                        },
                        {
                          name: 'TableCell',
                          props: {
                            style: {
                              width: '60px',
                            },
                          },
                          components: [],
                          component: 'TableCell',
                        },
                      ],
                      component: 'TableRow',
                    },
                    {
                      name: 'ListView',
                      props: {},
                      components: [
                        {
                          name: 'TableRow',
                          props: {},
                          components: [
                            {
                              name: 'TableCell',
                              props: {},
                              components: [
                                {
                                  name: 'Link',
                                  props: {
                                    to: '/technologies/:id/',
                                  },
                                  components: [
                                    {
                                      name: 'NamedField',
                                      props: {
                                        name: 'name',
                                      },
                                      components: [],
                                      component: 'NamedField',
                                    },
                                  ],
                                  component: 'Link',
                                },
                                {
                                  name: 'Typography',
                                  props: {
                                    display: 'block',
                                    variant: 'caption',
                                    displayType: 'div',
                                  },
                                  components: [
                                    {
                                      name: 'NamedField',
                                      props: {
                                        name: 'description',
                                      },
                                      components: [],
                                      component: 'NamedField',
                                    },
                                  ],
                                  component: 'Typography',
                                },
                              ],
                              component: 'TableCell',
                            },
                            {
                              name: 'TableCell',
                              props: {},
                              components: [
                                {
                                  name: 'CreatedBy',
                                  props: {},
                                  components: [],
                                  component: 'CreatedBy',
                                },
                              ],
                              component: 'TableCell',
                            },
                            {
                              name: 'TableCell',
                              props: {},
                              components: [
                                {
                                  name: 'NamedField',
                                  props: {
                                    tag: 'div',
                                    name: 'UserTechnologies',
                                    hide_wrapper_in_default_mode: false,
                                    style: {
                                      display: 'flex',
                                      flexWrap: 'wrap',
                                      alignItems: 'center',
                                    },
                                  },
                                  components: [
                                    {
                                      id: 'ck1eygzwb0nvh09587hhglxl2',
                                      name: 'WhoUsed',
                                      component: 'ListView',
                                      props: {},
                                      components: [],
                                    },
                                  ],
                                  component: 'NamedField',
                                },
                              ],
                              component: 'TableCell',
                            },
                            // {
                            //   "name": "TableCell",
                            //   "props": {
                            //     "style": {}
                            //   },
                            //   "components": [
                            //     {
                            //       "name": "JoinUserTechnologyButton",
                            //       "props": {},
                            //       "components": [],
                            //       "component": "JoinUserTechnologyButton"
                            //     }
                            //   ],
                            //   "component": "TableCell"
                            // }
                          ],
                          component: 'TableRow',
                        },
                      ],
                      component: 'ListView',
                    },
                  ],
                  component: 'Table',
                },
              ],
            },
            {
              name: 'Grid',
              component: 'Grid',
              props: {
                item: true,
                xs: 12,
              },
              components: [
                {
                  name: 'Pagination',
                  component: 'Pagination',
                  props: {},
                  components: [],
                },
              ],
            },
          ],
        },
      ],
      component: 'Connector',
    },
  ],
  component: 'Query',
}

export default object
