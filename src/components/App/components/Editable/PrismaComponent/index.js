import React, { Fragment, PureComponent, Component } from 'react'
import PropTypes from 'prop-types'

import Snackbar from '../Snackbar';

import URI from 'urijs';


import i18n from "roddeh-i18n";

import Context from '@prisma-cms/context';


const defaultLocales = {
  ru: {
    values: {
      "Request error": "Ошибка выполнения запроса",
    }
  },
};

export default class PrismaCmsComponent extends Component {


  static contextType = Context;


  static proptTypes = {
    locales: PropTypes.object,
    filters: PropTypes.object,
  }

  static defaultProps = {
    // locales: defaultLocales,
  }


  constructor(props) {

    super(props);

    const {
      // locales: propLocales = defaultLocales,
      filters,
      locales,
    } = this.props;

    // let locales = {};

    // for (var lang in propLocales) {

    //   let locale = propLocales[lang] || {};

    //   let defaultLocale = defaultLocales[lang];

    //   if (defaultLocale) {
    //     locale.values = {
    //       ...locale.values,
    //       ...defaultLocale.values,
    //     }
    //   }

    //   locales[lang] = this.createLexicon(locale);
    // }


    // global.component = this;

    this.state = {
      ...this.state,
      locales: {},
      filters,
    }

    this.initLocales(defaultLocales);

    if (locales) {
      this.initLocales(locales);
    }

  }


  initLocales(locales) {

    for (var lang in locales) {

      let locale = locales[lang];

      if (locale) {
        this.addLexicon(lang, locale);
      }

    }

  }


  createLexicon(locale) {

    return i18n.create(locale);
  }


  addLexicon(lang, locale) {

    const {
      locales,
    } = this.state;

    if (!locales[lang]) {
      locales[lang] = this.createLexicon(locale);
    }

    else {
      locales[lang].translator.add(locale);
    }

    return locales[lang];

  }


  lexicon(word, options) {

    const {
      lang = "en",
    } = this.context;

    const {
      locales,
    } = this.state;

    return locales && locales[lang] ? locales[lang](word, options) : word;

  }


  addError(error) {

    error = this.lexicon(error || "Request error");

    this.setState({
      error,
    }, () => {
      setTimeout(() => {

        // Проверка не очень надежная, так как строки не учитывают инстанс,
        // но это лучше, чем ничего.
        if (error === this.state.error) {
          this.setState({
            error: null,
          });
        }

      }, 5000);
    });
  }


  query(params) {

    return this.request("query", params);

  }


  mutate(params) {

    return this.request("mutate", params)
    // .then(async r => {

    //   const {
    //     client,
    //   } = this.context;

    //   await client.clearStore();

    //   return r;
    // });

  }


  async request(method, params) {

    this.setState({
      loading: true,
    });

    const {
      client,
    } = this.context;

    const result = await client[method](params)
      .catch(error => {

        error.message = error.message && error.message.replace(/^GraphQL error: */, '') || "";

        return error;
      });

    this.setState({
      loading: false,
    });


    let error;
    let errors;

    if (result instanceof Error) {
      error = result.message;
      // throw(result);
    }
    else {
      const {
        response,
      } = result.data || {};

      let {
        success,
        message,
        errors: responseErrors,
        ...other
      } = response || {};

      errors = responseErrors;

      if (success !== undefined) {

        if (!success) {

          error = this.lexicon(message || "Request error");

        }
      }

    }


    this.setState({
      errors,
    });

    if (error) {
      this.addError(error);
      throw (result);
    }
    else {
      this.setState({
        error: null,
      });
    }

    return result;

  }


  reloadApiData() {

    const {
      loadApiData,
    } = this.context;

    return loadApiData();

  }



