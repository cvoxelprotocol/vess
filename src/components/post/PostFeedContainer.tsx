import styled from '@emotion/styled'
import { FlexHorizontal, Skelton } from 'kai-kit'
import { FC, useEffect, useMemo } from 'react'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { Post } from '@/@types/user'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { usePostsAtom } from '@/jotai/ui'

type Props = {
  id?: string
}
export const PostFeedContainer: FC<Props> = ({ id }) => {
  const { credItem, isInitialLoading } = useCredentialItem(id)
  console.log({ credItem })
  const [posts, setPosts] = usePostsAtom()

  useEffect(() => {
    // subscribe to new posts
    const eventSource = new EventSource('http://localhost:3001/v2/subscribe/post')
    eventSource.onmessage = function (event) {
      console.log({ event })
      const newData = JSON.parse(event.data)
      console.log('New data received:', newData)
      setPosts((prev) => [...prev, newData.payload as Post])
    }

    return () => {
      eventSource.close()
    }
  }, [])

  const items = useMemo(() => {
    return [...posts, ...(credItem?.post || [])].sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
  }, [credItem?.post, posts])

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
            {items.map((post) => {
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
