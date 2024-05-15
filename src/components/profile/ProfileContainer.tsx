import styled from '@emotion/styled'
import { useScroll } from 'framer-motion'
import {
  FlexHorizontal,
  IconButton,
  Text,
  useModal,
  Skelton,
  FlexVertical,
  useBreakpoint,
} from 'kai-kit'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { FiMenu } from 'react-icons/fi'
import { PiPaintBrushBroadDuotone, PiExport, PiPencil } from 'react-icons/pi'
import { useNCLayoutContext } from '../app/NCLayout'
import { AvatarEditModal } from '../avatar/AvatarEditModal'

import { CredItem } from '../home/CredItem'
import { ProfileEditModal } from '../home/ProfileEditModal'
import { IdPlate } from './IdPlate'
import { useAvatar } from '@/hooks/useAvatar'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useENS } from '@/hooks/useENS'
import { useImage } from '@/hooks/useImage'
import { useLensProfile } from '@/hooks/useLensProfile'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { shareOnX } from '@/utils/share'

type ProfileContainerProps = {
  did: string
}

export const ProfileContainer: FC<ProfileContainerProps> = ({ did }) => {
  const { originalAddress } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { avatars, isInitialLoading: isLoadingAvatars } = useAvatar(did)
  const { openModal } = useModal()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: scrollRef,
  })
  const { ccProfile, ccLoading } = useCcProfile(did)
  const { ensProfile, isInitialLoading: ensLoading } = useENS(originalAddress as `0x${string}`)
  const { formatedCredentials, isInitialLoading } = useVerifiableCredentials(did)
  const [scrollProgress, setScrollProgress] = useState(1)
  const { openNavigation } = useNCLayoutContext()
  const { matches } = useBreakpoint()

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      const progress = Math.max(0, Math.min(1, 1 - latest / 300))
      setScrollProgress(progress)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const profileAvatar = useMemo(() => {
    return avatars?.find((avatar) => avatar.isProfilePhoto)
  }, [avatars, vsUser?.avatar])

  const avatarImageUrl = useMemo(() => {
    return profileAvatar?.avatarUrl || vsUser?.avatar || 'default_profile.jpg'
  }, [profileAvatar, vsUser?.avatar])

  const { image: avatarImage } = useImage(avatarImageUrl)

  const downloadAvatar = async () => {
    if (!avatarImage || !avatarImageUrl) return
    const ext = avatarImageUrl.split('.').pop()
    const canvas = document.createElement('canvas')
    canvas.width = avatarImage.naturalWidth
    canvas.height = avatarImage.naturalHeight
    const context = canvas.getContext('2d')
    if (context) {
      context.drawImage(avatarImage, 0, 0)
      const a = document.createElement('a')
      canvas.toBlob((blob: Blob | null) => {
        if (blob) {
          a.href = URL.createObjectURL(blob)
          a.download = `vess-avatar.${ext}`
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        }
      })
    }
  }

  const Tweet = () => {
    //Dont upload this to production!!
    const currentUrl = window.location.href
    const intent = shareOnX('hgeo', avatarImageUrl, currentUrl)
    window.open(intent, '_blank')
  }

  return (
    <>
      <ProfileFrame>
        {/* <DefaultHeader style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10 }} /> */}
        <ProfileTop scrollProgress={scrollProgress}>
          {!matches.lg && (
            <IconButton
              icon={<FiMenu size={32} />}
              variant='outlined'
              color='neutral'
              onPress={() => openNavigation()}
              size='md'
              style={{
                position: 'absolute',
                top: 'var(--kai-size-sys-space-md)',
                left: 'var(--kai-size-sys-space-md)',
                zIndex: 10,
              }}
            />
          )}
          <Skelton
            isLoading={!profileAvatar?.avatarUrl && !vsUser?.avatar}
            width='100%'
            aspectRatio='1'
          >
            <ProfileImage
              src={avatarImageUrl}
              alt='プロフィール画像'
              key={profileAvatar?.avatarUrl || vsUser?.avatar}
            />
          </Skelton>
          <IconButton
            variant='tonal'
            color='subdominant'
            size='md'
            icon={<PiPaintBrushBroadDuotone size={24} />}
            onPress={() => openModal()}
            style={{
              position: 'absolute',
              bottom: 'var(--kai-size-sys-space-md)',
              left: 'var(--kai-size-sys-space-md)',
              zIndex: 10,
            }}
          />
          <FlexVertical
            gap='var(--kai-size-sys-space-sm)'
            justifyContent='center'
            alignItems='center'
            style={{
              position: 'absolute',
              bottom: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
            }}
          >
            {/* <IconButton
              variant='tonal'
              color='dominant'
              size='md'
              icon={<BsTwitterX size={24} />}
              onPress={() => Tweet()}
            /> */}
            <IconButton
              variant='tonal'
              color='dominant'
              size='md'
              icon={<PiExport size={24} />}
              onPress={() => downloadAvatar()}
            />
          </FlexVertical>
        </ProfileTop>
        <ProfileInfoOuterFrame ref={scrollRef}>
          <DummyBox />
          <ProfileInfoFrame>
            <ScrollIndicator />
            <FlexVertical width='100%' gap='var(--kai-size-sys-space-sm)'>
              <BasicProfileFrame>
                <FlexHorizontal
                  justifyContent='start'
                  width='100%'
                  gap='var(--kai-size-sys-space-xs)'
                >
                  <Text
                    typo='headline-sm'
                    color={'var(--kai-color-sys-on-layer)'}
                    isLoading={isLoadingUser}
                  >
                    {vsUser?.name}
                  </Text>
                  <IconButton
                    icon={<PiPencil />}
                    variant='text'
                    color='neutral'
                    size='xs'
                    onPress={() => openModal('profileEdit')}
                  />
                </FlexHorizontal>
                <Text typo='body-md' color={'var(--kai-color-sys-on-layer)'} lineClamp={3}>
                  {vsUser?.description}
                </Text>
              </BasicProfileFrame>
              <FlexHorizontal
                gap='var(--kai-size-sys-space-xs)'
                width='100%'
                flexWrap='no-wrap'
                style={{ overflow: 'scroll', paddingLeft: 'var(--kai-size-sys-space-md)' }}
              >
                <IdPlate iconURL={'/brand/vess.png'} id={originalAddress as string} />
                {ensProfile && <IdPlate iconURL={'/brand/ens.png'} id={ensProfile?.displayName} />}
                {ccProfile && (
                  <IdPlate iconURL={'/brand/cyberconnect.png'} id={ccProfile?.displayName} />
                )}
              </FlexHorizontal>
            </FlexVertical>
            <FlexVertical
              gap='var(--kai-size-sys-space-sm)'
              width='100%'
              style={{ overflowY: 'visible' }}
            >
              <Text
                typo='title-lg'
                color='var(--kai-color-sys-on-layer)'
                style={{
                  padding: '0 var(--kai-size-sys-space-md)',
                }}
              >
                最新の証明書
              </Text>
              <FlexHorizontal
                gap='var(--kai-size-sys-space-sm)'
                flexWrap='nowrap'
                style={{
                  width: '100%',
                  padding: '0 var(--kai-size-sys-space-md)',
                  overflowY: 'visible',
                  overflowX: 'scroll',
                }}
              >
                {(formatedCredentials && formatedCredentials.length) > 0 ? (
                  <>
                    {formatedCredentials.map((credential) => (
                      <>
                        <CredItem
                          key={credential.id}
                          image={credential.image}
                          name={credential.title}
                          credId={credential.id}
                          height='var(--kai-size-ref-128)'
                        />
                      </>
                    ))}
                  </>
                ) : (
                  <Text typo='label-lg' color='var(--kai-color-sys-neutral)'>
                    最新の証明書はありません
                  </Text>
                )}
              </FlexHorizontal>
            </FlexVertical>
          </ProfileInfoFrame>
        </ProfileInfoOuterFrame>
      </ProfileFrame>
      <AvatarEditModal profileAvatar={profileAvatar} />
      <ProfileEditModal name={'profileEdit'} did={did || ''} />
    </>
  )
}

