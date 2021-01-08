// TODO: Add adaptivity

import styled from 'styled-components'

const itemsPanelWidth = '290px'

const dragOveredBorderColor = '#15e408'
const hoveredBorderColor = '#7509da'
const activeBorderColor = '#b806bb'
const dirtyBorderColor = 'red'

export const FrontEditorStyled = styled.div`
  /* [desktop] { */

  &.flex {
    flex: 1;
    display: flex;
  }
  /* }; */

  &.fullheight {
    height: 100%;
  }

  .editor {
    position: relative;

    /* [desktop] { */
    flex: 1;
    overflow: auto;
    height: 100%;
    /* }; */
  }
  .panel {
    /* [desktop] { */
    width: min-content;
    height: 100%;
    overflow: auto;
    position: relative;
    transition: width 0.5s;
    &.opened {
      width: ${itemsPanelWidth};
    }
    /* }; */
  }
  .panelItems {
    /* [desktop] { */
    height: 100%;
    width: 100%;
    overflow: auto;
    /* }; */
  }
  .panelItem {
    cursor: grab;
    margin: 2px;
    padding: 10px;
    border: 1px solid #ddd;
    display: flex;
    flex-direction: row;
    align-items: center;
    &:hover {
      border: 1px solid ${hoveredBorderColor};
    }
    &.active {
      border: 1px solid ${activeBorderColor};
    }
    &.hovered {
      border: 1px solid ${hoveredBorderColor};
    }
    &.dragOvered {
      border: 1px solid ${dragOveredBorderColor};
    }

    &.add_child {
      cursor: pointer;
    }
  }
  .items {
    position: relative;
  }
  .item {
  }

  .itemEditable {
    position: relative;
    min-height: 30px;
    border: 1px dotted #ddd;
    padding: 7px;

    &.dirty {
      border: 1px solid ${dirtyBorderColor};
    }
    &.active {
      border: 1px solid ${activeBorderColor};
    }
    &.dragOvered {
      border: 1px solid ${dragOveredBorderColor};
    }
    &.hovered {
      border: 1px solid ${hoveredBorderColor};
    }
    &.root {
      border-width: 2px;
    }
    &.disabled {
      border-color: transparent;
    }

    /* https://habr.com/ru/post/456248/; */
    &[contenteditable='true'] {
      &:empty:before {
        content: unset;
      }
    }
  }
  .blockBadge {
    border: 1px solid #ddd;
    position: absolute;
    bottom: 100%;
    right: 0;
    z-index: 2000;
    background: #fafafa;
    color: #333;
    padding: 3px;
  }
  .badgeButton {
    height: 34px;
    width: 34px;
  }

  /* .panelButton */
  .editor-component--panel-icon {
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  .bordered {
    border: 1px solid #ddd;
  }
  .helpLink {
    color: inherit;
    margin-left: 3px;
  }
  .actionPanel {
    border-top: 1px solid #ddd;
    max-height: 250px;
    overflow: auto;
  }
`
