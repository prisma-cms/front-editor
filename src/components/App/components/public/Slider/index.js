import React, { Component } from 'react';
import PropTypes from 'prop-types';

// import EditorComponent from '../..';

import SlickSlider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Iterable from '../Connectors/Connector/ListView/Iterable';

class Slider extends Iterable {

  static defaultProps = {
    ...Iterable.defaultProps,
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    style: {
      ...Iterable.defaultProps.style,
      paddingBottom: 30,
    },
  }

  static Name = "Slider"

  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(<div
      className={classes.panelButton}
    >
      Slider
    </div>);
  }



  // prepareDragItemComponents() {

  //   return [
  //     {
  //       "name": "Section",
  //       "props": {
  //         "style": {
  //           "textAlign": "center"
  //         },
  //         "className": "block"
  //       },
  //       "components": [
  //         {
  //           "name": "Tag",
  //           "props": {
  //             "tag": "h1"
  //           },
  //           "components": [
  //             {
  //               "name": "Tag",
  //               "component": "Tag",
  //               "props": {
  //                 "text": "Недвижимость в Дубае, ОАЭ"
  //               },
  //               "components": []
  //             }
  //           ],
  //           "component": "Tag"
  //         },
  //         {
  //           "name": "Tag",
  //           "props": {
  //             "tag": "div",
  //             "className": "caption"
  //           },
  //           "components": [
  //             {
  //               "name": "Tag",
  //               "component": "Tag",
  //               "props": {
  //                 "text": "Квартиры и апартаменты премиум и бизнес-класса в лучших жилых комплексах Дубая"
  //               },
  //               "components": []
  //             }
  //           ],
  //           "component": "Tag"
  //         },
  //         // {
  //         //   "name": "Section",
  //         //   "component": "Section",
  //         //   "props": {
  //         //   },
  //         //   "components": [
  //         //     {
  //         //       "name": "Section",
  //         //       "component": "Section",
  //         //       "props": {
  //         //       },
  //         //       "components": [
  //         //       ],
  //         //     },
  //         //   ],
  //         // },
  //       ],
  //       "component": "Section"
  //     }
  //   ];
  // }


  // getRootElement() {

  //   return MainMenu;
  // }

  renderChildren() {

    const {
      Grid,
    } = this.context;


    const childs = super.renderChildren();

    // console.log("childs", childs);

    if (!childs) {
      return childs;
    }

    // const settings = {
    //   dots: true,
    //   infinite: true,
    //   speed: 500,
    //   slidesToShow: childs.length > 3 ? 3 : childs.length,
    //   slidesToScroll: 1
    // };


    const {
      slidesToShow = 1,
      ...other
    } = this.getComponentProps(this);

    return <SlickSlider
      slidesToShow={childs.length > slidesToShow ? slidesToShow : childs.length}
      {...other}
    >
      {childs}
    </SlickSlider>
  }


}

export default Slider;
