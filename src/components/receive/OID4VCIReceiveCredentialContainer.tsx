import styled from '@emotion/styled'
import { Button, Skelton, Text } from 'kai-kit'
import { useRouter } from 'next/router'
import React, { FC, useEffect, useMemo } from 'react'
import { PiCheckCircleDuotone, PiWarningDuotone } from 'react-icons/pi'
import { FlexVertical } from '../ui-v1/Common/FlexVertical'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useOID4VCI } from '@/hooks/useOID4VCI'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useStateRPath } from '@/jotai/ui'

export const OID4VCIReceiveCredentialContainer: FC = () => {
  const { user, userJwk } = useVESSAuthUser()
  const router = useRouter()
  const offerUri = router.query.offer as string

  const { processedOffer, isInitialLoading, getDisplayInfo, issueCredential } = useOID4VCI(offerUri)

  const metadata = useMemo(() => {
    if (!processedOffer?.metadata) return null
    return getDisplayInfo(processedOffer?.metadata)
  }, [processedOffer])

  const image = useMemo(() => {
    return (
      metadata?.credentialDisplay?.background_image || metadata?.credentialDisplay?.logo || null
    )
  }, [metadata])

  const [rPath, setRpath] = useStateRPath()
  const [receiveStatus, setReceiveStatus] = React.useState<
    'default' | 'receiving' | 'success' | 'failed'
  >('default')

  useEffect(() => {
    setReceiveStatus('default')
  }, [])

  const handleIssue = async () => {
    if (!user?.did) {
      setRpath(router.asPath)
      router.push(`/alpha/login`)
      return
    }
    try {
      if (!userJwk) {
        throw new Error('No user DID:JWK')
      }

      setReceiveStatus('receiving')
      const isSuccess = await issueCredential(userJwk.didValue)
      if (isSuccess) {
        setReceiveStatus('success')
      }
    } catch (error) {
      console.log(error)
      setReceiveStatus('failed')
    }
  }

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
        <FlexVertical gap='24px' justifyContent='center' alignItems='center' width='100%'>
          {!isInitialLoading && image && image.url && (
            <ImageContainer src={image.url} width='100%' height='auto' objectFit='contain' />
          )}
          <Text
            as='h2'
            typo='headline-sm'
            align='center'
            color='var(--kai-color-sys-on-background)'
          >
            {metadata?.credentialDisplay?.name}
          </Text>
        </FlexVertical>
        <FlexVertical gap='24px'>
          <FlexVertical gap='8px'>
            <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
              発行する目的
            </Text>
            <Text typo='body-lg' color='var(--kai-color-sys-on-background)'>
              VESSに保管するために発行します。
            </Text>
          </FlexVertical>
          <FlexVertical gap='8px'>
            {metadata?.credentialSubjectDisplay && (
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                発行項目
              </Text>
            )}
            {metadata?.credentialSubjectDisplay &&
              metadata?.credentialSubjectDisplay.map((item, index) => (
                <Text key={item.key} typo='body-lg' color='var(--kai-color-sys-on-background)'>
                  {item.name || item.key}
                </Text>
              ))}
          </FlexVertical>
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
        {!user?.did ? (
          <>
            <Button variant='filled' width='100%' onPress={handleIssue}>
              ログインして受け取る
            </Button>
          </>
        ) : (
          <>
            {receiveStatus === 'success' && (
              <Button
                variant='text'
                width='100%'
                onPress={() => {
                  if (user?.vessId) {
                    router.push(`/${user?.vessId}`)
                  } else if (user?.did) {
                    return router.push(`/did/${user?.did}`)
                  } else {
                    return router.push(`/`)
                  }
                }}
              >
                ホームに戻る
              </Button>
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
                    if (user?.vessId) {
                      router.push(`/${user?.vessId}`)
                    } else if (user?.did) {
                      return router.push(`/did/${user?.did}`)
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
