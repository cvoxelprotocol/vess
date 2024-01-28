import styled from '@emotion/styled'
import { did } from '@ucanto/core/schema'
import { TextInput, useModal, IconButton, useKai } from 'kai-kit'
import { FC, useMemo } from 'react'
import { PiPencilBold } from 'react-icons/pi'
import { ImageContainer } from '../ui-v1/Images/ImageContainer'
import { CredItem } from './CredItem'
import { HCLayout } from '@/components/app/HCLayout'
import { DefaultHeader } from '@/components/app/Header'
import { EventItem } from '@/components/home/EventItem'
import { ProfileEditModal } from '@/components/home/ProfileEditModal'
import { Tab, TabList, TabPanel, Tabs } from '@/components/home/tab'
import { FlexHorizontal } from '@/components/ui-v1/Common/FlexHorizontal'
import { FlexVertical } from '@/components/ui-v1/Common/FlexVertical'
import { NextImageContainer } from '@/components/ui-v1/Images/NextImageContainer'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'
import { useVESSUser } from '@/hooks/userVESSUser'
import { Skelton } from '@/kai/skelton'
import { Text } from '@/kai/text/Text'

type Props = {
  did: string
}
export const HomeContainer: FC<Props> = ({ did }) => {
  const { did: myDid } = useDIDAccount()
  const { profile, isloadingProfile } = useSocialAccount(did)
  const { kai } = useKai()
  const { CredentialsByHolder, isInitialLoading, certificates, attendances, memberships } =
    useVerifiableCredentials(did)
  const { openModal, closeModal, toggleModal } = useModal()
  const { VsUser } = useVESSUser(did)

  const isEditable = useMemo(() => {
    return myDid === did
  }, [did, myDid])

  console.log({ isEditable })

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <MainFrame>
          <Skelton
            width={kai.size.ref[144]}
            height={kai.size.ref[144]}
            radius={kai.size.sys.round.xl}
            isLoading={isloadingProfile}
          >
            <div
              style={{
                border: 'var(--kai-size-ref-4) solid var(--kai-color-sys-white)',
                borderRadius: 'var(--kai-size-sys-round-xl)',
                overflow: 'hidden',
              }}
            >
              <>
                {profile.avatarSrc ? (
                  <ImageContainer
                    src={profile.avatarSrc}
                    width={kai.size.ref[144]}
                    height={kai.size.ref[144]}
                    objectFit='cover'
                    alt='Profile Icon'
                  />
                ) : (
                  <NextImageContainer
                    src={'/default_profile.jpg'}
                    width={kai.size.ref[144]}
                    height={kai.size.ref[144]}
                    objectFit='cover'
                    alt='Profile Icon'
                  />
                )}
              </>
            </div>
          </Skelton>
          <FlexVertical gap={kai.size.sys.space.md} alignItems='center' width='100%'>
            <FlexHorizontal
              gap={kai.size.sys.space.sm}
              alignItems='center'
              justifyContent='center'
              width='100%'
            >
              <Skelton
                width='var(--kai-size-ref-160)'
                height='var(--kai-typo-sys-headline-sm-line-height)'
                isLoading={isloadingProfile}
              >
                <Text as='h2' typo='headline-sm' color={kai.color.sys.onBackground}>
                  {profile.displayName || 'no name'}
                </Text>
                {isEditable && (
                  <IconButton
                    size='xs'
                    variant='outlined'
                    round={'sm'}
                    color='dominant'
                    icon={<PiPencilBold />}
                    onPress={() => openModal('profileEdit')}
                  />
                )}
              </Skelton>
            </FlexHorizontal>
            <Skelton
              width='var(--kai-size-ref-192)'
              height='var(--kai-typo-sys-body-lg-line-height)'
              isLoading={isloadingProfile}
            >
              <Text
                as='p'
                typo='body-lg'
                color={kai.color.sys.onBackground}
                height='fit-content'
                align='center'
              >
                {profile.bio || '自己紹介文はありません。'}
              </Text>
            </Skelton>
          </FlexVertical>
          <Tabs defaultSelectedKey={'attendance'}>
            <TabList>
              {/* <Tab id='membership'>会員証</Tab> */}
              <Tab id='attendance'>デジタル証明</Tab>
            </TabList>
            {/* <TabPanel id='membership'>
              <div>会員証はありません。</div>
            </TabPanel> */}
            <TabPanel id='attendance' style={{ position: 'relative', zIndex: '0' }}>
              {attendances.length > 0 || memberships.length > 0 || certificates.length > 0 ? (
                <EventListFrame>
                  {attendances.map((event) => (
                    <CredItem
                      key={event.id}
                      image={event.credentialSubject.eventIcon}
                      name={event.credentialSubject.eventName}
                    />
                  ))}
                  {memberships && memberships.length > 0 && (
                    <>
                      {memberships.map((membership) => (
                        <CredItem
                          key={membership.id}
                          image={membership.credentialSubject.membershipIcon}
                          name={membership.credentialSubject.membershipName}
                        />
                      ))}
                    </>
                  )}
                  {certificates && certificates.length > 0 && (
                    <>
                      {certificates.map((certificate) => (
                        <CredItem
                          key={certificate.id}
                          image={certificate.credentialSubject.image}
                          name={certificate.credentialSubject.certificationName}
                        />
                      ))}
                    </>
                  )}
                </EventListFrame>
              ) : (
                <FlexVertical width='100%' alignItems='center'>
                  <div>証明書はありません。</div>
                </FlexVertical>
              )}
            </TabPanel>
          </Tabs>
        </MainFrame>
      </HCLayout>
      <ProfileEditModal name={'profileEdit'} did={did || ''} />
    </>
  )
}

const MainFrame = styled.main`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  z-index: var(--kai-z-index-sys-default);
  align-items: center;
  gap: var(--kai-size-ref-24);
  padding: var(--kai-size-ref-32) var(--kai-size-ref-16);
  overflow: visible;
`
const EventListFrame = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--kai-size-ref-112), 1fr));
  grid-column-gap: var(--kai-size-ref-16);
  grid-row-gap: var(--kai-size-ref-16);
  justify-content: center;
`

const FocusDiv = styled.button`
  width: 400px;
  height: 80px;
  border-radius: 16px;
  border: none;

  background: var(--kai-color-sys-layer-nearest);
  &:focus {
    border: 2px solid var(--kai-color-sys-dominant);
  }
`
