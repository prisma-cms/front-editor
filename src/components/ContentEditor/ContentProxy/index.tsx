import React, { useCallback, useMemo, useState } from 'react'
import { EditorComponentObject } from '../../..'
// import Context from './Context';
// import { HtmlTagProps } from '../../Tag/HtmlTag';
import useMutationObserver from './hooks/useMutationObserver'

import { ContentProxyEditMode, ContentProxyProps } from './interfaces'

// import TagEditor from '../TagEditor'

import { ContentProxyStyled } from './styles'
import { ContentEditableStyled } from './styles/contentEditable'
import ContentEditorToolbar from './Toolbar'

/**
 * Компонент-обертка для contenteditable элемента.
 * Предназначение: дать возможность редактировать содержимое в браузере.
 * Особенности:
 * - внутренние теги, формируемые реакт-компонентами не редактировать.
 * - Selection есть всегда. Просто не всегда есть фокус-теги. Меняется при клике в любую часть документа.
 * Сценарий:
 * - По клику делать компонент редактируемый
 * - По выходу из области делать его опять не редактируемым
 */
const ContentProxy: React.FC<ContentProxyProps> = (props) => {
  const {
    // components,
    // editable,
    // initialContent,
    // mode = 'main',
    // TagEditor,
    // updateObject: updateObjectProps,
    updateObject,
    className,
    // ...other
    children,
    experimental,
  } = props

  // const updateObject = useCallback((data) => {
  //   console.log('ContentProxy updateObject data', data);
  //   updateObjectProps(data);
  // }, [
  //   updateObjectProps
  // ]);

  const [editMode, setEditMode] = useState<ContentProxyEditMode | null>(null)

  // const ref = useRef<HTMLDivElement>(null);
  // const [wrapper, setWrapper] = useState<HTMLDivElement | null>(null);

  const [contentEditableContainer, setContentEditableContainer] =
    useState<HTMLDivElement | null>(null)

  const [newContent, setNewContent] = useState<
    EditorComponentObject['components'] | null
  >(null)

  /**
   * Сохраняем временный контент в JSON компонента
   */
  const saveChanges = useCallback(() => {
    if (!newContent) {
      return false
    }

    /**
     * Выключаем режим редактирования
     */
    setEditMode(null)

    /**
     * Обновляем компонент
     */
    updateObject({
      components: newContent || [],
    })

    /**
     * Сбрасываем временный контент
     */
    setNewContent(null)

    return true
  }, [newContent, updateObject])

  const [focused, setFocused] = useState(false)

  const onFocus = useCallback(() => {
    return setFocused(true)
  }, [])
  const onBlur = useCallback(() => {
    // Сохраняем изменения, если есть
    saveChanges()

    return setFocused(false)
  }, [saveChanges])

  /**
   * Find closest node
   */

  // useMutationObserver(ref.current, setNewContent);
  useMutationObserver(contentEditableContainer, setNewContent, editMode)

  const selection = useMemo(() => global.document?.getSelection() ?? null, [])

  const closestInSelection = useCallback(
    <T extends HTMLElement>(selector: string): T | null => {
      if (!selection?.focusNode) {
        return null
      }

      let node: Node | null | undefined = selection.focusNode

      if (node.nodeType === Node.TEXT_NODE) {
        node = selection.focusNode?.parentNode
      }

      if (node && node instanceof Element) {
        return node.closest(selector)
      }

      return null
    },
    [selection]
  )

  const contentProxy = useMemo(() => {
    return (
      <ContentProxyStyled
        // ref={setWrapper}
        // suppressContentEditableWarning
        // contentEditable={true}
        // onFocus={onFocus}
        // onBlur={onBlur}
        className={[
          className,
          'ContentProxyStyled',
          focused ? 'focused' : '',
        ].join(' ')}
      >
        {/* <div
        contentEditable={false}
      >
        <div>
          {contentEditable ? "contentEditable YES" : "contentEditable NO"}
        </div>
      </div> */}

        <ContentEditorToolbar
          // selection={selection}
          closestInSelection={closestInSelection}
          newContent={newContent}
          saveChanges={saveChanges}
          editMode={editMode}
          setEditMode={setEditMode}
          contentEditableContainer={contentEditableContainer}
          updateObject={updateObject}
          experimental={experimental}
        />

        <ContentEditableStyled
          key={editMode}
          className="contentProxyEditor"
          // ref={ref}
          ref={setContentEditableContainer}
          onFocus={onFocus}
          onBlur={onBlur}
          // contentEditable={contentEditable}
          contentEditable={editMode === ContentProxyEditMode.HTML}
          suppressContentEditableWarning
        >
          {children}
        </ContentEditableStyled>
      </ContentProxyStyled>
    )
  }, [
    children,
    className,
    closestInSelection,
    contentEditableContainer,
    editMode,
    experimental,
    focused,
    newContent,
    onBlur,
    onFocus,
    saveChanges,
    updateObject,
  ])

  return <>{contentProxy}</>
}

export default ContentProxy
