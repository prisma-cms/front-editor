/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import Iterable from '../Connectors/Connector/ListView/Iterable'

class Slider extends Iterable {
  static defaultProps = {
    ...Iterable.defaultProps,
    dots: true,
    dotsClass: 'slick-dots',
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
    easing: 'linear',
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
    slide: 'div',
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

  static Name = 'Slider'

  renderPanelView(content) {
    return super.renderPanelView(
      content || <div className="editor-component--panel-icon">Slider</div>
    )
  }

  renderChildren() {
    const childs = super.renderChildren()

    if (!childs) {
      return childs
    }

    const SlickSlider = require('react-slick').default

    return (
      <SlickSlider key="slick" {...this.getSliderProps()}>
        {childs}
      </SlickSlider>
    )
  }

  getSliderProps() {
    const { slidesToShow = 1, ...other } = this.getComponentProps(this)

    const childs = super.renderChildren()

    return {
      ref: (slider) => (this.slider = slider),

      // Fix issue https://github.com/akiran/react-slick/issues/1553
      slidesToShow: childs.length > slidesToShow ? slidesToShow : childs.length,
      ...other,
    }
  }

  prepareRootElementProps(props) {
    // TODO Fix this hell
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
    } = super.prepareRootElementProps(props)

    return other
  }
}

export default Slider
