import styled from '@emotion/styled'
import { useScroll } from 'framer-motion'
import { FlexHorizontal, IconButton, Text, useModal, Skelton, FlexVertical } from 'kai-kit'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { BsTwitterX } from 'react-icons/bs'
import { PiPaintBrushBroadDuotone, PiExport, PiPencil } from 'react-icons/pi'
import { AvatarEditModal } from '../avatar/AvatarEditModal'

import { ProfileEditModal } from '../home/ProfileEditModal'
import { useAvatar } from '@/hooks/useAvatar'
import { useImage } from '@/hooks/useImage'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { shareOnX } from '@/utils/share'

export const ProfileContainer: FC = () => {
  const { did } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { avatars, isInitialLoading: isLoadingAvatars } = useAvatar(did)
  const { openModal } = useModal()
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: scrollRef,
  })
  const [scrollProgress, setScrollProgress] = useState(1)

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
            size='lg'
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
            gap='4px'
            justifyContent='center'
            alignItems='center'
            style={{
              position: 'absolute',
              bottom: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
            }}
          >
            <IconButton
              variant='tonal'
              color='dominant'
              size='lg'
              icon={<BsTwitterX size={24} />}
              onPress={() => Tweet()}
            />
            <IconButton
              variant='tonal'
              color='dominant'
              size='lg'
              icon={<PiExport size={24} />}
              onPress={() => downloadAvatar()}
            />
          </FlexVertical>
        </ProfileTop>
        <ProfileInfoOuterFrame ref={scrollRef}>
          <DummyBox />
          <ProfileInfoFrame>
            <ScrollIndicator />
            <BasicProfileFrame>
              <FlexHorizontal justifyContent='space-between' width='100%'>
                <Text
                  typo='headline-sm'
                  color={'var(--kai-color-sys-on-layer)'}
                  isLoading={isLoadingUser}
                >
                  {vsUser?.name}
                </Text>
                <IconButton
                  icon={<PiPencil />}
                  variant='tonal'
                  color='neutral'
                  size='xs'
                  onPress={() => openModal('profileEdit')}
                />
              </FlexHorizontal>
              <Text typo='body-md' color={'var(--kai-color-sys-on-layer)'} lineClamp={3}>
                {vsUser?.description}
              </Text>
            </BasicProfileFrame>
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
  height: 800px;
  max-height: 90%;
  padding-top: var(--kai-size-sys-space-xl);
  padding-left: var(--kai-size-sys-space-md);
  padding-right: var(--kai-size-sys-space-md);
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
`
