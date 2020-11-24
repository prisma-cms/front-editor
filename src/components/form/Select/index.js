import React from 'react';

import Typography from "material-ui/Typography";
import SelectMui from "material-ui/Select";
import MenuItem from 'material-ui/Menu/MenuItem';
import FormControl from 'material-ui/Form/FormControl';
import InputLabel from 'material-ui/Input/InputLabel';
import FormHelperText from 'material-ui/Form/FormHelperText';

import Iterable from '../../Connectors/Connector/ListView/Iterable';
import { EditableObjectContext } from '../../../context';

export class Select extends Iterable {

  static Name = 'Select';

  static defaultProps = {
    ...Iterable.defaultProps,
    hide_wrapper_in_default_mode: true,
    helperText: undefined,
    label: undefined,
    style: {
      ...Iterable.defaultProps.style,
      minWidth: 200,
    },
    fullWidth: false,

    /**
     * В обычном режиме возвращает текстовое значение, а не селект
     */
    return_text_in_default_mode: true,

    /**
     * Если да, то при обновлении будет устанавливаться связь через {connect: {id: ...}}
     */
    new_object_connect: false,
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
      return_text_in_default_mode,
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
          inEditMode: objectInEditMode,
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


        let output = null;

        if (!objectInEditMode && return_text_in_default_mode) {

          const item = items ? items.find(n => n.id === value) : null;

          if (item) {

            const {
              id: itemId,
              name,
              label,
            } = item;

            output = label || name || itemId;

          }


        }
        else {

          output = getEditor({
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
                  // eslint-disable-next-line react/jsx-no-bind
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

        }

        return output;

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

    return value && typeof value === "object" ? (
      value.connect && typeof value.connect === "object"
        ? value.connect.id
        : value.id !== undefined ? value.id : value
    ) : value;

  }


  onSelectChange(event, editableObjectContext) {

    const {
      updateObject,
    } = editableObjectContext;

    const {
      new_object_connect,
    } = this.getComponentProps(this);

    const {
      name,
      value,
    } = event.target;


    let data;

    if (new_object_connect) {
      data = {
        [name]: {
          connect: {
            id: value,
          },
        },
      };
    }
    else {
      data = {
        [name]: value,
      };
    }

    return updateObject(data);

  }


  renderItem(item) {

    const {
      id,
      name,
      label,
    } = item;

    return <MenuItem
      value={id}
    >
      {label || name}
    </MenuItem>
  }

}

export default Select;