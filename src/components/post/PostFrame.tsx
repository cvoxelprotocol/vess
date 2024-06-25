import styled from '@emotion/styled'
import { FlexHorizontal, Text } from 'kai-kit'
import React, { FC } from 'react'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'

type Props = {
  children: React.ReactNode
  date?: string
  userIcon?: string
  userId?: string
} & React.HTMLAttributes<HTMLDivElement>

export const PostFrame: FC<Props> = ({ children, date, userIcon, userId, ...props }) => {
  return (
    <ContentFrame {...props} className='light'>
      {children}
      <FlexHorizontal width='100%' justifyContent='space-between' background='transparent'>
        <FlexHorizontal gap='4px'>
          <ImageContainer
            src={userIcon || '/default_profile.jpg'}
            width='20px'
            height='20px'
            objectFit='contain'
            alt='User Icon'
            borderRadius='4px'
          />
          <Text typo='body-md' color='var(--kai-color-sys-neutral)'>
            {userId}
          </Text>
        </FlexHorizontal>
        <Text typo='body-md' color='var(--kai-color-sys-neutral)'>
          {date}
        </Text>
      </FlexHorizontal>
    </ContentFrame>
  )
}

const ContentFrame = styled.div`
  width: 100%;
  display: flex;
  padding: 16px 16px 12px 16px;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--kai-size-sys-space-lg);
  border-radius: 12px;
  background: linear-gradient(150deg, #fff 72.15%, #e9e9e9 105.4%);
  box-shadow: 0px 0px 2px 0px rgba(0, 0, 0, 0.25), 0px 2px 0px 0px var(--layer-shadow, #6d6163);
`
