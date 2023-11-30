import styled from '@emotion/styled'

type CardListLayoutProps = {
  width?: string
  cardMinWidth?: string
  gap?: string
  colGap?: string
  rowGap?: string
}

export const CardListLayout = styled.div<CardListLayoutProps>`
  width: ${(props) => props.width};
  display: grid;
  grid-template-columns: ${(props) => `repeat(auto-fill, minmax(${props.cardMinWidth}, 1fr))`};
  grid-column-gap: ${(props) => (props.gap ? props.gap : props.colGap)};
  grid-row-gap: ${(props) => (props.gap ? props.gap : props.rowGap)};
  justify-content: center;
`

CardListLayout.defaultProps = {
  width: '100%',
  cardMinWidth: '240px',
  gap: '24px',
  colGap: '24px',
  rowGap: '24px',
}
