import React, { Fragment } from 'react';

import Typography from 'material-ui/Typography';
import EditorComponent from '../..';
import { EditableObjectContext } from '../../../context';



export class FileUploader extends EditorComponent {

  static Name = 'FileUploader';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    label: undefined,
    helperText: undefined,
    directory: undefined,
    filename_as_name: false,
    accept: undefined,
    multiple: false,
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        FileUploader
      </div>
    );
  }


  prepareRootElementProps(props) {

    let {
      filename_as_name,
      ...other
    } = super.prepareRootElementProps(props);

    return other;
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    // return super.canBeChild(child);
    return false;
  }


  renderChildren() {

    const {
      name,
      accept,
      directory,
      filename_as_name,
      multiple,
      ...other
    } = this.getComponentProps(this);


    const {
      inEditMode,
    } = this.getEditorContext();

    if (!name) {

      if (inEditMode) {
        return <Typography
          color="error"
        >
          Property "name" required
        </Typography>
      }
      else {
        return null;
      }

    }

    return <EditableObjectContext.Consumer
      key="editableobject_context"
    >
      {editableObjectContext => {

        const {
          getEditor,
          updateObject,
        } = editableObjectContext;


        if (!updateObject) {
          if (inEditMode) {
            return <Typography
              color="error"
            >
              updateObject method required
            </Typography>
          }
          else {
            return null;
          }
        }

        return getEditor ? getEditor({
          ...this.getComponentProps(this),
          Editor: (props) => {

            const {
              label,
              error,
              // errors,
              // helperText,
              // onChange,
            } = props;


            return <Fragment>

              {label ?
                <Typography
                  color={error ? "error" : "textSecondary"}
                >
                  {label}
                </Typography>
                : null
              }

              {this.renderUploader({
                accept,
                directory,
                multiple,
                onUpload: (result) => {

                  if (!result) {
                    return;
                  }

                  let data;

                  if (Array.isArray(result)) {

                    data = {
                      [name]: {
                        connect: result.map(n => ({
                          id: n.id,
                        })),
                      },
                    };

                  }
                  else {

                    const {
                      id,
                      path,
                    } = result;

                    if (filename_as_name) {
                      data = {
                        [name]: path,
                      };
                    }
                    else {
                      data = {
                        [name]: {
                          connect: {
                            id,
                          },
                        },
                      };
                    }

                  }


                  updateObject(data);

                },
                ...other,
              })}

              {/* {helperText ?
                <Typography
                  variant="caption"
                  color={error ? "error" : undefined}
                >
                  {helperText}
                </Typography>
                : null
              } */}

            </Fragment>

          },
          onChange: () => {
          },
        }) : super.renderChildren();


      }}
    </EditableObjectContext.Consumer>

  }

}

export default FileUploader;