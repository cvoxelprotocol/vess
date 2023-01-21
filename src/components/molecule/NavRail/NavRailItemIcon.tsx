import { css } from '@emotion/react'
import styled from '@emotion/styled'
import clsx from 'clsx'
import { FC, ReactElement, ReactNode } from 'react'

type Props = {
  children: ReactElement
  selected?: boolean
}

export const NavRailItemIcon: FC<Props> = ({ children, selected }) => {
  const IconWrapper = styled.div`
    width: 64px;
    height: 36px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 36px;
    ${(props) =>
      props.className?.split(' ').indexOf('selected') != -1 &&
      css`
        background: #004a78 !important;
      `}
    &:hover {
      transition: ease-in-out 150ms;
      background: rgba(0, 74, 120, 0.2);
    }
  `

  return (
    <IconWrapper className={clsx(selected && 'selected')} id='nav-item-icon'>
      {children}
    </IconWrapper>
  )
}
