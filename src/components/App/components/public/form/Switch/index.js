import React, { Fragment } from 'react';

import Typography from 'material-ui/Typography';
import MuiSwitch from 'material-ui/Switch';
import { FormControlLabel, FormHelperText } from 'material-ui/Form';

import EditorComponent from '../../..';
import { EditableObjectContext } from '../../../../context';


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
      // ...other
    } = this.getComponentProps(this);

    // return super.renderChildren();


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

    return <EditableObjectContext.Consumer>
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


        let output = <Fragment>
          <FormControlLabel
            control={
              <MuiSwitch
                checked={value === true}
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