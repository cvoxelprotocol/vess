import { profile } from 'console'
import styled from '@emotion/styled'
import { is } from 'date-fns/locale'
import {
  FlexHorizontal,
  FlexVertical,
  Skelton,
  useKai,
  Text,
  Flex,
  Chip,
  useBreakpoint,
  useModal,
} from 'kai-kit'
import { FC, useMemo } from 'react'
import { PiPencil, PiShareFat } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { ProfileEditModal } from './ProfileEditModal'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useENS } from '@/hooks/useENS'
import { useLensProfile } from '@/hooks/useLensProfile'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useOriginalAddress } from '@/jotai/account'

type ProfileRackProps = {
  did: string
  isEditable?: boolean
}

export const ProfileRack: FC<ProfileRackProps> = ({ did, isEditable }) => {
  const originalAddress = useOriginalAddress()
  const { profile, isloadingProfile } = useSocialAccount(did)
  const { ccProfile, ccLoading } = useCcProfile(did)
  const { ensProfile, isInitialLoading: ensLoading } = useENS(originalAddress as `0x${string}`)
  const { lensProfile, lensLoading } = useLensProfile(did)
  const { kai } = useKai()
  const { matches } = useBreakpoint()
  const { openModal } = useModal()

  const mainId = useMemo(() => {
    if (ensProfile) {
      return {
        id: 'ens',
        render: (
          <>
            <FlexHorizontal gap='var(--kai-size-sys-space-2xs)' alignItems='center'>
              <NextImageContainer
                src={'/brand/ens.png'}
                width={kai.size.ref[20]}
                height={kai.size.ref[20]}
              />
              <Text
                typo='label-lg'
                color='var(--kai-color-sys-neutral)'
                width='var(--kai-size-ref-112)'
                lineClamp={1}
              >
                {ensProfile.displayName}
              </Text>
            </FlexHorizontal>
          </>
        ),
      }
    } else if (ccProfile) {
      return {
        id: 'cc',
        render: (
          <>
            <FlexHorizontal gap='var(--kai-size-sys-space-2xs)' alignItems='center'>
              <NextImageContainer
                src={'/brand/cyberconnect.png'}
                width={kai.size.ref[20]}
                height={kai.size.ref[20]}
              />
              <Text
                typo='label-lg'
                color='var(--kai-color-sys-neutral)'
                width='var(--kai-size-ref-112)'
                lineClamp={1}
              >
                {ccProfile.displayName}
              </Text>
            </FlexHorizontal>
          </>
        ),
      }
    } else if (lensProfile) {
      return {
        id: 'lens',
        render: (
          <>
            <FlexHorizontal gap='var(--kai-size-sys-space-2xs)' alignItems='center'>
              <NextImageContainer
                src={'/brand/lens.png'}
                width={kai.size.ref[20]}
                height={kai.size.ref[20]}
              />
              <Text
                typo='label-lg'
                color='var(--kai-color-sys-neutral)'
                width='var(--kai-size-ref-112)'
                lineClamp={1}
              >
                {lensProfile.displayName}
              </Text>
            </FlexHorizontal>
          </>
        ),
      }
    } else {
      return {
        id: 'vess',
        render: (
          <>
            <FlexHorizontal gap='var(--kai-size-sys-space-2xs)' alignItems='center'>
              <NextImageContainer
                src={'/brand/vess.png'}
                width={kai.size.ref[20]}
                height={kai.size.ref[20]}
              />

              <Text
                typo='label-lg'
                color='var(--kai-color-sys-neutral)'
                width='var(--kai-size-ref-112)'
                lineClamp={1}
              >
                {originalAddress}
              </Text>
            </FlexHorizontal>
          </>
        ),
      }
    }
  }, [ccProfile, ensProfile, lensProfile, did])

  return (
    <>
      <ProfileRackFrame>
        <FlexHorizontal
          width='100%'
          alignItems='start'
          gap='var(--kai-size-sys-space-sm)'
          style={{ flex: '0 0 auto' }}
        >
          <Skelton
            width={kai.size.ref[80]}
            height={kai.size.ref[80]}
            radius={kai.size.sys.round.lg}
            isLoading={isloadingProfile || !profile.avatarSrc}
          >
            <div
              style={{
                border: 'var(--kai-size-ref-2) solid var(--kai-color-sys-white)',
                borderRadius: 'var(--kai-size-sys-round-lg)',
                overflow: 'hidden',
              }}
            >
              <>
                {profile.avatarSrc ? (
                  <ImageContainer
                    src={profile.avatarSrc}
                    width={kai.size.ref[80]}
                    height={kai.size.ref[80]}
                    objectFit='cover'
                    alt='Profile Icon'
                    borderRadius='calc(var(--kai-size-sys-round-lg) - var(--kai-size-ref-2))'
                  />
                ) : (
                  <NextImageContainer
                    src={'/default_profile.jpg'}
                    width={kai.size.ref[80]}
                    height={kai.size.ref[80]}
                    objectFit='cover'
                    alt='Profile Icon'
                    borderRadius='calc(var(--kai-size-sys-round-lg) - var(--kai-size-ref-2))'
                  />
                )}
              </>
            </div>
          </Skelton>
          <FlexVertical
            padding='var(--kai-size-sys-space-sm) 0'
            gap='var(--kai-size-sys-space-2xs)'
            justifyContent='start'
            alignItems='start'
            style={{ flex: 1 }}
          >
            <Text
              as='h2'
              typo='title-lg'
              color='var(--kai-color-sys-on-layer)'
              isLoading={isloadingProfile}
            >
              {profile.displayName || 'no name'}
            </Text>
            <Skelton
              isLoading={ccLoading || ensLoading || lensLoading || isloadingProfile}
              width='var(--kai-size-ref-160)'
              height='var(--kai-typo-sys-label-lg-line-height)'
            >
              <FlexHorizontal gap='var(--kai-size-sys-space-sm)' alignItems='center'>
                <Text as='p' typo='label-lg' color='var(--kai-color-sys-neutral)'>
                  {mainId.render}
                </Text>
                <FlexHorizontal
                  gap='var(--kai-size-sys-space-none)'
                  alignItems='center'
                  style={{
                    padding: '0 4px',
                    borderLeft: '1px solid var(--kai-color-sys-neutral-outline)',
                  }}
                >
                  {mainId.id !== 'ens' && ensProfile && (
                    <NextImageContainer src='/brand/ens.png' width='20px' height='20px' />
                  )}
                  {mainId.id !== 'cc' && ccProfile && (
                    <NextImageContainer src='/brand/cyberconnect.png' width='20px' height='20px' />
                  )}
                  {mainId.id !== 'lens' && lensProfile && (
                    <NextImageContainer src='/brand/lens.png' width='20px' height='20px' />
                  )}
                  {/* {mainId.id !== 'eth' && originalAddress && (
                    <NextImageContainer src='/brand/ethereum.png' width='20px' height='20px' />
                  )} */}
                  {mainId.id !== 'vess' && did && (
                    <NextImageContainer src='/brand/vess.png' width='20px' height='20px' />
                  )}
                </FlexHorizontal>
              </FlexHorizontal>
            </Skelton>
          </FlexVertical>
        </FlexHorizontal>
        <FlexVertical gap='var(--kai-size-sys-space-sm)' alignItems='start' width='100%'>
          <Text
            as='p'
            typo='body-lg'
            color='var(--kai-color-sys-on-layer)'
            style={{ padding: '0 var(--kai-size-sys-space-sm)' }}
            isLoading={isloadingProfile}
          >
            {profile.bio || ''}
          </Text>
          {isEditable && (
            <FlexHorizontal
              gap='var(--kai-size-sys-space-sm)'
              width={matches.md ? 'auto' : '100%'}
              style={{ maxWidth: 'var(--kai-size-ref-448)' }}
            >
              <Chip
                variant='tonal'
                color='neutral'
                startContent={<PiPencil />}
                onPress={() => openModal('profileEdit')}
                style={{ flex: 1 }}
                isDisabled={isloadingProfile}
              >
                編集する
              </Chip>
              <Chip
                variant='tonal'
                color='neutral'
                startContent={<PiShareFat />}
                style={{ flex: 1 }}
                isDisabled={isloadingProfile}
              >
                共有する
              </Chip>
            </FlexHorizontal>
          )}
        </FlexVertical>
      </ProfileRackFrame>
      <ProfileEditModal name={'profileEdit'} did={did || ''} />
    </>
  )
}

const ProfileRackFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: var(--kai-size-sys-space-sm);
  width: 100%;
  padding: var(--kai-size-sys-space-none) var(--kai-size-sys-space-none);
`
