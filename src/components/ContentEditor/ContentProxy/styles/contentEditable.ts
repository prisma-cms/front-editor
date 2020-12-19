import styled from 'styled-components'

export const ContentEditableStyled = styled.div`
  /* border: 1px solid blue; */
  border: 1px solid #ddd;
  min-height: 10rem;

  resize: vertical;
  overflow: auto;
  padding: 3px;
  &:focus {
    outline: none;
  }

  /* > * {
  } */

  [contenteditable='true'] & {
    table {
      td,
      th {
        border: #d3d3d3 1px dotted;
        min-width: 10px;
      }
    }
  }
`
