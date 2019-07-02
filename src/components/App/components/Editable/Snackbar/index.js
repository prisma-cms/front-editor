import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'

import ReactDOM from 'react-dom';

import SnackbarUI from 'material-ui/Snackbar';
import Button from 'material-ui/Button';

export default class Snackbar extends Component {

  static propTypes = {
    opened: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    close: PropTypes.func,
  }

  render() {

    if (typeof window === "undefined") {
      return null;
    }

    const {
      message,
      close,
      opened,
      ...other
    } = this.props;
    return ReactDOM.createPortal(
      <SnackbarUI
        open={opened}
        // autoHideDuration={errorDelay}
        // onClose={event => this.onCloseError(error)}
        // SnackbarContentProps={{
        //   // 'aria-describedby': 'snackbar-fab-message-id',
        //   // className: classes.snackbarContent,
        // }}
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

            {close ? <Button
              color="primary"
              variant="raised"
              size="small"
              onClick={event => {

                event.stopPropagation();
                event.preventDefault();
                close && close()
              }}
            >
              Close
          </Button> : null
            }

          </Fragment>
        }
        style={{
          // position: "absolute",
          // width: "100%",
          // height: "100%",
          // margin: 0,
          // padding: 0,
          // bottom: 0,
          zIndex: 3000,
        }}
        {...other}
      />, window.document.body
    )
  }
}
