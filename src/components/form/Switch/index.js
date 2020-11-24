/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Fragment } from 'react';

import Typography from 'material-ui/Typography';
import MuiSwitch from 'material-ui/Switch';
import { FormControlLabel, FormHelperText } from 'material-ui/Form';

import EditorComponent from '../../../EditorComponent';
import { EditableObjectContext } from '../../../context';


/**
 * Этот компонент надо будет переработать (как и в целом механизм с EditableObject).
 * Дело в том, что для редактируемых объектов и обычных объектов используются разные контаксты,
 * что значительно усложняет логику. Приходится смотреть и один и другой тип объектов.
 * Сейчас сделано только под редактируемые объекты (ибо с ними более обширная логика, нежели просто на чтение).
 */

export class Switch extends EditorComponent {

  static Name = 'Switch';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    name: undefined,
    label: undefined,
    helperText: undefined,
    disabled: false,
    color: 'primary',
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
        Switch
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  canBeParent(parent) {

    return super.canBeParent(parent);
  }


  canBeChild(child) {

    return super.canBeChild(child);
  }


  renderChildren() {

    // const {
    // } = this.context;

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      name,
      label,
      helperText,
      disabled,
      can_be_edited,
      components,
      contentEditable,
      data,
      hide_wrapper_in_default_mode,
      lang,
      object: componentObject,
      page_title,
      props,
      render_badge,
      src,
      // style,
      tag,
      ...other
    } = this.getComponentProps(this);

    // return super.renderChildren();


    return <EditableObjectContext.Consumer
      key="Switch"
    >
      {editableObjectContext => {

        const {
          getObjectWithMutations,
          inEditMode: objectInEditMode,
          updateObject,
          fieldErrors,
        } = editableObjectContext;

        if (!getObjectWithMutations) {
          return null;
        }

        if (!name) {

          if (inEditMode) {
            return <Typography
              color="error"
            >
              name property is required
            </Typography>
          }
          else {
            return null;
          }
        }

        const {
          [name]: value,
        } = getObjectWithMutations();

        let error = false;
        let helperTextOutput = helperText;

        const {
          [name]: errorText,
        } = fieldErrors || {};

        if (errorText) {
          error = true;
          helperTextOutput = errorText;
        }


        const output = <Fragment>
          <FormControlLabel
            control={
              <MuiSwitch
                {...other}
                checked={value === true}
                // eslint-disable-next-line react/jsx-no-bind
                onChange={(event, checked) => {
                  return updateObject({
                    [name]: checked,
                  });
                }}
                name={name}
                disabled={disabled || !objectInEditMode}
              />
            }
            label={label}
          />
          {helperTextOutput
            ? <FormHelperText
              error={error}
            >
              {helperTextOutput}
            </FormHelperText>
            : null
          }
        </Fragment>;

        return output;
      }}
    </EditableObjectContext.Consumer>
  }

}

export default Switch;