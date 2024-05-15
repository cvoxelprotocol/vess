import styled from '@emotion/styled'
import { FlexHorizontal } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC } from 'react'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { Skelton } from '@/kai/skelton'

type Props = {
  id?: string
}
export const PostFeedContainer: FC<Props> = ({ id }) => {
  const router = useRouter()
  const { credItem, isInitialLoading } = useCredentialItem(id)
  console.log({ credItem })

  return (
    <>
      <ReceiveCredentialFrame className='dark'>
        <FlexVertical width='100%' alignItems='center' gap='var(--kai-size-ref-24)'>
          <Skelton
            width='var(--kai-size-ref-192)'
            height='var(--kai-size-ref-192)'
            radius='var(--kai-size-sys-round-full)'
            className='dark'
            isLoading={isInitialLoading}
          ></Skelton>
          {!isInitialLoading && credItem?.image && (
            <ImageContainer
              src={credItem?.image}
              width='var(--kai-size-ref-192)'
              // height='var(--kai-size-ref-192)'
              objectFit='cover'
            />
          )}
          <FlexHorizontal gap='var(--kai-size-ref-8)'>
            {credItem?.post &&
              credItem.post.length > 0 &&
              credItem.post.map((post) => {
                return (
                  <ImageContainer
                    key={post.id}
                    src={post.image || ''}
                    width='var(--kai-size-ref-112)'
                    height='var(--kai-size-ref-112)'
                    objectFit='contain'
                  />
                )
              })}
            {credItem?.post &&
              credItem.post.length > 0 &&
              credItem.post.map((post) => {
                return (
                  <ImageContainer
                    key={post.id}
                    src={post.image || ''}
                    width='var(--kai-size-ref-112)'
                    height='var(--kai-size-ref-112)'
                    objectFit='contain'
                  />
                )
              })}
          </FlexHorizontal>
        </FlexVertical>
      </ReceiveCredentialFrame>
    </>
  )
}

const ReceiveCredentialFrame = styled.div`
  position: fixed;
  inset: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--kai-size-ref-96);

  padding: var(--kai-size-ref-24);
`
