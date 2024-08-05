import styled from '@emotion/styled'
import { OriginalType, WrappedVerifiableCredential } from '@sphereon/ssi-types'
import copy from 'copy-to-clipboard'
import {
  Text,
  Chip,
  FlexHorizontal,
  IconButton,
  Skelton,
  Button,
  useSnackbar,
  Spinner,
  Switch,
} from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useEffect, useMemo, useRef } from 'react'
import { PiArrowClockwise, PiCheckCircle, PiX, PiCopyBold, PiWarning } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { ReservedPropKeys } from '@/constants/credential'
import { useOIDCredential } from '@/hooks/useOIDCredential'
import useScrollCondition from '@/hooks/useScrollCondition'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useStateVcVerifiedStatus } from '@/jotai/ui'
import { verifyCredential } from '@/lib/veramo'
import { formatDate, isExpired } from '@/utils/date'
import { isImage } from '@/utils/objectUtil'

export type CredDetailProps = {
  id?: string
}

export const OIDCredentialDetailContainer: FC<CredDetailProps> = ({ id }) => {
  const { user, userJwk } = useVESSAuthUser()
  const { isInitialLoading, oidCredential } = useOIDCredential(id)
  const [verified, setVerified] = useStateVcVerifiedStatus()
  const { openSnackbar } = useSnackbar({
    id: 'plain-cred-copied',
    text: '元データ(JSON)をコピーしました。',
  })
  const { openSnackbar: openURLCopied } = useSnackbar({
    id: 'share-url-copied',
    text: '共有用URLをコピーしました。',
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollInfo } = useScrollCondition(scrollRef)

  const localeBranding = useMemo(() => {
    if (
      !oidCredential?.credentials ||
      oidCredential?.credentials.brandings.length === 0 ||
      oidCredential?.credentials.brandings[0].localeBranding.length === 0
    )
      return
    return oidCredential?.credentials.brandings[0].localeBranding[0]
  }, [oidCredential])

  const name = useMemo(() => {
    return localeBranding ? localeBranding.alias : 'verifiable credential'
  }, [localeBranding])

  const image = useMemo(() => {
    return localeBranding
      ? localeBranding.background?.image?.uri || localeBranding.logo?.uri || ''
      : ''
  }, [localeBranding])

  const otherSubjectProps = useMemo(() => {
    if (!oidCredential) return []
    const subject = oidCredential.credentials.credential.decoded.credentialSubject
    // remove ReservedPropKeys
    const keys = Object.keys(subject || {}).filter((key) => !ReservedPropKeys.includes(key))
    return keys.map((key) => {
      return {
        key: key,
        value: subject[key],
      }
    })
  }, [oidCredential])

  const verify = async (plainCred?: WrappedVerifiableCredential) => {
    if (!plainCred) return
    setVerified('verifying')
    if (isExpired(plainCred.decoded.expirationDate)) {
      setVerified('expired')
      return
    }
    const isJWT = plainCred.type === OriginalType.JWT_ENCODED
    const result = await verifyCredential(plainCred.original, isJWT)
    setTimeout(() => {
      if (result?.verified === true) {
        setVerified('verified')
      } else {
        setVerified('failed')
      }
    }, 600)
  }

  useEffect(() => {
    if (oidCredential?.credentials.credential) {
      verify(oidCredential?.credentials.credential)
    }
  }, [oidCredential?.credentials.credential])

  const issuer = useMemo(() => {
    console.log({ oidCredential })
    if (!oidCredential) return { name: 'Unknown', icon: '/default_profile.jpg' }
    return {
      name:
        oidCredential.credentials.credential.decoded.issuer ||
        oidCredential.credentials.credential.decoded.iss,
      icon: '/default_profile.jpg',
    }
  }, [oidCredential])

  const holderInfo = useMemo(() => {
    return {
      name: oidCredential?.credentials.credential.decoded.sub || 'Unknown',
      icon: '/default_profile.jpg',
    }
  }, [oidCredential])

  return (
    <>
      <CredDetailFrame
        data-scroll-down={
          (scrollInfo.direction == 'down' && scrollInfo.positionY > 100) || undefined
        }
      >
        <CredImageFrame>
          <Skelton
            isLoading={!image}
            width='100%'
            radius='24px'
            height='auto'
            aspectRatio='1.618 / 1'
          >
            <ImageContainer
              src={image}
              width='100%'
              height='fit-content'
              objectFit='contain'
              maxWidth='400px'
              maxHeight='240px'
              style={{ flex: '0 0 auto' }}
            />
            <FlexHorizontal gap='var(--kai-size-sys-space-sm)'>
              <Chip
                variant='tonal'
                color={
                  verified === 'verified'
                    ? 'success'
                    : verified === 'verifying'
                    ? 'neutral'
                    : 'error'
                }
                startContent={
                  verified === 'verified' ? (
                    <PiCheckCircle size={24} />
                  ) : verified === 'verifying' ? (
                    <Spinner size='sm' color='neutral' />
                  ) : (
                    <PiWarning size={24} />
                  )
                }
              >
                {verified === 'verified'
                  ? 'この証明は有効です'
                  : verified === 'verifying'
                  ? '検証中'
                  : verified === 'expired'
                  ? 'この証明は期限切れです'
                  : 'この証明は無効です'}
              </Chip>

              <IconButton
                size='xs'
                icon={<PiArrowClockwise />}
                color='neutral'
                variant='tonal'
                round='sm'
                onPress={() => verify(oidCredential?.credentials.credential)}
              />
            </FlexHorizontal>
          </Skelton>
        </CredImageFrame>
        <CredInfoFrame>
          <div style={{ width: '100%', flex: 0 }}>
            <Text
              as='h2'
              typo='title-lg'
              color='var(--kai-color-sys-on-layer)'
              isLoading={isInitialLoading}
            >
              {name}
            </Text>
          </div>
          <InfoItemsFrame ref={scrollRef}>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                説明文
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {localeBranding?.description || '説明文はありません。'}
              </Text>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                発行者
              </Text>
              <FlexHorizontal gap='var(--kai-size-sys-space-xs)'>
                <ImageContainer
                  src={issuer.icon}
                  width='20px'
                  height='20px'
                  objectFit='contain'
                  alt='Organization Icon'
                />
                <Text
                  typo='body-md'
                  color='var(--kai-color-sys-on-layer)'
                  isLoading={isInitialLoading}
                >
                  {issuer.name}
                </Text>
              </FlexHorizontal>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                所有者
              </Text>
              <FlexHorizontal gap='var(--kai-size-sys-space-xs)'>
                <ImageContainer
                  src={holderInfo.icon}
                  width='20px'
                  height='20px'
                  objectFit='contain'
                  alt='Organization Icon'
                />
                <Text
                  typo='body-lg'
                  color='var(--kai-color-sys-on-layer)'
                  isLoading={isInitialLoading}
                >
                  {holderInfo.name}
                </Text>
              </FlexHorizontal>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                発行日
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {formatDate(oidCredential?.credentials.credential.decoded.issuanceDate)}
              </Text>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                有効期限日
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {formatDate(oidCredential?.credentials.credential.decoded.expirationDate) ||
                  '無期限'}
              </Text>
            </InfoItemFrame>
            {otherSubjectProps.length > 0 && (
              <>
                <InfoItemFrame>
                  <Text typo='title-lg' color='var(--kai-color-sys-on-layer-minor)'>
                    その他の項目
                  </Text>
                </InfoItemFrame>
                {otherSubjectProps.map((prop, index) => (
                  <InfoItemFrame key={index}>
                    <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                      {prop.key}
                    </Text>
                    {isImage(prop.value) ? (
                      <ImageContainer src={prop.value} width={'100%'} />
                    ) : (
                      <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
                        {prop.value}
                      </Text>
                    )}
                  </InfoItemFrame>
                ))}
              </>
            )}
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                元データ(JSON)
              </Text>
              <PlainCredFrame>
                <Chip
                  variant='tonal'
                  startContent={<PiCopyBold />}
                  color='subdominant'
                  onPress={() => {
                    openSnackbar()
                    copy(JSON.stringify(oidCredential?.credentials.credential.decoded, null, 2))
                  }}
                  style={{
                    position: 'absolute',
                    top: 'var(--kai-size-sys-space-sm)',
                    right: 'var(--kai-size-sys-space-sm)',
                  }}
                >
                  コピー
                </Chip>
                <JsonFrame>
                  {JSON.stringify(oidCredential?.credentials.credential.decoded, null, 2)}
                </JsonFrame>
              </PlainCredFrame>
            </InfoItemFrame>
          </InfoItemsFrame>
          <ActionFrame>
            <Button
              variant='tonal'
              color='subdominant'
              onPress={() => {
                openURLCopied()
                copy(`https://app.vess.id/creds/detail/${id}`)
              }}
              size='sm'
            >
              URLをコピー
            </Button>
          </ActionFrame>
        </CredInfoFrame>
      </CredDetailFrame>
    </>
  )
}

const CredDetailFrame = styled.div`
  width: 100%;
  height: 100svh;
  display: grid;
  grid-template-rows: 360px minmax(0, 1fr);
  transition: all var(--kai-motion-sys-duration-slow) var(--kai-motion-sys-easing-standard);

  &[data-scroll-down='true'] {
    grid-template-rows: var(--kai-size-ref-160) minmax(0, 1fr);
  }
`

const CredImageFrame = styled.div`
  grid-row: 1 / 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: start;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  padding: var(--kai-size-sys-space-xl) var(--kai-size-sys-space-md) var(--kai-size-sys-space-md);
`

const CredInfoFrame = styled.div`
  grid-row: 2 / 3;
  grid-column: 1 / 2;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: var(--kai-size-sys-space-lg);
  width: 100%;
  height: auto;
  padding: var(--kai-size-sys-space-lg) var(--kai-size-sys-space-md) var(--kai-size-sys-space-md);
  background: var(--kai-color-sys-layer-default);
  border-radius: var(--kai-size-sys-round-lg) var(--kai-size-sys-round-lg) 0 0;
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-neutral-outline);
  border-bottom: none;
  overflow: visible;
  z-index: var(--kai-z-index-sys-overlay-default);
`
const InfoItemsFrame = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: var(--kai-size-sys-space-lg);
  width: 100%;
  overflow-y: scroll;
`

const InfoItemFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: var(--kai-size-sys-space-xs);
  width: 100%;
`

const StickerListFrame = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  height: auto;
  place-items: center;
`

const PlainCredFrame = styled.div`
  position: relative;
  width: 100%;
  height: auto;
  padding: var(--kai-size-sys-space-md);
  background: var(--kai-color-sys-layer-farthest);
  border-radius: var(--kai-size-sys-round-md);
  border: var(--kai-size-ref-1) solid var(--kai-color-sys-neutral-outline);
`
const JsonFrame = styled.pre`
  width: 100%;
  white-space: pre-wrap;
  text-overflow: break-word;
  word-break: break-all;
  font-family: var(--kai-typo-sys-body-md-font-family);
  font-size: var(--kai-typo-sys-body-md-font-size);
  line-height: var(--kai-typo-sys-body-md-line-height);
  color: var(--kai-color-sys-on-layer-minor);
`

const ActionFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: end;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  background: var(--kai-color-sys-layer-default);
`
