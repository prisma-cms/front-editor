import React, { Fragment } from 'react';
import PropTypes from "prop-types";

import Typography from 'material-ui/Typography';
import EditorComponent from '../..';
import { EditableObjectContext } from '../../../context';



export class FileUploader extends EditorComponent {

  static Name = 'FileUploader';

  static propTypes = {
    // eslint-disable-next-line react/forbid-foreign-prop-types
    ...EditorComponent.propTypes,
    label: PropTypes.string,
    helperText: PropTypes.string,
    directory: PropTypes.string,
    filename_as_name: PropTypes.bool.isRequired,
    multiple: PropTypes.bool.isRequired,
    // new_object_connect: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    ...EditorComponent.defaultProps,
    label: undefined,
    helperText: undefined,
    directory: undefined,
    filename_as_name: false,
    accept: undefined,
    multiple: false,

    // /**
    //  * Если да, то при обновлении будет устанавливаться связь через {connect: {id: ...}}
    //  */
    // new_object_connect: false,
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

    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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


  canBeChild() {

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
          getObjectWithMutations,
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

                    const {
                      [name]: field,
                    } = getObjectWithMutations();

                    const {
                      connect,
                    } = field || {};

                    data = {
                      [name]: {
                        connect: (connect ? (Array.isArray(connect) ? connect : [connect]) : []).concat(
                          result.map(n => ({
                            id: n.id,
                          }))
                        ),
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


            </Fragment>

          },
          onChange: () => {
            return;
          },
        }) : super.renderChildren();


      }}
    </EditableObjectContext.Consumer>

  }

}

export default FileUploader;