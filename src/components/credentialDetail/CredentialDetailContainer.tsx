import styled from '@emotion/styled'
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
import { VSUser, SetVisibleRequest } from '@/@types/credential'
import { ReservedPropKeys } from '@/constants/credential'
import { useCredentialItemWithHolder } from '@/hooks/useCredentialItemWithHolder'
import useScrollCondition from '@/hooks/useScrollCondition'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVerifiableCredential } from '@/hooks/useVerifiableCredential'
import { useStateVcVerifiedStatus } from '@/jotai/ui'
import { verifyCredential } from '@/lib/veramo'
import { formatDate, isExpired } from '@/utils/date'
import { removeUndefinedFromArray } from '@/utils/objectUtil'

export type CredDetailProps = {
  id?: string
}

export const CredentialDetailContainer: FC<CredDetailProps> = ({ id }) => {
  const { did } = useVESSAuthUser()
  const router = useRouter()
  const { isInitialLoading, credential, holder, setVisible, isLoadingSetVisible } =
    useVerifiableCredential(id)
  const { credItemWithHolder, isInitialLoading: isInitialLoadingCredItem } =
    useCredentialItemWithHolder(credential?.credentialItem?.id)
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

  const vcImage = useMemo(() => {
    if (!credential) return ''
    return credential.image || credential.credentialItem?.image || '/VESS_app_icon.png'
  }, [credential])

  const otherSubjectProps = useMemo(() => {
    if (!credential) return []
    const subject = credential?.vc.credentialSubject
    // remove ReservedPropKeys
    const keys = Object.keys(subject || {}).filter((key) => !ReservedPropKeys.includes(key))
    return keys.map((key) => {
      return {
        key: key,
        value: subject[key],
      }
    })
  }, [credential])

  //=== FIXME: temporary implementation ===
  const isMine = useMemo(() => {
    return did === credential?.holderDid
  }, [did, credential])

  const switchVisible = async () => {
    if (!credential) return
    try {
      const param: SetVisibleRequest = {
        credentialId: credential.id,
        hideFromPublic: !credential.hideFromPublic,
      }
      await setVisible(param)
    } catch (error) {
      console.error
    }
  }
  //=== FIXME: temporary implementation ===

  const verify = async (plainCred?: string) => {
    if (!plainCred) return
    setVerified('verifying')
    const vc = JSON.parse(plainCred)
    const exp = isExpired(vc.expirationDate as string | undefined)
    if (exp) {
      setVerified('expired')
      return
    }
    const result = await verifyCredential(plainCred)
    setTimeout(() => {
      if (result.verified === true) {
        setVerified('verified')
      } else {
        setVerified('failed')
      }
    }, 600)
  }

  useEffect(() => {
    if (credential?.plainCredential) {
      verify(credential?.plainCredential)
    }
  }, [credential?.plainCredential])

  const issuer = useMemo(() => {
    console.log({ credential })
    if (!credential) return { name: 'Unknown', icon: '/default_profile.jpg' }
    if (credential.organization) {
      return {
        name: credential.organization.name,
        icon: credential.organization.icon || '/default_profile.jpg',
      }
    } else if (credential.user) {
      return {
        name: credential.user.name,
        icon: credential.user.avatar || '/default_profile.jpg',
      }
    }
    return {
      name: credential.issuerDid,
      icon: '/default_profile.jpg',
    }
  }, [credential])

  const holderInfo = useMemo(() => {
    if (!holder) return { name: credential?.holderDid, icon: '/default_profile.jpg' }
    return {
      name: holder.name || holder.did,
      icon: holder.avatar || '/default_profile.jpg',
    }
  }, [holder, credential])

  const otherHolders = useMemo(() => {
    if (
      !credItemWithHolder ||
      !credItemWithHolder.credentialsWithHolder ||
      credItemWithHolder.credentialsWithHolder.length === 0
    )
      return []
    return removeUndefinedFromArray<VSUser>(
      credItemWithHolder.credentialsWithHolder.map((ch) => ch.holder).filter((h) => h?.did !== did),
    )
  }, [credItemWithHolder])

  return (
    <>
      <CredDetailFrame
        data-scroll-down={
          (scrollInfo.direction == 'down' && scrollInfo.positionY > 100) || undefined
        }
      >
        <CredImageFrame>
          <Skelton
            isLoading={!vcImage}
            width='100%'
            radius='24px'
            height='auto'
            aspectRatio='1.618 / 1'
          >
            <ImageContainer
              src={vcImage}
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
                onPress={() => verify(credential?.plainCredential)}
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
              {credential?.title || ''}
            </Text>
          </div>
          {isMine && (
            <FlexHorizontal width='100%' gap={`var(--kai-size-sys-space-xs)`}>
              <>
                <Switch
                  isSelected={!credential?.hideFromPublic}
                  onChange={() => switchVisible()}
                ></Switch>
                <Text typo='label-lg' color='var(--kai-color-sys-on-layer)'>
                  公開する
                </Text>
                {isLoadingSetVisible && <Spinner size='sm' color='neutral' />}
              </>
            </FlexHorizontal>
          )}

          <InfoItemsFrame ref={scrollRef}>
            {credential?.vc.credentialSubject.sticker &&
              credential?.vc.credentialSubject.sticker.length > 0 && (
                <InfoItemFrame>
                  <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                    ステッカー
                  </Text>
                  <StickerListFrame>
                    {credential?.vc.credentialSubject.sticker.map((s: string) => (
                      <ImageContainer key={s} src={s} width='100%' objectFit='contain' />
                    ))}
                  </StickerListFrame>
                </InfoItemFrame>
              )}
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                説明文
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {credential?.credentialItem?.description || '説明文はありません。'}
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
                {/* <Button
                  variant='text'
                  style={{ padding: '0' }}
                  // color='var(--kai-color-sys-on-layer)'
                  color='neutral'
                  onPress={() => router.push(`/did/${credential?.issuerDid}`)}
                  size='sm'
                >
                  {issuer.name}
                </Button> */}
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
                <Button
                  style={{ padding: '0' }}
                  align='start'
                  variant='text'
                  // color='var(--kai-color-sys-on-layer)'
                  color='neutral'
                  onPress={() => router.push(`/did/${credential?.vc.credentialSubject.id}`)}
                  size='sm'
                >
                  {holderInfo.name}
                </Button>
              </FlexHorizontal>
            </InfoItemFrame>
            {credential?.credentialType?.name === 'attendance' &&
              credential?.vc.credentialSubject.startDate && (
                <InfoItemFrame>
                  <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                    開始日
                  </Text>
                  <Text
                    typo='body-lg'
                    color='var(--kai-color-sys-on-layer)'
                    isLoading={isInitialLoading}
                  >
                    {formatDate(credential?.vc.credentialSubject.startDate)}
                  </Text>
                </InfoItemFrame>
              )}
            {credential?.credentialType?.name === 'attendance' &&
              credential?.vc.credentialSubject.endDate && (
                <InfoItemFrame>
                  <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                    終了日
                  </Text>
                  <Text
                    typo='body-lg'
                    color='var(--kai-color-sys-on-layer)'
                    isLoading={isInitialLoading}
                  >
                    {formatDate(credential?.vc.credentialSubject.endDate)}
                  </Text>
                </InfoItemFrame>
              )}
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                発行日
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {formatDate(credential?.vc.issuanceDate)}
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
                {formatDate(credential?.vc.expirationDate) || '無期限'}
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
                    <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
                      {prop.value}
                    </Text>
                  </InfoItemFrame>
                ))}
              </>
            )}
            {/* FIXME */}
            <InfoItemFrame>
              {otherHolders && otherHolders.length > 0 && (
                <InfoItemFrame>
                  <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                    他の所有者
                  </Text>
                  <StickerListFrame>
                    {otherHolders.map((holder: VSUser, index) => (
                      <ImageContainer
                        key={`${holder.id}-${index}`}
                        src={holder.avatar || 'https://app.vess.id/default_profile.jpg '}
                        width='100%'
                        objectFit='contain'
                        style={{ borderRadius: '50%' }}
                      />
                    ))}
                  </StickerListFrame>
                </InfoItemFrame>
              )}
              {/* FIXME */}
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
                    copy(JSON.stringify(JSON.parse(credential?.plainCredential || '{}'), null, 2))
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
                  {JSON.stringify(JSON.parse(credential?.plainCredential || '{}'), null, 2)}
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
