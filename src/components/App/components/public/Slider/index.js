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
    dotsClass: "slick-dots",
    speed: 500,
    slidesToScroll: 1,
    slidesToShow: 1,
    slidesPerRow: 1,
    accessibility: false,
    adaptiveHeight: false,
    arrows: true,
    autoplay: false,
    autoplaySpeed: 3000,
    centerMode: false,
    centerPadding: 50,
    draggable: true,
    easing: "linear",
    fade: false,
    focusOnSelect: false,
    infinite: true,
    initialSlide: 0,
    lazyLoad: undefined,
    pauseOnDotsHover: false,
    pauseOnFocus: false,
    pauseOnHover: true,
    // ToDo Add array/json params
    // responsive: array,
    
    rows: 1,
    slide: "div",
    swipe: true,
    swipeToSlide: false,
    touchMove: true,
    touchThreshold: 5,
    useCSS: true,
    useTransform: true,
    variableWidth: false,
    vertical: false,

    style: {
      ...Iterable.defaultProps.style,
      paddingBottom: 30,
    },
  }

  static Name = "Slider"

  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(content || <div
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


  prepareRootElementProps(props) {

    const {
      dots,
      dotsClass,
      speed,
      slidesToShow,
      slidesToScroll,
      slidesPerRow,
      accessibility,
      adaptiveHeight,
      arrows,
      autoplay,
      autoplaySpeed,
      centerMode,
      centerPadding,
      draggable,
      easing,
      fade,
      focusOnSelect,
      infinite,
      initialSlide,
      lazyLoad,
      pauseOnDotsHover,
      pauseOnFocus,
      pauseOnHover,
      // ToDo Add array/json params
      // responsive,
      
      rows,
      slide,
      swipe,
      swipeToSlide,
      touchMove,
      touchThreshold,
      useCSS,
      useTransform,
      variableWidth,
      vertical,
      ObjectContext,
      items,
      ...other
    } = super.prepareRootElementProps(props);

    return other;
  }


}

export default Slider;
