import styled from '@emotion/styled'
import { Button } from 'kai-kit'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import { PiCheckCircleDuotone, PiWarningDuotone } from 'react-icons/pi'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { AddPostRequest, Post } from '@/@types/user'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { useMyVerifiableCredential } from '@/hooks/useMyVerifiableCredential'
import { usePost } from '@/hooks/usePost'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useStateRPath } from '@/jotai/ui'
import { Skelton } from '@/kai/skelton'
import { Text } from '@/kai/text/Text'

type Props = {
  id?: string
}
export const AddCredItemPostContainer: FC<Props> = ({ id }) => {
  const { did } = useVESSAuthUser()
  const { vsUser } = useVESSUserProfile(did)
  const router = useRouter()
  const { credItem, isInitialLoading } = useCredentialItem(id)
  const { addItem } = usePost()
  const [rPath, setRpath] = useStateRPath()
  const { issue } = useMyVerifiableCredential()
  const [receiveStatus, setReceiveStatus] = React.useState<
    'default' | 'receiving' | 'success' | 'failed'
  >('default')

  console.log({ credItem })

  useEffect(() => {
    setReceiveStatus('default')
  }, [])

  const handlePost = async () => {
    if (!did) {
      setRpath(router.asPath)
      router.push(`/login`)
      return
    }
    try {
      if (credItem) {
        //Save Canvas and get Canvas Id and image url

        const postItem: AddPostRequest = {
          userId: vsUser?.id || '',
          credentialItemId: credItem.id,
          image:
            'https://usericonupload.s3.ap-northeast-1.amazonaws.com/27ccf90a-478b-4d7b-9eeb-697f3e0d08f1.png',
          canvasId: '273486a0-a309-4e56-ace4-9c158fab0b9c',
        }
        const res = await addItem(postItem)
        if (res.status === 200) {
          const resJson = (await res.json()) as Post
          console.log({ resJson })
          if (resJson.id) {
            setReceiveStatus('success')
          }
        }
      }
    } catch (error) {
      console.log(error)
      setReceiveStatus('failed')
    }
  }

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
          <FlexVertical gap='4px' justifyContent='center' alignItems='center'>
            <Text as='h2' typo='headline-sm' color='var(--kai-color-sys-on-background)'>
              {credItem?.title}
            </Text>
            {receiveStatus === 'success' && (
              <Text
                as='span'
                typo='title-md'
                align='center'
                color='var(--kai-color-sys-secondary)'
                startContent={<PiCheckCircleDuotone size='24px' />}
              >
                Successfully posted
              </Text>
            )}
            {receiveStatus === 'failed' && (
              <Text
                as='span'
                typo='title-md'
                align='center'
                color='var(--kai-color-sys-error)'
                startContent={<PiWarningDuotone size='24px' />}
              >
                Failed to post
              </Text>
            )}
          </FlexVertical>
        </FlexVertical>
        <FlexVertical width='100%' alignItems='center' gap='var(--kai-size-ref-8)'>
          {!did ? (
            <>
              <Button variant='filled' width='var(--kai-size-ref-240)' onPress={handlePost}>
                ログインして受け取る
              </Button>
            </>
          ) : (
            <>
              {receiveStatus === 'success' && (
                <Button
                  variant='filled'
                  width='var(--kai-size-ref-240)'
                  onPress={() => {
                    if (did) {
                      return router.push(`/did/${did}`)
                    }
                  }}
                >
                  ホームに戻る
                </Button>
              )}
              {(receiveStatus === 'default' || receiveStatus === 'receiving') && (
                <>
                  <Button
                    width='var(--kai-size-ref-240)'
                    onPress={handlePost}
                    isLoading={receiveStatus === 'receiving'}
                    loadingText={receiveStatus === 'receiving' ? '受け取り中' : '受け取る'}
                  >
                    POST
                  </Button>
                </>
              )}
            </>
          )}
          <FlexVertical gap='var(--kai-size-ref-8)'>
            {credItem?.post &&
              credItem.post.length > 0 &&
              credItem.post.map((post) => {
                return (
                  <ImageContainer
                    key={post.id}
                    src={post.image || ''}
                    width='var(--kai-size-ref-192)'
                    objectFit='cover'
                  />
                )
              })}
          </FlexVertical>
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
