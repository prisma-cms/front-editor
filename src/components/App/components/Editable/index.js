import React, { Fragment } from 'react'
import ReactDOM from 'react-dom';

import PropTypes from 'prop-types'

import TextField from 'material-ui/TextField';
// import Grid from 'material-ui/Grid';
import Typography from 'material-ui/Typography';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';

import EditIcon from 'material-ui-icons/ModeEdit';
import ResetIcon from 'material-ui-icons/Restore';
import Save from 'material-ui-icons/Save';

import Snackbar from 'material-ui/Snackbar';

import { CircularProgress } from 'material-ui/Progress';

import View from './PrismaComponent';

const SaveIcon = () => {

  return <Save
    style={{
      color: "red",
    }}
  />
}


export default class ObjectEditable extends View {

  static propTypes = {
    ...View.propTypes,
    mutate: PropTypes.func.isRequired,
    _dirty: PropTypes.object,
    errorDelay: PropTypes.number.isRequired,
    SaveIcon: PropTypes.func.isRequired,
    ResetIcon: PropTypes.func.isRequired,
    EditIcon: PropTypes.func.isRequired,
    cacheKey: PropTypes.string,
    cacheKeyPrefix: PropTypes.string.isRequired,
  };


  static defaultProps = {
    ...View.defaultProps,
    errorDelay: 10000,
    SaveIcon,
    ResetIcon,
    EditIcon,
    cacheKeyPrefix: "item_",
  };


  constructor(props) {

    super(props);

    const {
    } = props;

    this.state = {
      ...this.state,
      inEditMode: false,
      notifications: [],
      loading: false,
    }

  }


  componentWillMount() {

    const {
      _dirty = null,
    } = this.props;

    const cache = this.getCache();

    Object.assign(this.state, {
      _dirty: _dirty || cache ? {
        ..._dirty,
        ...cache,
      } : undefined,
    });

    return super.componentWillMount ? super.componentWillMount() : true;
  }

  getCacheKey() {

    const {
      cacheKey,
      cacheKeyPrefix,
    } = this.props;

    const {
      id,
    } = this.getObject() || {};

    return cacheKey !== undefined ? cacheKey : id ? `${cacheKeyPrefix}${id}` : null;
  }

  setCache(data) {

    const {
      localStorage,
    } = this.context;

    if (!localStorage) {
      return false;
    }

    let cacheData;

    const key = this.getCacheKey();

    if (key) {
      try {


        if (data) {
          cacheData = JSON.stringify(data);
          localStorage.setItem(key, cacheData);
        }
        else {
          localStorage.removeItem(key);
        }

      }
      catch (error) {

      }
    }

  }

  getCache() {


    const {
      localStorage,
    } = this.context;

    let cacheData;

    const key = this.getCacheKey();

    if (key && localStorage) {
      try {

        cacheData = localStorage.getItem(key);

        if (cacheData) {
          cacheData = JSON.parse(cacheData);
        }

      }
      catch (error) {

      }
    }

    // console.log("getCacheKey", cacheData);

    return cacheData;
  }

  clearCache() {

    const {
      localStorage
    } = this.context;

    const key = this.getCacheKey();

    if (key && localStorage) {
      localStorage.removeItem(key);
    }

  }




  async save() {

    const {
      _dirty,
      loading,
    } = this.state;

    const {
      client,
    } = this.context;


    if (loading) {
      return;
    }

    return new Promise((resolve, reject) => {

      this.setState({
        loading: true,
      }, async () => {


        let newState = {
          loading: false,
        };

        const result = await this.saveObject(_dirty)
          .then(async result => {



            // console.log("await this.saveObject 2", typeof result, result instanceof Error, result);

            if (result instanceof Error) {

              // console.log("await this.saveObject result", result);

            }
            else {

              const {
                data: resultData,
              } = result || {};

              const {
                response,
              } = resultData || {};

              // console.log("result", result);
              // console.log("resultData", resultData);

              let {
                success,
                message,
                errors = null,
                ...other
              } = response || {};


              Object.assign(newState, {
                errors,
              });


              if (success === undefined) {

                success = true;

              }

              if (!success) {

                this.addError(message || "Request error");

                // errors && errors.map(error => {
                //   this.addError(error);
                // });

              }
              else {

                Object.assign(newState, {
                  _dirty: null,
                  inEditMode: false,
                });

                this.clearCache();

                // await client.resetStore();
                // await client.cache.reset();
                // console.log("client.cache.clearStore");
                await client.clearStore().catch(console.error);
                await client.reFetchObservableQueries().catch(console.error);

                const {
                  onSave,
                } = this.props;

                if (onSave) {
                  onSave(result);
                }


              }


            }


            return result;
          })
          .catch(e => {
            console.error(e);
            return e;
          });


        this.setState(newState, () => {
          return resolve(result);
        });

        return;

      });

    });

  }


