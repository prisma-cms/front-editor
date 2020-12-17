import styled from "styled-components";

export const TagEditorToolbarStyled = styled.div`
  margin: 5px 0;
  border: 1px solid #ddd;

  .TagEditorToolbar--iconButton {
    height: 34px;
    width: 34px;

    .icon {
      height: 1rem;
      width: 1rem;
      position: absolute;
      &.disabled {
        color: rgba(0, 0, 0, 0.26);
        fill: rgba(0, 0, 0, 0.26);
      };
    }
  }
`;
