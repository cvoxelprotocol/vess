import { relative } from 'path'
import styled from '@emotion/styled'
import { color, motion, px, transform, useScroll } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { Button, IconButton, Text, useKai, useModal } from 'kai-kit'
import Image from 'next/image'
import { FC, useEffect, useRef, useState } from 'react'
import { BsQrCodeScan } from 'react-icons/bs'
import { PiPaintBrushBroadDuotone, PiExport } from 'react-icons/pi'
import { AvatarEditModal } from '../avatar/AvatarEditModal'
import { StickersProvider } from '../avatar/StickersProvider'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'

export const ProfileContainer: FC = () => {
  const { did } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
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

  return (
    <>
      <ProfileFrame>
        <ProfileTop scrollProgress={scrollProgress}>
          <ProfileImage src={vsUser?.avatar ?? '/default_profile.jpg'} alt='プロフィール画像' />
          <IconButton
            variant='tonal'
            color='dominant'
            size='lg'
            icon={<PiPaintBrushBroadDuotone size={24} />}
            onPress={() => openModal()}
            style={{
              position: 'absolute',
              top: 'var(--kai-size-sys-space-md)',
              left: 'var(--kai-size-sys-space-md)',
              zIndex: 10,
            }}
          />
          <IconButton
            variant='filled'
            color='dominant'
            size='lg'
            icon={<BsQrCodeScan size={24} />}
            style={{
              position: 'absolute',
              top: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
            }}
          />
          <IconButton
            variant='tonal'
            color='dominant'
            size='lg'
            icon={<PiExport size={24} />}
            style={{
              position: 'absolute',
              top: '80px',
              right: 'var(--kai-size-sys-space-md)',
            }}
          />
        </ProfileTop>
        <ProfileInfoOuterFrame ref={scrollRef}>
          <DummyBox />
          <ProfileInfoFrame>
            <ScrollIndicator />
            <BasicProfileFrame>
              <Text typo='headline-sm' color={'var(--kai-color-sys-on-layer)'}>
                {vsUser?.name}
              </Text>
              <Text typo='body-md' color={'var(--kai-color-sys-on-layer)'} lineClamp={3}>
                {vsUser?.description}
              </Text>
              <IconButton
                variant='tonal'
                color='dominant'
                size='lg'
                icon={<PiPaintBrushBroadDuotone size={24} />}
                onPress={() => openModal()}
              />
            </BasicProfileFrame>
          </ProfileInfoFrame>
        </ProfileInfoOuterFrame>
      </ProfileFrame>
      <AvatarEditModal />
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
`
