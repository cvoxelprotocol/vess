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
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { FC, useMemo, useRef } from 'react'
import { FiMenu } from 'react-icons/fi'
import { PiPaintBrushBroadDuotone, PiExport, PiPencil, PiCameraPlus } from 'react-icons/pi'
import { Banner } from '../app/Banner'
import { useNCLayoutContext } from '../app/NCLayout'
import { AvatarEditModal } from '../avatar/AvatarEditModal'
import { CredItem } from '../home/CredItem'
import { ProfileEditModal } from '../home/ProfileEditModal'
import { StickerImageItemList } from '../sticker/StickerImageItemList'
import { IdPlate } from './IdPlate'
import { SocialLink } from '@/@types/user'
import { OIDCredItem } from '@/components/home/OIDCredItem'
import { PIZZA_PARTY_CRED_ID } from '@/constants/campaign'
import { X_URL, isProd } from '@/constants/common'
import { useAvatar } from '@/hooks/useAvatar'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useENS } from '@/hooks/useENS'
import { useOIDCredentials } from '@/hooks/useOIDCredentials'
import { useShareLink } from '@/hooks/useShareLink'
import { removeStickerIdSurfix } from '@/hooks/useStickers'
import { useUserCredItem } from '@/hooks/useUserCredItem'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVESSUserProfile } from '@/hooks/useVESSUserProfile'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { getAddressFromPkh } from '@/utils/did'
import { shortenStr } from '@/utils/objectUtil'

const EARLY_ACCESS_CRED_ID = [
  '0899105e-f914-432c-afa2-57acaec6ab6d',
  '60772e5b-03b7-472e-9e4d-239619e17301',
]

const AvatarForDisplay = dynamic(() => import('@/components/avatar/AvatarForDisplay'), {
  ssr: false,
})

type ProfileContainerProps = {
  did: string
}

