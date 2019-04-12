import React, { Component } from 'react';
import PropTypes from 'prop-types';

import "./styles/less/styles.css";

import Context from '@prisma-cms/context';

import App from "./components/App";
import FrontEditorRoot from "./components/Root";
import SubscriptionProvider from "./components/SubscriptionProvider";
import ContextProvider from "./components/ContextProvider";

export {
  ContextProvider,
  SubscriptionProvider,
  FrontEditorRoot,
}

export default App;