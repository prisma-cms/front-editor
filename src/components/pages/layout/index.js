import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

class DevPageLayout extends Component {

  static contextType = Context;


  render(content = null) {

    return content;
  }
}


export default DevPageLayout;