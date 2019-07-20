import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Context from "@prisma-cms/context";

class DevPageLayout extends PureComponent {

  static contextType = Context;


  render(content) {

    return content || null;
  }
}


export default DevPageLayout;