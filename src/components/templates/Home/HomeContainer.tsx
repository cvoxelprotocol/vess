import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import { PiPencilBold } from 'react-icons/pi'
import { FlexHorizontal } from '@/components/atom/Common/FlexHorizontal'
import { FlexVertical } from '@/components/atom/Common/FlexVertical'
import { HCLayout } from '@/components/atom/HCLayout'
import { DefaultHeader } from '@/components/atom/Header'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { Tab, TabList, TabPanel, Tabs } from '@/components/atom/tab'
import { ProfileEditModal } from '@/components/home/ProfileEditModal'
import { EventItem } from '@/components/profile/EventItem'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useKai } from '@/kai/hooks/useKai'
import { IconButton } from '@/kai/icon-button'
import { useModal } from '@/kai/modal'
import { Skelton } from '@/kai/skelton'
import { Text } from '@/kai/text/Text'

export const HomeContainer: FC = () => {
  const { did } = useDIDAccount()
  const { profile, isloadingProfile } = useSocialAccount(did)
  const router = useRouter()
  const { kai } = useKai()
  const { displayHeldEventAttendances, isFetchingHeldEventAttendances } = useHeldEventAttendances()
  const { openModal, closeModal, toggleModal } = useModal()

  useEffect(() => {
    if (!did) {
      router.push('/login')
    }
  }, [did])

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
              }}
            >
              <NextImageContainer
                src={profile.avatarSrc || '/default_profile.jpg'}
                width={kai.size.ref[144]}
                height={kai.size.ref[144]}
                objectFit='cover'
                alt='Profile Icon'
                borderRadius={kai.size.sys.round.xl}
              />
            </div>
          </Skelton>
          <FlexVertical gap={kai.size.ref[12]} alignItems='center' width='100%'>
            <FlexHorizontal
              gap={kai.size.ref[6]}
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
                <IconButton
                  size='sm'
                  variant='text'
                  color='secondary'
                  icon={<PiPencilBold />}
                  onPress={() => openModal('profileEdit')}
                />
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
          <Tabs>
            <TabList>
              <Tab id='membership'>会員証</Tab>
              <Tab id='attendance'>イベント参加証</Tab>
            </TabList>
            <TabPanel id='membership'>
              <div>会員証はありません。</div>
            </TabPanel>
            <TabPanel id='attendance'>
              <EventListFrame>
                <EventItem id={'aaa'} />
                <EventItem id={'aaa'} />
                <EventItem id={'aaa'} />
              </EventListFrame>
              {/* {displayHeldEventAttendances.length == 0 ? (
              displayHeldEventAttendances.map((event) => (
                <EventItem key={event.id} id={event.credentialSubject.id} />
              ))
            ) : (
              <div>イベント参加証はありません。</div>
            )} */}
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
  align-items: center;
  gap: var(--kai-size-ref-24);
  padding: var(--kai-size-ref-32) var(--kai-size-ref-16);
`
const EventListFrame = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--kai-size-ref-112), 1fr));
  grid-column-gap: var(--kai-size-ref-16);
  grid-row-gap: var(--kai-size-ref-16);
  justify-content: center;
`
