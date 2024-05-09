import styled from '@emotion/styled'
import { useScroll } from 'framer-motion'
import { Button, FlexHorizontal, IconButton, Text, useKai, useModal, Skelton } from 'kai-kit'
import { FC, useEffect, useMemo, useRef, useState } from 'react'
import { BsQrCodeScan } from 'react-icons/bs'
import { PiPaintBrushBroadDuotone, PiExport, PiPencil } from 'react-icons/pi'
import { DefaultHeader } from '../app/Header'
import { AvatarEditModal } from '../avatar/AvatarEditModal'

import { ProfileEditModal } from '../home/ProfileEditModal'
import { useAvatar } from '@/hooks/useAvatar'
import { useFileUpload } from '@/hooks/useFileUpload'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'

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
  const { icon } = useFileUpload()

  useEffect(() => {
    const unsubscribe = scrollY.onChange((latest) => {
      const progress = Math.max(0, Math.min(1, 1 - latest / 300))
      setScrollProgress(progress)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  // const profileAvatar = useMemo(() => {
  //   console.log('Avatar in useMemo: ', avatars)
  //   return avatars?.find((avatar) => avatar.isProfilePhoto)
  // }, [avatars])

  const profileAvatar = useMemo(() => {
    return avatars?.find((avatar) => avatar.isProfilePhoto)
  }, [avatars, vsUser?.avatar])

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
              src={(profileAvatar?.avatarUrl || vsUser?.avatar) ?? 'default_profile.jpg'}
              alt='プロフィール画像'
              key={'profileAvatar'}
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
          {/* <IconButton
            variant='filled'
            color='dominant'
            size='lg'
            icon={<BsQrCodeScan size={24} />}
            style={{
              position: 'absolute',
              top: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
            }}
          /> */}
          <IconButton
            variant='tonal'
            color='dominant'
            size='lg'
            icon={<PiExport size={24} />}
            style={{
              position: 'absolute',
              bottom: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
            }}
          />
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
      <AvatarEditModal />
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
