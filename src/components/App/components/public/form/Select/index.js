import React from 'react';

import Typography from "material-ui/Typography";
import SelectMui from "material-ui/Select";
import MenuItem from 'material-ui/Menu/MenuItem';
import FormControl from 'material-ui/Form/FormControl';
import InputLabel from 'material-ui/Input/InputLabel';
import FormHelperText from 'material-ui/Form/FormHelperText';

import Iterable from '../../Connectors/Connector/ListView/Iterable';
import { EditableObjectContext } from '../../../../context';

export class Select extends Iterable {

  static Name = 'Select';

  static defaultProps = {
    ...Iterable.defaultProps,
    hide_wrapper_in_default_mode: true,
    helperText: undefined,
    label: undefined,
    style: {
      ...Iterable.defaultProps.style,
      minWidth: 150,
    },
    fullWidth: false,
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
        Select
      </div>
    );
  }


  renderItems(items, children) {

    const {
      inEditMode,
    } = this.getEditorContext();

    const {
      name,
      helperText,
      label,
      style,
      fullWidth,
    } = this.getComponentProps(this);

    if (!name) {


      if (inEditMode) {
        return <Typography
          color="error"
        >
          `name` property required
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
          getEditor,
        } = editableObjectContext;

        if (!getObjectWithMutations) {

          if (inEditMode) {
            return <Typography
              color="error"
            >
              editableObjectContext required
            </Typography>
          }
          else {
            return null;
          }

        }

        if (!getEditor) {

          if (inEditMode) {
            return <Typography
              color="error"
            >
              getEditor required
            </Typography>
          }
          else {
            return null;
          }

        }

        const value = this.getValue(name, editableObjectContext);

        return getEditor({
          name,
          value,
          helperText,
          label,
          fullWidth,
          Editor: props => {

            const {
              error = false,
              helperText,
              label,
              fullWidth,
            } = props;

            return <FormControl
              error={error}
              style={style}
              fullWidth={fullWidth}
            >
              <InputLabel>
                {label}
              </InputLabel>

              <SelectMui
                name={name}
                value={value || ""}
                onChange={event => {
                  this.onSelectChange(event, editableObjectContext);
                }}
                error={error}
              >
                {super.renderItems(items, children)}
              </SelectMui>
              <FormHelperText>{helperText}</FormHelperText>
            </FormControl>
          },
        });



      }}
    </EditableObjectContext.Consumer>;

  }


  getValue(name, editableObjectContext) {

    const {
      getObjectWithMutations,
    } = editableObjectContext;

    const {
      [name]: value,
    } = getObjectWithMutations() || {};

    return value && typeof value === "object" && value.id !== undefined ? value.id : value;

  }


  onSelectChange(event, editableObjectContext) {

    const {
      updateObject,
    } = editableObjectContext;

    const {
      name,
      value,
    } = event.target;

    return updateObject({
      [name]: value,
    });

  }


  renderItem(item, key, children) {

    const {
      id,
      name,
    } = item;

    return <MenuItem
      value={id}
    >
      {name}
    </MenuItem>
  }

}

export default Select;