  renderField(field) {

    const {
      errors,
    } = this.state;

    let {
      // key,
      type: Field,
      props,
      // ...other,
    } = field;

    let {
      key,
      name,
      label,
      helperText,
      onFocus,
      ...other
    } = props;

    const error = errors ? errors.find(n => n.key === name) : null;

    // return field;

    helperText = error ? error.message : helperText;

    if (helperText) {
      helperText = this.lexicon(helperText);
    }

    return <Field
      key={key}
      name={name}
      error={error ? true : false}
      helperText={helperText}
      label={label ? this.lexicon(label) : label}
      onFocus={event => {
        const {
          errors,
        } = this.state;

        if (errors) {
          const index = errors.findIndex(({ key }) => key === name);

          if (index !== -1) {
            errors.splice(index, 1);
            this.setState({
              errors,
            });
          }
        }

        return onFocus ? onFocus(event) : false;

      }}
      onChange={event => this.onChange(event)}
      {...other}
    />;
  }


  onChange(event) {

    let {
      name,
      value,
      type,
      checked,
    } = event.target;


    switch (type) {

      case "boolean":
      case "checkbox":

        value = checked;
        break;

      case "number":

        value = Number(value);

        break;

    }

    this.updateObject({
      // [name]: value ? value : null,
      [name]: value,
    });

  }


  updateObject(data) {

    const {
      _dirty = {},
    } = this.state;

    this.setState({
      _dirty: Object.assign({ ..._dirty }, data),
    });

  }


  getHistory() {
    const {
      router: {
        history,
      },
    } = this.context;

    return history;
  }

  getLocation() {

    const {
      location,
    } = this.getHistory();

    return location;
  }

  getLocationUri() {

    const {
      pathname,
      search,
    } = this.getLocation();

    return new URI(`${pathname}${search}`);

  }

  getLocationQuery(field) {

    return this.getLocationUri().query(true)[field];
  }


  onFilterFieldChange(event) {

    const {
      name,
      value,
    } = event.target;


    this.setFilters({
      [name]: value ? value : undefined,
    });

  }


  setFilters(data) {

    // let uri = this.getLocationUri();
    // let query = uri.query(true);

    // Object.assign(query, {
    //   ...data,
    //   page: undefined,
    // });

    // uri.query(query);

    // const history = this.getHistory();




    // history.push(uri.toString());

    const {
      filters,
    } = this.state;

    this.setState({
      filters: {
        ...filters,
        ...data,
      },
    });

  }


  /**
   * Простая проверка выставлены ли фильтры или нет
   */
  hasFilters() {

    const filters = this.getFilters();

    return Object.keys(filters).length > 0 ? true : false;
  }


  /**
   * Получаем фильтры из адресной строки
   */
  getFilters() {

    let {
      filters,
    } = this.state;

    return filters || {};
  }

  addFilterCondition(where, key, value) {
    return Object.assign(where, {
      [key]: value,
    });
  }


  cleanFilters() {

    // const {
    //   pathname,
    // } = this.getLocation();

    // const history = this.getHistory();

    // history.push(pathname);

    this.setState({
      filters: null,
    });

  }


  canEdit() {

    const {
      object,
    } = this.props.data || {};

    const {
      id: objectId,
      CreatedBy,
    } = object || {};


    const {
      id: currentUserId,
      sudo,
    } = this.getCurrentUser() || {};

    const {
      id: createdById,
    } = CreatedBy || {};


    if (objectId) {

      if (sudo || (createdById && createdById === currentUserId)) {
        return true;
      }

    }
    else {
      return true;
    }

    return false;
  }


  getCurrentUser() {

    const {
      user: currentUser,
    } = this.context;

    return currentUser;
  }


  render(content) {

    const {
      error,
    } = this.state;

    const {
      children,
    } = this.props;

    return (
      <Fragment>

        {content}

        {children}

        <Snackbar
          opened={error ? true : false}
          message={error ? this.lexicon(error) : ""}
          close={() => {
            this.setState({
              error: null,
            })
          }}
        />

      </Fragment>
    )
  }
}
