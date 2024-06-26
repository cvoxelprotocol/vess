import styled from '@emotion/styled'
import { FlexHorizontal, FlexVertical, Text } from 'kai-kit'
import { FC } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'

type Props = {
  icon: string
  title: string
  issuerName?: string
  issuerIcon?: string
  isSelected?: boolean
} & React.HTMLAttributes<HTMLDivElement>

export const CredListItem: FC<Props> = ({ icon, title, issuerIcon, issuerName, ...props }) => {
  return (
    <Frame onClick={props.onClick} {...props}>
      <ImageContainer
        src={icon}
        width='var(--kai-size-ref-48)'
        height='var(--kai-size-ref-48)'
        objectFit='contain'
      />
      <FlexVertical>
        <Text typo='title-md' color={'var(--kai-color-sys-on-layer)'} lineClamp={1}>
          {title}
        </Text>
        {issuerIcon && issuerName && (
          <FlexHorizontal gap='var(--kai-size-sys-space-sm)'>
            <ImageContainer
              src={issuerIcon}
              width='var(--kai-size-ref-24)'
              height='auto'
              objectFit='contain'
            />
            <Text color={'var(--kai-color-sys-on-layer)'} lineClamp={1}>
              {issuerName}
            </Text>
          </FlexHorizontal>
        )}
      </FlexVertical>
    </Frame>
  )
}

const Frame = styled.div<{ isSelected?: boolean }>`
  display: flex;
  padding: 8px;
  width: 100%;
  align-items: center;
  gap: 8px;
  border-radius: 16px;
  border: ${(props) =>
    props.isSelected
      ? '1px solid var(--kai-color-sys-subdominant)'
      : '1px solid var(--kai-color-sys-neutral-outline-minor)'};
  background: ${(props) =>
    props.isSelected
      ? 'var(--kai-color-sys-subdominant-backing)'
      : 'var(--kai-color-sys-layer-default)'};
  z-index: 10;
`
