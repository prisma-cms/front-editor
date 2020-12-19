import styled from 'styled-components'

export const TagEditorStyled = styled.div`
  resize: vertical;
  overflow: auto;
  min-height: 1rem;
  border: 1px solid #ddd;
  padding: 3px;

  > * {
    &:focus {
      outline: none;
    }
  }

  table {
    td,
    th {
      border: #d3d3d3 1px dotted;
      min-width: 10px;
    }
  }
`
