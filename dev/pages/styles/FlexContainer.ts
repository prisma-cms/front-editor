import styled from 'styled-components'

export const FlexContainer = styled.section`
  display: flex;
  flex-direction: column;
  height: 100%;

  > :nth-child(2n) {
    flex: 1;
    overflow: auto;
  }
`