const ProfileFrame = styled.div`
  position: relative;
  height: 100vh;
  overflow: scroll;
`
const ProfileTop = styled.div<{ scrollProgress: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1;
  border-radius: ${({ scrollProgress }) => (scrollProgress < 0.9 ? '24px' : '0px')};
  opacity: ${({ scrollProgress }) => 0.4 + 0.6 * scrollProgress};
  transform: scale(${({ scrollProgress }) => 0.95 + 0.05 * scrollProgress});
  z-index: 1;
  transition: var(--kai-motion-sys-easing-standard) var(--kai-motion-sys-duration-slow);
  transition-property: opacity transform border-radius;
  overflow: hidden;
`

const ProfileImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
`

const ProfileInfoOuterFrame = styled.div`
  position: absolute;
  top: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100vh;
  overflow: scroll;
`

const DummyBox = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 100%;
  aspect-ratio: 1;
  pointer-events: none;
`

const ProfileInfoFrame = styled.div`
  display: flex;
  position: relative;
  flex-shrink: 0;
  flex-direction: column;
  gap: var(--kai-size-sys-space-lg);
  height: 800px;
  max-height: 90%;
  padding-top: var(--kai-size-sys-space-xl);
  padding-left: var(--kai-size-sys-space-none);
  padding-right: var(--kai-size-sys-space-none);
  background: var(--kai-color-sys-layer-default);
  border-top: var(--kai-size-ref-1) solid var(--kai-color-sys-neutral-outline);
  z-index: 10;
`
const ScrollIndicator = styled.div`
  position: absolute;
  top: var(--kai-size-ref-8);
  left: 50%;
  transform: translate(-50%, 0);
  width: var(--kai-size-ref-128);
  height: var(--kai-size-ref-4);
  background: var(--kai-color-sys-neutral-outline);
  border-radius: var(--kai-size-ref-8);
`

const BasicProfileFrame = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding-left: var(--kai-size-sys-space-md);
  padding-right: var(--kai-size-sys-space-md);
`
