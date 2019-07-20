
import expect from 'expect'

import React, { Component } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import PropTypes from "prop-types";

import chalk from "chalk";

import TestApp from "./App";

class Renderer extends Component {

  // static propTypes = {
  // }

  render() {

    return <div
      id="content"
      {...this.props}
    />

  }
}


describe('@prisma-cms/tests app', () => {
  let node


  beforeEach(() => {
    node = document.createElement('root')
    node.id = "root";
    document.body.appendChild(node);
  })

  afterEach(() => {
    unmountComponentAtNode(node)
    document.body.removeChild(node);
  })


  it('Render Main App', () => {


    render(<TestApp
      Renderer={Renderer}
    >
      <div
        id="test"
      >
        Test
      </div>
    </TestApp>, node, () => {

      const item = node.querySelector("#test");

      expect(item).toNotBe(null);
      expect(item.textContent).toBe("Test");

    })
  });


  it('Render Index App', () => {

    require("../../index");

    expect(node.querySelector("#content").textContent).toContain("Main page");
    expect(node.querySelector("#buttons").textContent).toContain("Force update");
    expect(node.querySelector("#prisma-cms-performance-tester")).toNotBe(null);
    // expect(node.textContent).toContain("Users");
    // expect(node.textContent).toContain("Signin");

  });

})

