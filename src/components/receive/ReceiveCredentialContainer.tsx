import styled from '@emotion/styled'
import { Button, FlexHorizontal, Skelton, Text } from 'kai-kit'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo } from 'react'
import { PiCheckCircleDuotone, PiWarningDuotone } from 'react-icons/pi'
import { Banner } from '../app/Banner'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { PIZZA_PARTY_CRED_ID, isPizzaPartyCred } from '@/constants/campaign'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import { useMyVerifiableCredential } from '@/hooks/useMyVerifiableCredential'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { useStateRPath } from '@/jotai/ui'
import { CredReceiveProps } from '@/pages/creds/receive/[id]'

export const ReceiveCredentialContainer: FC<CredReceiveProps> = ({ id }) => {
  const { did, vessId } = useVESSAuthUser()
  const router = useRouter()
  const { credItem, isInitialLoading } = useCredentialItem(id)
  const { formatedCredentials } = useVerifiableCredentials(did)
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

  const alreadyReceived = useMemo(() => {
    if (!formatedCredentials) return false
    return formatedCredentials.some((c) => c.credId === id)
  }, [formatedCredentials, id])

  return (
    <ReceiveCredentialFrame className='dark'>
      <CredentialFrame>
        <Skelton
          width='var(--kai-size-ref-192)'
          height='var(--kai-size-ref-192)'
          radius='var(--kai-size-sys-round-full)'
          className='dark'
          isLoading={isInitialLoading}
        ></Skelton>
        <FlexVertical gap='24px' justifyContent='center' alignItems='center'>
          {!isInitialLoading && credItem?.image && (
            <ImageContainer
              src={credItem?.image}
              width='var(--kai-size-ref-192)'
              height='auto'
              objectFit='contain'
            />
          )}
          <Text
            as='h2'
            typo='headline-sm'
            align='center'
            color='var(--kai-color-sys-on-background)'
          >
            {credItem?.title}
          </Text>
          {credItem?.sticker && credItem?.sticker.length > 0 && (
            <FlexVertical
              gap='var(--kai-size-sys-space-md)'
              justifyContent='center'
              alignItems='center'
              padding='32px 0'
            >
              <Text as='span' typo='title-md' color='var(--kai-color-sys-neutral)'>
                ステッカー
              </Text>
              <FlexHorizontal
                gap='var(--kai-size-sys-space-sm)'
                justifyContent='center'
                alignItems='center'
              >
                {credItem?.sticker.map((s, index) => (
                  <ImageContainer
                    key={s.id}
                    src={s.image}
                    width='var(--kai-size-ref-80)'
                    objectFit='contain'
                    height='auto'
                  />
                ))}
              </FlexHorizontal>
            </FlexVertical>
          )}
          {receiveStatus === 'success' && (
            <>
              <Text
                as='span'
                typo='title-md'
                align='center'
                color='var(--kai-color-sys-secondary)'
                startContent={<PiCheckCircleDuotone size='24px' />}
              >
                受け取りが完了しました！
              </Text>
              {credItem?.sticker && credItem?.sticker.length > 0 && (
                <Button width='100%' onPress={() => router.push(`/post/add`)}>
                  ステッカーを使ってみる
                </Button>
              )}
            </>
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
      </CredentialFrame>
      <ActionFrame>
        {!did ? (
          <>
            <Button variant='filled' width='100%' onPress={handleIssue}>
              ログインして受け取る
            </Button>
          </>
        ) : (
          <>
            {receiveStatus === 'success' && (
              <>
                {id && isPizzaPartyCred(id) ? (
                  <>
                    <Text
                      as='span'
                      typo='title-md'
                      align='center'
                      color='var(--kai-color-sys-secondary)'
                      startContent={<PiCheckCircleDuotone size='24px' />}
                    >
                      受け取りが完了しました！
                    </Text>
                  </>
                ) : (
                  <>
                    <Button
                      variant='text'
                      width='100%'
                      onPress={() => {
                        if (vessId) {
                          router.push(`/${vessId}`)
                        } else if (did) {
                          return router.push(`/did/${did}`)
                        } else {
                          return router.push(`/`)
                        }
                      }}
                    >
                      ホームに戻る
                    </Button>
                  </>
                )}
              </>
            )}
            {receiveStatus === 'failed' && (
              <Button width='100%' onPress={handleIssue}>
                もう一度試す
              </Button>
            )}
            {(receiveStatus === 'default' || receiveStatus === 'receiving') && (
              <>
                <Button
                  width='100%'
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
                  width='100%'
                  isDisabled={receiveStatus === 'receiving'}
                  onPress={() => {
                    if (vessId) {
                      router.push(`/${vessId}`)
                    } else if (did) {
                      return router.push(`/did/${did}`)
                    } else {
                      return router.push(`/`)
                    }
                  }}
                >
                  ホームへ戻る
                </Button>
              </>
            )}
          </>
        )}
      </ActionFrame>
    </ReceiveCredentialFrame>
  )
}

const ReceiveCredentialFrame = styled.div`
  position: fixed;
  inset: 0px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-ref-96);
  padding: var(--kai-size-ref-24);
  background: var(--kai-color-sys-background);
`

const CredentialFrame = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-sys-space-lg);
  width: 100%;
  padding: var(--kai-size-sys-space-md);
  padding-top: var(--kai-size-ref-112);
  padding-bottom: var(--kai-size-ref-320);
  overflow: scroll;
`

const ActionFrame = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding: var(--kai-size-sys-space-md);
  background: linear-gradient(to top, #000000ff, #00000000);

  & > button {
    max-width: var(--kai-size-ref-320);
  }
`
