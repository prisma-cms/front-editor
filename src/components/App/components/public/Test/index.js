import React, { PureComponent } from 'react';
import EditorComponent from '../..';
import TextField from 'material-ui/TextField';
// import { EditorContext2 } from '../../../context';

export class Test extends EditorComponent {

  // static contextType = EditorContext2;

  static Name = 'Test';


  renderPanelView() {

    const {
      classes,
    } = this.getEditorContext();

    return super.renderPanelView(
      <div
        className={classes.panelButton}
      >
        Test
      </div>
    );
  }


  getRootElement() {

    return super.getRootElement();
  }


  // canBeParent(parent) {

  //   return super.canBeParent(parent);
  // }


  // canBeChild(child) {

  //   return super.canBeChild(child);
  // }


  // renderChildren() {

  //   const {
  //   } = this.context;

  //   const {
  //   } = this.getEditorContext();

  //   const {
  //     ...other
  //   } = this.getComponentProps(this);

  //   const {
  //     datass,
  //   } = this.getObjectWithMutations();

  //   const {
  //     text,
  //   } = datass || {};

  //   const children = super.renderChildren();

  //   return <div
  //     style={{
  //       marginLeft: 15,
  //     }}
  //   >
  //     Test

  //     {/* <div>
  //       <TextField
  //         value={text || ""}
  //         label="Text"
  //         // onChange={event => {

  //         //   const {
  //         //     value,
  //         //   } = event.target;

  //         //   this.updateObject({
  //         //     datass: {
  //         //       text: value,
  //         //     },
  //         //   });

  //         // }}
  //       />
  //     </div> */}

  //     {/* {text
  //       ?
  //       <div>
  //         {text}
  //       </div>
  //       : null
  //     } */}

  //     Test

  //     {children && children.length ? children : null}
  //   </div>
  // }


  testClick = event => {

    const {
      testOnClick,
    } = this.context;

    if (testOnClick) {

      testOnClick();

      this.setState({
        test: "SdfdsF",
      });

    }

  }


  // render() {

  //   return <div
  //     onClick={this.testClick}
  //   >
  //     Test
  //   </div>

  // }

  renderChildren() {

    const {
      vars,
    } = this.getObjectWithMutations();

    const {
      text,
    } = vars || {};


    return <div
      key="test"
    // onClick={this.testClick}
    >
      Test 2

      <TextField
        value={text || ""}
        name="text"
        label="Text"
        onChange={event => {

          const {
            name,
            value,
          } = event.target;

          this.updateObject({
            vars: {
              ...vars,
              [name]: value,
            },
          });

        }}
      />

      {super.renderChildren()}
    </div>

  }

}

export default Test;