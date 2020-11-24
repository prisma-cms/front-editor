import React from 'react';
// import PropTypes from 'prop-types';
import EditorComponent from '../../EditorComponent';

import URI from "urijs";
import Icon from "material-ui-icons/Link";

import { default as MuiLink } from "../../common/Link";
import { ObjectContext } from '../Connectors/Connector/ListView';


const Renderer = props => {

  const {
    to,
    children,
    ...other
  } = props;

  const uri = new URI(to);

  let output = null;

  if (uri.scheme()) {
    output = <a
      href={to}
      {...other}
    >
      {children}
    </a>
  }
  else {
    output = <MuiLink
      to={to}
      {...other}
    >
      {children}
    </MuiLink>
  }

  return output;
}


class Link extends EditorComponent {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    // native: false,
    to: "",
    target: "",
  }

  static Name = "Link"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        <Icon /> Link
    </div>);
  }

  getRootElement() {

    return Renderer;
  }

  renderMainView() {

    let {
      to,
    } = this.getComponentProps(this);


    if (to) {
      /**
       * Проверяем есть ли параметры в УРЛ
       */

      const segments = to.split("/");

      /**
       * Если есть, то нам надо обернуть вывод в контекст объекта
       */
      if (segments.find(n => n && n.startsWith(":"))) {

        return <ObjectContext.Consumer>
          {context => {

            const {
              object,
            } = context;

            if (object) {

              to = segments.map(n => {

                if (n && n.startsWith(":")) {
                  n = object[n.replace(/^:/, '')];
                }

                return n;
              }).join("/");

            }

            return super.renderMainView({
              to,
            });
          }}
        </ObjectContext.Consumer>
      }

    }


    return super.renderMainView();
  }

}

export default Link;
