import React from 'react';
import EditorComponent from '../..';

export class Page404 extends EditorComponent {

  static Name = 'Page404';

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
    page_title: "Page not found",
    page_status: 404,
  }


  renderPanelView(content) {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      content ||
      <div
        className={classes.panelButton}
      >
        Page404
      </div>
    );
  }


  // componentDidMount() {

  //   const {
  //     inEditMode,
  //     setPageMeta,
  //   } = this.getEditorContext();

  //   // const {
  //   //   page_title,
  //   // } = this.getComponentProps(this);


  //   if (!inEditMode && this.inMainMode()) {
  //     setPageMeta({
  //       status: 404,
  //       // title: page_title,
  //     });
  //   }


  //   super.componentDidMount && super.componentDidMount();
  // }


  // componentWillUnmount() {

  //   const {
  //     inEditMode,
  //     setPageMeta,
  //   } = this.getEditorContext();

  //   /**
  //    * Restore page status
  //    */
  //   if (!inEditMode && this.inMainMode()) {
  //     setPageMeta({
  //       status: 200,
  //     });
  //   }


  //   super.componentWillUnmount && super.componentWillUnmount();
  // }


  renderChildren() {

    const children = super.renderChildren();

    const {
      page_title,
    } = this.getComponentProps(this);

    return children && children.length ? children : <h3
      key="page404"
    >
      {page_title}
    </h3>
  }

}

export default Page404;