import { useState } from 'react'
import { useCallback, useEffect } from 'react'
// import { EditorComponentProps } from '../../../..'
import { HtmlTagProps } from '../../../Tag/HtmlTag'
// import CSSTransform from '../../../Tag/HtmlTag/CSSTransform'
import { nodeChildsToEditorComponentObjectComponents } from '../helpers/nodeToEditorComponentObject'
import { ContentProxyEditMode } from '../interfaces'

// TODO make generic
// type P = EditorComponentProps

// let updateCount = 0;

/**
 * Хук для отслеживания изменений на HTML-элементе.
 * В какой момент должен срабатывать? Главное условие: выбрасываемые им изменения
 * не должны вызывать повторный апдейт этой же ноды, чтобы не возникало рекурсии.
 * То есть нужен флаг, который бы сигнализировал когда можно отслеживать DOM и отдавать изменения.
 */
const useMutationObserver = (
  container: HTMLDivElement | null,
  // updateObject: EditorComponent["updateObject"],
  // setNewContent: React.Dispatch<React.SetStateAction<HtmlTagProps['object']['components']>>
  setNewContent: (components: HtmlTagProps['object']['components']) => void,
  editMode: ContentProxyEditMode | null
) => {
  // const [newContent, setNewContent] = useState<HtmlTagProps['object']['components']>([]);

  // const context = useContext(Context);

  // console.log('useMutationObserver context', context);

  // console.log('newContent', newContent);

  // const saveChanges = useCallback(() => {
  //   console.log('saveChanges newContent', newContent);
  //   console.log('saveChanges updateObject', updateObject);

  //   updateObject({
  //     components: newContent,
  //   });

  //   setNewContent([]);
  //   return true;
  // }, [newContent, updateObject]);

  const [contentEditable, setContentEditable] = useState(false)

  // const [selection, setSelection] = useState<Selection | null>(global.document?.getSelection() ?? null);

  // const [selection, setSelection] = useState<Selection | null>(null);

  // const closestInSelection = useCallback(<T extends HTMLElement>(selector: string): T | null => {

  //   if (!selection?.focusNode) {
  //     return null
  //   }

  //   let node: Node | null | undefined = selection.focusNode

  //   if (node.nodeType === Node.TEXT_NODE) {
  //     node = selection.focusNode?.parentNode
  //   }

  //   if (node && node instanceof Element) {
  //     return node.closest(selector)
  //   }

  //   return null
  // }, [selection]);

  // TODO Надо будет перепроверить логику
  const onClick = useCallback(
    (event: MouseEvent) => {
      // const container = ref.current;
      /**
       * Prevent if already in edit mode
       */
      if (contentEditable || !container) {
        return
      }

      const composedPath = event.composedPath()

      let canBeEditable = true

      composedPath.every((path) => {
        // console.log("composedPath forEach path", path);

        // console.log("composedPath forEach path contenteditable", path instanceof HTMLElement && path.attributes.getNamedItem("contenteditable")?.value);

        /**
         * Break reduce on current container
         */

        if (path === container) {
          return false
        }

        // if (path instanceof HTMLElement && path.attributes.getNamedItem("contenteditable")?.value === "false") {
        if (path instanceof HTMLElement) {
          const contenteditable =
            path.attributes.getNamedItem('contenteditable')?.value

          if (contenteditable === 'false') {
            canBeEditable = false
            return false
          }
        }

        return true
      })

      /**
       * Prevent edit if not editable
       */
      if (!canBeEditable) {
        return
      }

      setContentEditable(true)

      event.currentTarget instanceof HTMLElement && event.currentTarget.focus()

      // event.currentTarget.focus();
    },
    [container, contentEditable]
  )

  /**
   * Manager selection
   */
  // const onSelectionChange = useCallback((_event) => {

  //   console.log('onSelectionChange _event', _event);

  //   // const container = ref.current;

  //   const selection2 = document.getSelection()

  //   if (selection2 && container && selection2.containsNode(container, true)) {

  //     setSelection(selection2);
  //   }
  //   else {
  //     setSelection(null);
  //   }
  // }, [container]);

  // useEffect(() => {

  //   document.addEventListener('selectionchange', onSelectionChange);

  //   return () => {
  //     document.removeEventListener('selectionchange', onSelectionChange);
  //   }
  // }, [onSelectionChange]);

  useEffect(() => {
    // const container = ref.current;

    /**
     * Пока отключаем Этот блок
     */
    // TODO Перепроверить логику
    if (editMode !== ContentProxyEditMode.HTML) {
      return
    }

    container?.addEventListener('click', onClick)

    return () => {
      container?.removeEventListener('click', onClick)
    }
  }, [container, contentEditable, editMode, onClick])

  useEffect(() => {
    // const container = ref.current;

    const onBlur = (_event: FocusEvent) => {
      // TODO Add update handler
      // setContentEditable(false);
    }

    container?.addEventListener('blur', onBlur)

    return () => {
      container?.removeEventListener('blur', onBlur)
    }
  }, [container])

  // const updateContent = useCallback(nodeToEditorComponentObject, [])

  const makeNewContent = useCallback(
    nodeChildsToEditorComponentObjectComponents,
    []
  )

  const onChangeDom = useCallback(
    (container: Node) => {
      // updateCount++;

      // if (updateCount > 10) {
      //   return;
      // }

      const content = makeNewContent(container)

      const { components } = content

      // components && updateObject({ components })

      // console.log('onChangeDom makeNewContent context', context);
      // console.log('onChangeDom makeNewContent context?.setNewContent', context?.setNewContent);

      components && setNewContent(components)
    },
    [makeNewContent, setNewContent]
  )

  useEffect(() => {
    if (!container || editMode !== ContentProxyEditMode.HTML) {
      return
    }

    const config = {
      attributes: true,
      childList: true,
      subtree: true,
      characterData: true,
    }

    // Create an observer instance linked to the callback function
    // const observer = new MutationObserver(this.onDOMSubtreeModified);
    const observer = new MutationObserver((changes) => {
      // console.log('onDomChanged changes', changes);
      // console.log('onDomChanged container.outerHTML', container.outerHTML);

      /**
       * Filter changes. Get only from editable container
       */
      const nodes = changes.filter(({ target }): boolean => {
        // if (target === container) {
        //   return false;
        // }

        let node: Node | null = target

        // console.log('onDomChanged node', node);

        let success = false

        // let parent: (Node & ParentNode) | null = target.parentNode;

        let i = 0

        // eslint-disable-next-line no-cond-assign
        while (node && i < 100) {
          i++

          if (!node) {
            break
          }

          if (node === container) {
            success = true
            break
          }

          if (
            node instanceof HTMLElement &&
            node.attributes.getNamedItem('contenteditable')?.value === 'false'
          ) {
            // console.log("while parent", i, node, node.attributes.getNamedItem("contenteditable")?.value);

            break
          }

          node = node?.parentNode
          // break;
        }

        // console.log("parent", parent);

        return success
      })

      /**
       * If have changes on content, update state
       */
      if (nodes.length) {
        onChangeDom(container)
      }
    })

    // Start observing the target node for configured mutations
    observer.observe(container, config)

    return () => {
      observer.disconnect()
    }
  }, [container, editMode, onChangeDom])
}

export default useMutationObserver
