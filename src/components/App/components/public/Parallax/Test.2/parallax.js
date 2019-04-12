import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ParallaxJD from "parallax-js";

class Parallax extends Component {


  state = {
    show: false,
  }

  componentDidMount(){
    var scene = document.getElementById('scene');
    var parallaxInstance = new ParallaxJD(scene);

    const {
      show,
    } = this.state;

    setInterval(() => {
      this.setState({
        show: !show,
      });
    }, 2000);

    super.componentDidMount && super.componentDidMount();
  }

  render() {

    const {
      show,
    } = this.state;

    return (
      <div id="scene">
        <div data-depth="0.2">My first Layer!</div>
        <div data-depth="0.6">My second Layer!</div>
        {show ? <div data-depth="0.8">My second Layer!</div> : null}
      </div>
    );
  }
}


export default Parallax;