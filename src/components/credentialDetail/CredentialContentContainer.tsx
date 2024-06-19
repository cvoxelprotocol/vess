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
import { FC, useEffect, useMemo, useRef } from 'react'
import { PiArrowClockwise, PiCheckCircle, PiX, PiCopyBold, PiWarning } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useCredentialItem } from '@/hooks/useCredentialItem'
import useScrollCondition from '@/hooks/useScrollCondition'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useStateVcVerifiedStatus } from '@/jotai/ui'
// import { Tab, TabList, TabPanel, Tabs } from '@/components/home/tab'

export type CredDetailProps = {
  id?: string
}

export const CredentialContentContainer: FC<CredDetailProps> = ({ id }) => {
  const { did } = useVESSAuthUser()
  const router = useRouter()
  const { credItem, isInitialLoading } = useCredentialItem(id)
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

  console.log({ credItem })

  const issuer = useMemo(() => {
    if (!credItem) return { name: 'Unknown', icon: '/default_profile.jpg' }
    if (credItem.organization) {
      return {
        name: credItem.organization.name,
        icon: credItem.organization.icon || '/default_profile.jpg',
      }
    } else if (credItem.user) {
      return {
        name: credItem.user.name,
        icon: credItem.user.avatar || '/default_profile.jpg',
      }
    }
    return {
      name: 'Unknown',
      icon: '/default_profile.jpg',
    }
  }, [credItem])

  return (
    <>
      <CredDetailFrame
        data-scroll-down={
          (scrollInfo.direction == 'down' && scrollInfo.positionY > 100) || undefined
        }
      >
        <CredImageFrame>
          <Skelton
            isLoading={isInitialLoading}
            width='100%'
            radius='24px'
            height='auto'
            aspectRatio='1.618 / 1'
          >
            <ImageContainer
              src={credItem?.image || credItem?.icon || ''}
              width='100%'
              height='fit-content'
              objectFit='contain'
              maxWidth='400px'
              maxHeight='240px'
              style={{ flex: '0 0 auto' }}
            />
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
              {credItem?.title || ''}
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
                {credItem?.description || '説明文はありません。'}
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
                  typo='body-lg'
                  color='var(--kai-color-sys-on-layer)'
                  isLoading={isInitialLoading}
                >
                  {issuer.name}
                </Text>
              </FlexHorizontal>
            </InfoItemFrame>
          </InfoItemsFrame>
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

// background: var(--kai-color-sys-layer-default);
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
