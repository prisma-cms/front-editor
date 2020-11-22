import { EditorComponentObject } from '../../../src/components/App/components/interfaces'

const object: EditorComponentObject = {
  "name": "Section",
  "props": {},
  "components": [
    {
      "name": "Section",
      "props": {},
      "components": [
        {
          "name": "Grid",
          "props": {
            "container": true,
            "spacing": 0
          },
          "components": [
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [
                {
                  "name": "Tag",
                  "props": {
                    "tag": "span",
                    "style": {
                      "color": "blue"
                    }
                  },
                  "components": [
                    {
                      "name": "HtmlTag",
                      "component": "HtmlTag",
                      "props": {
                        "text": "Grid"
                      },
                      "components": []
                    }
                  ],
                  "component": "Tag"
                }
              ],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [
                {
                  "name": "UserLink",
                  "props": {},
                  "components": [],
                  "component": "UserLink"
                },
                {
                  "name": "CurrentUser",
                  "props": {},
                  "components": [],
                  "component": "CurrentUser"
                }
              ],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [
                {
                  "name": "Link",
                  "props": {
                    "to": "https://prisma-cms.com"
                  },
                  "components": [
                    {
                      "name": "Tag",
                      "props": {
                        "tag": "span"
                      },
                      "components": [
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "text": "prisma-cms.com"
                          },
                          "components": []
                        }
                      ],
                      "component": "Tag"
                    }
                  ],
                  "component": "Link"
                }
              ],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [
                {
                  "name": "Button",
                  "props": {},
                  "components": [
                    {
                      "name": "Tag",
                      "props": {
                        "tag": "span"
                      },
                      "components": [
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "text": "Button"
                          },
                          "components": []
                        }
                      ],
                      "component": "Tag"
                    }
                  ],
                  "component": "Button"
                }
              ],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "sm": 6,
                "md": 4,
                "lg": 3,
                "xl": 2,
                "item": true
              },
              "components": [],
              "component": "Grid"
            },
            {
              "name": "Grid",
              "props": {
                "spacing": 0,
                "xs": 12,
                "item": true
              },
              "components": [
                {
                  "name": "AppBar",
                  "props": {},
                  "components": [],
                  "component": "AppBar"
                }
              ],
              "component": "Grid"
            }
          ],
          "component": "Grid"
        }
      ],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [
        {
          "name": "Typography",
          "props": {
            "text": "Typography"
          },
          "components": [],
          "component": "Typography"
        }
      ],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [
        {
          "name": "EditableObject",
          "props": {
            "_dirty": {
              "name": "EditableObject in edit mode"
            }
          },
          "components": [
            {
              "name": "EditableView",
              "props": {},
              "components": [
                {
                  "name": "TextField",
                  "props": {
                    "name": "name",
                    "fullWidth": true
                  },
                  "components": [],
                  "component": "TextField"
                },
                {
                  "name": "Section",
                  "props": {},
                  "components": [
                    {
                      "name": "FileUploader",
                      "props": {
                        "name": "name"
                      },
                      "components": [],
                      "component": "FileUploader"
                    }
                  ],
                  "component": "Section"
                },
                {
                  "name": "Section",
                  "props": {},
                  "components": [
                    {
                      "name": "RichText",
                      "props": {},
                      "components": [],
                      "component": "RichText"
                    }
                  ],
                  "component": "Section"
                }
              ],
              "component": "EditableView"
            },
            {
              "name": "EditableObjectButtons",
              "props": {},
              "components": [],
              "component": "EditableObjectButtons"
            },
            {
              "name": "CreatedBy",
              "props": {},
              "components": [],
              "component": "CreatedBy"
            },
            {
              "name": "ResourceFields",
              "props": {},
              "components": [],
              "component": "ResourceFields"
            },
            {
              "name": "Section",
              "props": {},
              "components": [
                {
                  "name": "Content",
                  "props": {},
                  "components": [],
                  "component": "Content"
                }
              ],
              "component": "Section"
            },
            {
              "name": "Section",
              "props": {},
              "components": [
                {
                  "name": "ContentEditor",
                  "props": {},
                  "components": [
                    {
                      "name": "HtmlTag",
                      "component": "HtmlTag",
                      "props": {
                        "name": "HtmlTag",
                        "tag": "p",
                        "className": ""
                      },
                      "components": [
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "text": "Content "
                          },
                          "components": []
                        },
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "tag": "i"
                          },
                          "components": [
                            {
                              "name": "HtmlTag",
                              "component": "HtmlTag",
                              "props": {
                                "text": "editor"
                              },
                              "components": []
                            }
                          ]
                        },
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "text": " text"
                          },
                          "components": []
                        }
                      ]
                    }
                  ],
                  "component": "ContentEditor"
                }
              ],
              "component": "Section"
            },
            {
              "name": "Grid",
              "props": {
                "container": true,
                "spacing": 0
              },
              "components": [
                {
                  "name": "Grid",
                  "props": {
                    "spacing": 0,
                    "xs": 12,
                    "sm": 6,
                    "md": 4,
                    "lg": 3,
                    "xl": 2,
                    "item": true
                  },
                  "components": [
                    {
                      "name": "Switch",
                      "props": {
                        "name": "switch"
                      },
                      "components": [],
                      "component": "Switch"
                    }
                  ],
                  "component": "Grid"
                },
                {
                  "name": "Grid",
                  "props": {
                    "spacing": 0,
                    "xs": 12,
                    "sm": 6,
                    "md": 4,
                    "lg": 3,
                    "xl": 2,
                    "item": true
                  },
                  "components": [],
                  "component": "Grid"
                },
                {
                  "name": "Grid",
                  "props": {
                    "spacing": 0,
                    "xs": 12,
                    "sm": 6,
                    "md": 4,
                    "lg": 3,
                    "xl": 2,
                    "item": true
                  },
                  "components": [],
                  "component": "Grid"
                }
              ],
              "component": "Grid"
            }
          ],
          "component": "EditableObject"
        }
      ],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [
        {
          "name": "ResetObjectContext",
          "component": "ResetObjectContext",
          "props": {
            "object": {
              "id": "test-id",
              "name": "EditableObject in default mode with id"
            }
          },
          "components": [
            {
              "name": "EditableObject",
              "props": {},
              "components": [
                {
                  "name": "DefaultView",
                  "props": {},
                  "components": [
                    {
                      "name": "NamedField",
                      "props": {
                        "name": "name"
                      },
                      "components": [],
                      "component": "NamedField"
                    }
                  ],
                  "component": "DefaultView"
                }
              ],
              "component": "EditableObject"
            }
          ]
        }
      ],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [
        {
          "name": "Table",
          "props": {},
          "components": [
            {
              "name": "TableRow",
              "props": {},
              "components": [
                {
                  "name": "TableCell",
                  "props": {
                    "tag": "th"
                  },
                  "components": [
                    {
                      "name": "Tag",
                      "props": {
                        "tag": "span"
                      },
                      "components": [
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "text": "TH"
                          },
                          "components": []
                        }
                      ],
                      "component": "Tag"
                    }
                  ],
                  "component": "TableCell"
                },
                {
                  "name": "TableCell",
                  "props": {},
                  "components": [
                    {
                      "name": "Tag",
                      "props": {
                        "tag": "span"
                      },
                      "components": [
                        {
                          "name": "HtmlTag",
                          "component": "HtmlTag",
                          "props": {
                            "text": "TD"
                          },
                          "components": []
                        }
                      ],
                      "component": "Tag"
                    }
                  ],
                  "component": "TableCell"
                },
                {
                  "name": "TableCell",
                  "props": {},
                  "components": [],
                  "component": "TableCell"
                }
              ],
              "component": "TableRow"
            }
          ],
          "component": "Table"
        }
      ],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [],
      "component": "Section"
    },
    {
      "name": "Section",
      "props": {},
      "components": [
        {
          "name": "Tag",
          "props": {
            "tag": "span"
          },
          "components": [
            {
              "name": "HtmlTag",
              "component": "HtmlTag",
              "props": {
                "text": "Tag"
              },
              "components": []
            }
          ],
          "component": "Tag"
        }
      ],
      "component": "Section"
    }
  ],
  "component": "Section"
}

export default object
