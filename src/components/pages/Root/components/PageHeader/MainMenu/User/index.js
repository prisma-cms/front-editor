import React, { Component } from 'react';

import PropTypes from 'prop-types';


import Context from "@prisma-cms/context";
import { Typography } from 'material-ui';

export default class UserMenuItem extends Component {


  static propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
  }


  static contextType = Context;


  render() {

    const {
      user,
      classes,
    } = this.props;
 

    const {
      UserLink,
    } = this.context;

    const {
      fullname,
      username,
    } = user || {};

    return <UserLink
      user={user}
      style={{
        marginLeft: 5,
      }}
      variant={null}
      {...this.props}
    >
      <Typography
        className={classes.link}
      >
        {fullname || username}
      </Typography>
    </UserLink>;

  }

}
