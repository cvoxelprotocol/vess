import styled from '@emotion/styled'
import { Button, Skelton, Text } from 'kai-kit'
import { useRouter } from 'next/router'
import React, { FC, useEffect } from 'react'
import { PiCheckCircleDuotone, PiWarningDuotone } from 'react-icons/pi'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { useMyVerifiableCredential } from '@/hooks/useMyVerifiableCredential'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useStateRPath } from '@/jotai/ui'
import { CredReceiveProps } from '@/pages/creds/receive/[id]'

export const ReceiveCredentialContainer: FC<CredReceiveProps> = ({ id }) => {
  const { did } = useVESSAuthUser()
  const router = useRouter()
  const { credItem, isInitialLoading } = useCredentialItem(id)
  const [rPath, setRpath] = useStateRPath()
  const { issue } = useMyVerifiableCredential()
  const [receiveStatus, setReceiveStatus] = React.useState<
    'default' | 'receiving' | 'success' | 'failed'
  >('default')

  console.log({ credItem })

  useEffect(() => {
    setReceiveStatus('default')
  }, [])

  const handleIssue = async () => {
    if (!did) {
      setRpath(router.asPath)
      router.push(`/login`)
      return
    }
    try {
      if (credItem) {
        setReceiveStatus('receiving')
        const isSuccess = await issue(credItem)
        if (isSuccess) {
          setReceiveStatus('success')
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
                受け取りが完了しました
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
                受け取りに失敗しました
              </Text>
            )}
          </FlexVertical>
        </FlexVertical>
        <FlexVertical width='100%' alignItems='center' gap='var(--kai-size-ref-8)'>
          {!did ? (
            <>
              <Button variant='filled' width='var(--kai-size-ref-240)' onPress={handleIssue}>
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
              {receiveStatus === 'failed' && (
                <Button width='var(--kai-size-ref-240)' onPress={handleIssue}>
                  もう一度試す
                </Button>
              )}
              {(receiveStatus === 'default' || receiveStatus === 'receiving') && (
                <>
                  <Button
                    width='var(--kai-size-ref-240)'
                    onPress={handleIssue}
                    isLoading={receiveStatus === 'receiving'}
                    loadingText={receiveStatus === 'receiving' ? '受け取り中' : '受け取る'}
                  >
                    受け取る
                  </Button>
                  <Button
                    variant='text'
                    size='sm'
                    round='md'
                    isDisabled={receiveStatus === 'receiving'}
                    onPress={() => {
                      if (did) {
                        router.push(`/did/${did}`)
                      }
                    }}
                  >
                    受け取らずにホームへ
                  </Button>
                </>
              )}
            </>
          )}
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
  background: var(--kai-color-sys-background);
`
