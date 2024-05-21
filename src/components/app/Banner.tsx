import styled from '@emotion/styled'
import React, { FC } from 'react'
import { Button } from 'react-aria-components'
import type { ButtonProps } from 'react-aria-components'

export type BannerProps = {
  imgUrl: string
} & ButtonProps

export const Banner: FC<BannerProps> = ({ imgUrl, ...props }) => {
  return <BannerFrame {...props} imgUrl={imgUrl} />
}

const BannerFrame = styled(Button)<{ imgUrl: string }>`
  width: var(--kai-size-ref-240);
  height: var(--kai-size-sys-widget-2xl);
  flex-shrink: 0;
  background-image: url(${({ imgUrl }) => imgUrl});
  background-size: cover;
  outline: none;
  border-radius: var(--kai-size-sys-round-md);
  border: 1px solid var(--kai-color-sys-neutral-outline);
  transition: transform var(--kai-motion-sys-duration-fast) var(--kai-motion-sys-easing-standard);
  cursor: pointer;

  &[data-hovered] {
    transform: scale(1.02);
  }
`