export const ProfileContainer: FC<ProfileContainerProps> = ({ did }) => {
  const { user, userJwk } = useVESSAuthUser()
  const { oidCredentials } = useOIDCredentials(userJwk?.didValue)
  const { userCredentialItems } = useUserCredItem(user?.id)
  const { vsUser, isInitialLoading: isLoadingUser } = useVESSUserProfile(did)
  const { profileAvatar } = useAvatar(did)
  const { openModal } = useModal()
  const { ccProfile } = useCcProfile(did)
  const { ensProfile } = useENS(getAddressFromPkh(did) as `0x${string}`)
  const { formatedCredentials } = useVerifiableCredentials(did)
  const { openNavigation } = useNCLayoutContext()
  const { matches } = useBreakpoint()
  const { shareLink } = useShareLink(undefined)
  const router = useRouter()
  const stageRef = useRef<any>()

  // for Scroll Animation
  const scrollRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll({
    container: scrollRef,
  })
  const sProgressY = useTransform(() => Math.max(0, Math.min(1, 1 - scrollY.get() / 300)))
  const borderRadius = useTransform(sProgressY, [0, 1], [24, 0])
  const opacity = useTransform(sProgressY, [0, 1], [0.4, 1])
  const scale = useTransform(sProgressY, [0, 1], [0.95, 1])

  const avatarImageUrl = useMemo(() => {
    return vsUser?.avatar || profileAvatar?.avatarUrl || '/default_profile.jpg'
  }, [profileAvatar, vsUser?.avatar])

  const hasCredential = useMemo(() => {
    return formatedCredentials.some((c) => c.credId === PIZZA_PARTY_CRED_ID)
  }, [formatedCredentials])

  const isEditable = useMemo(() => {
    return user?.did === did
  }, [did, user?.did])

  const xLink = useMemo(() => {
    return vsUser?.socialLink?.some((link) => link.title === 'X' && !!link.url && link.url !== '')
      ? (vsUser?.socialLink?.find((link) => link.title === 'X') as SocialLink)
      : undefined
  }, [vsUser?.socialLink])

  const shouldShowMySticker = useMemo(() => {
    const hasEarlyAccessCred = formatedCredentials.some((item) =>
      EARLY_ACCESS_CRED_ID.includes(item.credId),
    )
    console.log({ hasEarlyAccessCred })
    if (!isProd()) return true
    return isProd() && hasEarlyAccessCred
  }, [formatedCredentials])

  const jumpToVcDetail = (id: string) => {
    router.push(`/creds/detail/${removeStickerIdSurfix(id)}`)
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
            <AvatarForDisplay
              profileAvatar={profileAvatar}
              avatarImageUrl={avatarImageUrl}
              stageRef={stageRef}
              onSelectSticker={jumpToVcDetail}
            />
            {/* <ProfileImage
              src={avatarImageUrl}
              alt='プロフィール画像'
              key={profileAvatar?.avatarUrl || vsUser?.avatar}
            /> */}
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
                  flexWrap='nowrap'
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
              <ScrollableFlexHorizontal>
                <IdPlate
                  iconURL={'/brand/vess.png'}
                  id={vsUser?.vessId ? `@${vsUser?.vessId}` : getAddressFromPkh(did)}
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
              </ScrollableFlexHorizontal>
            </FlexVertical>
            <FlexVertical
              gap='var(--kai-size-sys-space-lg)'
              width='100%'
              flexWrap='nowrap'
              style={{ overflowY: 'scroll' }}
            >
              {shouldShowMySticker && (
                <FlexVertical
                  gap='var(--kai-size-sys-space-sm)'
                  width='100%'
                  style={{ overflowY: 'visible' }}
                >
                  <Text
                    typo='title-md'
                    color='var(--kai-color-sys-on-layer)'
                    style={{
                      padding: '0 var(--kai-size-sys-space-md)',
                      flexShrink: 0,
                    }}
                  >
                    Myステッカー
                  </Text>
                  <StickerImageItemList items={userCredentialItems} isMe={isEditable} />
                </FlexVertical>
              )}

              {hasCredential && (
                <FlexVertical
                  gap='var(--kai-size-sys-space-sm)'
                  width='100%'
                  style={{ overflowY: 'visible' }}
                >
                  <Text
                    typo='title-md'
                    color='var(--kai-color-sys-on-layer)'
                    style={{
                      padding: '0 var(--kai-size-sys-space-md)',
                      flexShrink: 0,
                    }}
                  >
                    イベント
                  </Text>
                  <BannerList>
                    <Banner
                      imgUrl='/banner/pizzaDAO2024.jpg'
                      onPress={() => router.push(`/creds/items/feed/${PIZZA_PARTY_CRED_ID}`)}
                    />
                  </BannerList>
                </FlexVertical>
              )}
              <FlexVertical
                gap='var(--kai-size-sys-space-sm)'
                width='100%'
                padding='0 0 var(--kai-size-sys-space-lg) 0'
                flexWrap='nowrap'
                style={{ flexGrow: 1, overflowY: 'visible' }}
              >
                <Text
                  typo='title-md'
                  color='var(--kai-color-sys-on-layer)'
                  style={{
                    padding: '0 var(--kai-size-sys-space-md)',
                    flexShrink: 0,
                  }}
                >
                  最新の証明
                </Text>
                <CredList>
                  {(!formatedCredentials || formatedCredentials.length === 0) &&
                    (!oidCredentials?.credentials || oidCredentials?.credentials.length === 0) && (
                      <Text typo='label-lg' color='var(--kai-color-sys-neutral)'>
                        最新の証明はありません
                      </Text>
                    )}
                  {oidCredentials?.credentials && oidCredentials?.credentials.length > 0 && (
                    <>
                      {oidCredentials?.credentials.map((cred, index) => (
                        <>
                          <OIDCredItem
                            key={`${cred.credential.credential.decodedPayload?.credentialSubject?.id}-${index}`}
                            brandings={cred.brandings}
                            credId={cred.id}
                            width={'100%'}
                          />
                        </>
                      ))}
                    </>
                  )}
                  {formatedCredentials && formatedCredentials.length > 0 && (
                    <>
                      {formatedCredentials.map((credential, index) => (
                        <>
                          <CredItem
                            key={`${credential.id}-${index}`}
                            image={credential.image}
                            name={credential.title}
                            credId={credential.id}
                            width={'100%'}
                          />
                        </>
                      ))}
                    </>
                  )}
                </CredList>
              </FlexVertical>
            </FlexVertical>
          </ProfileInfoFrame>
        </ProfileInfoOuterFrame>
        {isEditable && (
          <IconButton
            icon={<PiCameraPlus size={32} />}
            color='dominant'
            variant='filled'
            onPress={() => router.push('/post/add')}
            size='md'
            style={{
              position: 'fixed',
              bottom: 'var(--kai-size-sys-space-md)',
              right: 'var(--kai-size-sys-space-md)',
              zIndex: 'var(--kai-z-index-sys-fixed-default)',
              borderRadius: '8px',
              background: 'var(--kai-color-sys-subdominant)',
              border: '1px solid var(--kai-color-sys-subdominant-outline-minor)',
              boxShadow:
                '18px 30px 10px 0px rgba(153, 62, 121, 0.01), 12px 19px 9px 0px rgba(153, 62, 121, 0.05), 6px 11px 8px 0px rgba(153, 62, 121, 0.15), 3px 5px 6px 0px rgba(153, 62, 121, 0.26), 1px 1px 3px 0px rgba(153, 62, 121, 0.30)',
            }}
          />
        )}
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
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
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
  overflow: hidden;
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
`

const BannerList = styled.div`
  display: flex;
  gap: var(--kai-size-sys-space-sm);
  flex-wrap: nowrap;
  width: 100%;
  padding: 0 var(--kai-size-sys-space-md);
  overflow-x: scroll;
  overflow-y: visible;
`

const ScrollableFlexHorizontal = styled.div`
  display: flex;
  flex-wrap: nowrap;
  width: 100%;
  overflow: scroll;
  gap: var(--kai-size-sys-space-xs);
  padding-left: var(--kai-size-sys-space-md);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`
