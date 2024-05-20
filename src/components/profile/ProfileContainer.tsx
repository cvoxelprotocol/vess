import styled from '@emotion/styled'
import { useScroll, motion, useTransform } from 'framer-motion'
import {
  FlexHorizontal,
  IconButton,
  Text,
  useModal,
  Skelton,
  FlexVertical,
  useBreakpoint,
} from 'kai-kit'
import { FC, useMemo, useRef } from 'react'
import { FiMenu } from 'react-icons/fi'
import { PiPaintBrushBroadDuotone, PiExport, PiPencil } from 'react-icons/pi'
import { getAddressFromPkh } from 'vess-kit-web'
import { useNCLayoutContext } from '../app/NCLayout'
import { AvatarEditModal } from '../avatar/AvatarEditModal'
import { CredItem } from '../home/CredItem'
import { ProfileEditModal } from '../home/ProfileEditModal'
import { IdPlate } from './IdPlate'
import { SocialLink } from '@/@types/user'
import { X_URL } from '@/constants/common'
import { useAvatar } from '@/hooks/useAvatar'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useENS } from '@/hooks/useENS'
import { useImage } from '@/hooks/useImage'
import { useShareLink } from '@/hooks/useShareLink'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { shortenStr } from '@/utils/objectUtil'
import { shareOnX } from '@/utils/share'

type ProfileContainerProps = {
  did: string
}

export const ProfileContainer: FC<ProfileContainerProps> = ({ did }) => {
  const { did: myDid } = useVESSAuthUser()
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { avatars } = useAvatar(did)
  const { openModal } = useModal()
  const { ccProfile } = useCcProfile(did)
  const { ensProfile } = useENS(getAddressFromPkh(did) as `0x${string}`)
  const { formatedCredentials } = useVerifiableCredentials(did)
  const { openNavigation } = useNCLayoutContext()
  const { matches } = useBreakpoint()
  const { shareLink } = useShareLink(undefined)

  // for Scroll Animation
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: scrollRef,
  })
  const sProgressY = useTransform(() => Math.max(0, Math.min(1, 1 - scrollY.get() / 300)))
  const borderRadius = useTransform(sProgressY, [0, 1], [24, 0])
  const opacity = useTransform(sProgressY, [0, 1], [0.4, 1])
  const scale = useTransform(sProgressY, [0, 1], [0.95, 1])

  const profileAvatar = useMemo(() => {
    return avatars?.find((avatar) => avatar.isProfilePhoto)
  }, [avatars])

  const avatarImageUrl = useMemo(() => {
    return vsUser?.avatar || profileAvatar?.avatarUrl || '/default_profile.jpg'
  }, [profileAvatar, vsUser?.avatar])

  const { image: avatarImage } = useImage(avatarImageUrl)

  const isEditable = useMemo(() => {
    return myDid === did
  }, [did, myDid])

  const xLink = useMemo(() => {
    return vsUser?.socialLink?.some((link) => link.title === 'X' && !!link.url && link.url !== '')
      ? (vsUser?.socialLink?.find((link) => link.title === 'X') as SocialLink)
      : undefined
  }, [vsUser?.socialLink])

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
        <ProfileTop
          style={{
            opacity: opacity,
            scale: scale,
            borderRadius: borderRadius,
          }}
        >
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
          <Skelton isLoading={isLoadingUser} width='100%' aspectRatio='1'>
            <ProfileImage
              src={avatarImageUrl}
              alt='プロフィール画像'
              key={profileAvatar?.avatarUrl || vsUser?.avatar}
            />
          </Skelton>
          {isEditable && (
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
          )}
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
            <IconButton
              variant='tonal'
              color='dominant'
              size='md'
              icon={<PiExport size={24} />}
              onPress={() =>
                shareLink(window.location.href, 'Check my own #DigitalIdentity with #vessid !')
              }
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
                    {vsUser?.name || shortenStr(did)}
                  </Text>
                  {isEditable && (
                    <IconButton
                      icon={<PiPencil />}
                      variant='text'
                      color='neutral'
                      size='xs'
                      onPress={() => openModal('profileEdit')}
                    />
                  )}
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
                <IdPlate
                  iconURL={'/brand/vess.png'}
                  id={`@${vsUser?.vessId}` || (getAddressFromPkh(did) as string)}
                />
                {xLink && (
                  <IdPlate
                    iconURL={'/brand/x_filled.png'}
                    id={xLink.displayLink || `@${xLink.url.replace(X_URL, '')}`}
                    onPress={() => {
                      window.open(xLink.url, '_blank')
                    }}
                  />
                )}
                {ensProfile && <IdPlate iconURL={'/brand/ens.png'} id={ensProfile?.displayName} />}
                {ccProfile && (
                  <IdPlate iconURL={'/brand/cyberconnect.png'} id={ccProfile?.displayName} />
                )}
              </FlexHorizontal>
            </FlexVertical>
            <FlexVertical
              gap='var(--kai-size-sys-space-sm)'
              width='100%'
              flexWrap='nowrap'
              style={{ flexGrow: 1, overflowY: 'hidden' }}
            >
              <Text
                typo='title-lg'
                color='var(--kai-color-sys-on-layer)'
                style={{
                  padding: '0 var(--kai-size-sys-space-md)',
                  flexShrink: 0,
                }}
              >
                最新の証明
              </Text>
              <CredList>
                {formatedCredentials && formatedCredentials.length > 0 ? (
                  <>
                    {formatedCredentials.map((credential, index) => (
                      <CredItem
                        key={`${credential.id}-${index}`}
                        image={credential.image}
                        name={credential.title}
                        credId={credential.id}
                        width={'100%'}
                      />
                    ))}
                  </>
                ) : (
                  <Text typo='label-lg' color='var(--kai-color-sys-neutral)'>
                    最新の証明はありません
                  </Text>
                )}
              </CredList>
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
  height: 100svh;
  overflow: scroll;
`
const ProfileTop = styled(motion.div)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  aspect-ratio: 1;
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
  height: 100svh;
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
  justify-content: start;
  align-items: start;
  gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding-left: var(--kai-size-sys-space-md);
  padding-right: var(--kai-size-sys-space-md);
`

const CredList = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  row-gap: var(--kai-size-sys-space-md);
  column-gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding: 0 var(--kai-size-sys-space-md);
  overflow-y: scroll;
`