  async saveObject(data) {

    // const {
    //   object,
    //   saveObject,
    // } = this.props;

    // if(saveObject){
    //   return saveObject(data);
    // }

    // console.log("saveObject data", data);

    const {
      mutate,
    } = this.props;

    if (!mutate) {
      throw (new Error("Mutate not defined"));
    }

    const mutation = this.getMutation(data);

    const result = await mutate(mutation).then(r => r).catch(e => {

      // throw (e);
      return e;
    });

    // console.log("result 333", result);

    return result;

  }


  getMutation(data) {

    const variables = this.getMutationVariables(data);

    return {
      variables,
    }

  }


  getMutationVariables(data) {

    const object = this.getObjectWithMutations();

    const {
      id,
    } = object || {};

    let where = id ? { id } : undefined;

    return {
      where,
      data,
    };
  }


  startEdit() {

    this.setState({
      inEditMode: true,
    });

  }


  resetEdit() {

    return new Promise(resolve => {
      this.clearCache();

      this.setState({
        inEditMode: false,
        _dirty: null,
      }, resolve);

    });

  }


  isInEditMode() {

    const {
      inEditMode,
      _dirty,
    } = this.state;

    return inEditMode || _dirty ? true : false;

  }


  isDirty() {

    return this.state._dirty ? true : false;

  }


  // onChange(event) {

  //   const {
  //     name,
  //     value,
  //   } = event.target;

  //   // console.log("onChange", name, value);

  //   this.updateObject({
  //     [name]: value,
  //   });

  // }


  // updateObject(data) {

  //   const {
  //     _dirty = {},
  //   } = this.state;

  //   const {
  //     localStorage,
  //   } = this.context;

  //   const newData = Object.assign({ ..._dirty }, data);

  //   const key = this.getCacheKey();

  //   if (key && newData && localStorage) {

  //     localStorage.setItem(this.getCacheKey(), JSON.stringify(newData));
  //   }


  //   this.setState({
  //     _dirty: newData,
  //   });

  // }


  updateObject(data) {

    const {
      _dirty = {},
    } = this.state;

    const {
      localStorage,
    } = this.context;

    const newData = Object.assign({ ..._dirty }, data);

    const key = this.getCacheKey();

    if (key && newData && localStorage) {
      localStorage.setItem(this.getCacheKey(), JSON.stringify(newData));
    }

    this.state._dirty = newData;

    this.forceUpdate();

  }


  getEditor(props) {

    const {
      Editor,
      name,
      helperText,
      onFocus,
      fullWidth = true,
      label,
      ...other
    } = props;


    const object = this.getObjectWithMutations();


    if (!object) {
      return null;
    }

    const value = object[name] || "";

    const {
      errors,
    } = this.state;

    const error = errors ? errors.find(n => n.key === name) : "";

    const helperTextMessage = error && error.message || helperText;

    return Editor ? <Editor
      onChange={event => {
        this.onChange(event);
      }}
      name={name}
      value={value}
      style={fullWidth ? {
        width: "100%",
      } : undefined}
      label={label ? this.lexicon(label) : label}
      error={error ? true : false}
      helperText={helperTextMessage ? this.lexicon(helperTextMessage) : helperTextMessage}
      onFocus={event => {

        if (error) {
          const index = errors.indexOf(error);
          if (index !== -1) {
            errors.splice(index, 1);
            this.setState({
              errors,
            });
          }
        }

        return onFocus ? onFocus(event) : null;
      }}
      fullWidth={fullWidth}
      {...other}
    /> : null;

  }


  getTextField(props = {}) {

    props = {
      Editor: TextField,
      autoComplete: "off",
      ...props,
    };

    return this.getEditor(props);

  }


  getObjectWithMutations() {

    const object = this.getObject();

    if (!object) {
      return object;
    }

    const {
      _dirty,
    } = this.state;

    if (_dirty) {

      const draftObject = { ...object }

      return Object.assign(draftObject, _dirty);

    }
    else {
      return object;
    }

  }


  getObject() {

    const {
      data,
      object,
    } = this.props;

    // const {
    //   object,
    // } = data || {};

    return object !== undefined ? object : (data && data.object) || null;
  }


