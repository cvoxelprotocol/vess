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
} from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useEffect, useRef, useState } from 'react'
import { PiArrowClockwise, PiCheckCircle, PiX, PiCopyBold, PiWarning } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import useScrollCondition from '@/hooks/useScrollCondition'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { getVESSService } from '@/lib/vess'

export type CredDetailProps = {
  id?: string
}

export const CredentialDetailContainer: FC<CredDetailProps> = ({ id }) => {
  const { did } = useDIDAccount()
  const router = useRouter()
  const { certificates, attendances, memberships, isInitialLoading, CredentialsByHolder } =
    useVerifiableCredentials(did)
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

  const verify = async (plainCred: string) => {
    const vessKit = getVESSService()
    setVerified('verifying')
    const result = await vessKit.verifyCredential(plainCred) // plainCredentialはJSON文字列
    setTimeout(() => {
      if (result.verified === true) {
        setVerified('verified')
      } else {
        setVerified('failed')
      }
    }, 600)
  }
  const [verified, setVerified] = useState<'verified' | 'failed' | 'verifying'>('verifying')
  useEffect(() => {
    verify(CredentialsByHolder?.data[0]?.plainCredential || '{}')
  }, [CredentialsByHolder?.data[0]?.plainCredential])

  return (
    <>
      <CredDetailFrame
        data-scroll-down={
          (scrollInfo.direction == 'down' && scrollInfo.positionY > 100) || undefined
        }
      >
        <CredImageFrame>
          <Skelton
            isLoading={!memberships[0]?.credentialSubject.membershipIcon}
            width='100%'
            radius='24px'
            height='auto'
            aspectRatio='1.618 / 1'
          >
            <ImageContainer
              src={memberships[0]?.credentialSubject.membershipIcon}
              // src='/sample/event_sample.jpg'
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
                  ? 'この証明書は有効です'
                  : verified === 'verifying'
                  ? '検証中'
                  : 'この証明書は無効です'}
              </Chip>

              <IconButton
                size='xs'
                icon={<PiArrowClockwise />}
                color='neutral'
                variant='tonal'
                round='sm'
                onPress={() => verify(CredentialsByHolder?.data[0]?.plainCredential || '')}
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
              {memberships[0]?.credentialSubject.membershipName}
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
                (どこから取得できるかわかりませんでした。)
              </Text>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                発行者
              </Text>
              <FlexHorizontal gap='var(--kai-size-sys-space-xs)'>
                <ImageContainer
                  src={memberships[0]?.credentialSubject.organizationIcon}
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
                  {memberships[0]?.credentialSubject.organizationName}
                </Text>
              </FlexHorizontal>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                所有者
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {memberships[0]?.credentialSubject.id}
              </Text>
            </InfoItemFrame>
            <InfoItemFrame>
              <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
                有効開始日
              </Text>
              <Text
                typo='body-lg'
                color='var(--kai-color-sys-on-layer)'
                isLoading={isInitialLoading}
              >
                {memberships[0]?.credentialSubject.startDate}
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
                {memberships[0]?.credentialSubject.endDate || '無期限'}
              </Text>
            </InfoItemFrame>
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
                    copy(
                      JSON.stringify(
                        JSON.parse(CredentialsByHolder?.data[0]?.plainCredential || '{}'),
                        null,
                        2,
                      ),
                    )
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
                  {JSON.stringify(
                    JSON.parse(CredentialsByHolder?.data[0]?.plainCredential || '{}'),
                    null,
                    2,
                  )}
                </JsonFrame>
              </PlainCredFrame>
            </InfoItemFrame>
          </InfoItemsFrame>
          <ActionFrame>
            <Button
              variant='outlined'
              color='subdominant'
              startContent={<PiX />}
              onPress={() => router.push(`/did/${did}`)}
              size='sm'
            >
              閉じる
            </Button>
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
  transition: all 1.5s var(--kai-motion-sys-easing-standard);

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
  justify-content: space-between;
  gap: var(--kai-size-sys-space-md);
  width: 100%;
  background: var(--kai-color-sys-layer-default);
`
