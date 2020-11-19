
import EditorComponent from '../..';
import { PageProps, PageState } from './interfaces';

export * from './interfaces';


class Page<P extends PageProps = PageProps, S extends PageState = PageState>
  extends EditorComponent<P, S> {

  static defaultProps = {
    ...EditorComponent.defaultProps,
    hide_wrapper_in_default_mode: true,
  }


  static Name = "Page"


  canBeParent() {

    return false;
  }


  renderPanelView() {

    return null;
  }

  renderAddButton() {

    return null;
  }

}

export default Page;