  getButtons() {

    const {
      loading,
    } = this.state;

    const {
      SaveIcon,
    } = this.props;

    const inEditMode = this.isInEditMode();

    const isDirty = this.isDirty();

    let buttons = [];

    if (this.canEdit()) {

      if (inEditMode) {

        buttons.push(this.renderResetButton());


        if (isDirty) {

          buttons.push(this.renderSaveButton());

        }

      }
      else {
        buttons.push(this.renderEditButton());
      }

    }

    return buttons && buttons.length ? buttons : null;
  }


  renderResetButton() {

    const {
      ResetIcon,
    } = this.props

    return <IconButton
      key="reset"
      onClick={event => {
        this.resetEdit();
      }}
    >
      <ResetIcon
      />
    </IconButton>
  }


  renderSaveButton() {

    const {
      SaveIcon,
    } = this.props;

    const {
      loading,
    } = this.state;

    return <IconButton
      key="save"
      onClick={event => {
        this.save();
      }}
      disabled={loading}
    >
      {loading
        ?
        <CircularProgress />
        :
        <SaveIcon
        />
      }
    </IconButton>
  }


  renderEditButton() {

    const {
      EditIcon,
    } = this.props;

    return <IconButton
      key="edit"
      onClick={event => {
        this.startEdit()
      }}
    >
      <EditIcon
      />
    </IconButton>;
  }


  getTitle() {

    // const {
    //   object,
    // } = this.props;

    const object = this.getObjectWithMutations();

    const {
      name,
    } = object || {};

    return name;

  }


  renderHeader() {


    return <Typography
      variant="title"
    >
      {this.getTitle()}

      {this.getButtons()}

    </Typography>
  }


  renderEmpty() {
    return null;
  }


  renderDefaultView() {

    return null;

  }


  renderEditableView() {

    return null;

  }


  addError(error) {

    const {
      errorDelay,
    } = this.props;

    if (typeof error !== "object") {
      error = {
        message: error,
      };
    }

    Object.assign(error, {
      _id: new Date().getTime(),
    });

    const {
      notifications = [],
    } = this.state;

    notifications.push(error);

    setTimeout(() => this.removeError(error), errorDelay);


    this.setState({
      notifications,
    });

    return error;

  }


  removeError(error) {

    const {
      notifications,
    } = this.state;

    if (notifications) {

      const index = notifications.indexOf(error);

      if (index !== -1) {

        notifications.splice(index, 1);

        this.setState({
          notifications,
        });

      }

    }

  }


  closeError(error) {

    // let {
    //   errors,
    // } = this.state;

    Object.assign(error, {
      open: false,
    });


    // console.log("click event 2", error, this.state.notifications);

    this.forceUpdate();

  }

  // onCloseError(error) {

  //   let {
  //     notifications,
  //   } = this.state;

  //   if (!notifications) {
  //     return;
  //   }

  //   const index = notifications.indexOf(error);

  //   if (index !== -1) {
  //     notifications.splice(index, 1);

  //     this.setState({
  //       notifications,
  //     });
  //   }

  // }


  renderErrors() {

    const {
      errorDelay,
    } = this.props;

    const {
      notifications,
    } = this.state;

    if (notifications && notifications.length) {

      let output = null;

      let errors = notifications.map((error, index) => {

        let {
          _id,
          message,
          open = true,
        } = error;

        return <Snackbar
          key={_id}
          open={open}
          autoHideDuration={errorDelay}
          SnackbarContentProps={{
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          message={<span
          // id="snackbar-fab-message-id"
          >
            {message}
          </span>}
          action={
            <Fragment>

              <Button
                color="primary"
                variant="raised"
                size="small"
                onClick={event => {
                  // console.log("click event", event.target);
                  event.stopPropagation();
                  this.closeError(error)
                }}
              >
                Отмена
            </Button>

            </Fragment>
          }
        />

      });

      const {
        document,
      } = global;

      if (document.createRange) {
        output = ReactDOM.createPortal(<Fragment
        >
          {errors}
        </Fragment>, window.document.body);
      }
      else {
        output = errors;
      }

      return output;

    }
    else {
      return null;
    }

  }


  render() {


    const {
      data,
    } = this.props;


    // if (!data) {
    //   return null;
    // }

    const {
      // object,
      loading,
    } = data || {};


    let output = null;

    const object = this.getObject();

    if (!object) {

      if (loading) {
        return null;
      }
      else {
        output = this.renderEmpty();
      }

    }

    else {

      const inEditMode = this.isInEditMode();


      let content = null;


      if (inEditMode) {

        content = this.renderEditableView();

      }
      else {

        content = this.renderDefaultView();

      }


      output = (
        <Fragment>

          {this.renderHeader()}

          {content}

        </Fragment>
      )

    }

    return <Fragment>

      {output}

      {this.renderErrors()}

    </Fragment>

  }

}
