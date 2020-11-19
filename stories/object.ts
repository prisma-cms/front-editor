import { EditorComponentObject } from '../src/components/App/components/interfaces'

const object: EditorComponentObject = {
  name: 'Query',
  props: {
    query:
      'query resourcesConnection(\n  $first:Int\n  $skip:Int\n  $where:  ResourceWhereInput\n  $orderBy:  ResourceOrderByInput\n){\n  objectsConnection: resourcesConnection(\n    orderBy: $orderBy\n    first: $first\n    skip: $skip\n    where: $where\n  ){\n    aggregate{\n      count\n    }\n    edges{\n      node{\n        ...topic\n        CreatedBy{\n      \t\t...user\n        }\n        Comments(\n          orderBy: id_ASC\n        ){\n          id\n          updatedAt\n          CreatedBy{\n            ...user\n          }\n        }\n        Blog{\n          id\n          name\n          longtitle\n          uri\n        }\n        Tags{\n          Tag{\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n}\n\nfragment topic on Resource @prismaCmsFragmentAllFields {\n  id\n}\n\nfragment user on User @prismaCmsFragmentAllFields {\n  id\n}',
  },
  components: [
    {
      name: 'Connector',
      props: {
        first: 12,
        filtersname: 'filters',
        where: {
          type: 'Topic',
        },
        orderBy: 'updatedAt_DESC',
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
                            to: '/add-topic.html',
                          },
                          components: [
                            {
                              name: 'Button',
                              props: {
                                color: 'primary',
                                // size: 'small',
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
                                        text: 'Добавить публикацию',
                                      },
                                      components: [],
                                    },
                                  ],
                                  component: 'Tag',
                                },
                              ],
                              component: 'Button',
                            },
                          ],
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
                  name: 'TopicsPage',
                  props: {},
                  components: [],
                  component: 'TopicsPage',
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
