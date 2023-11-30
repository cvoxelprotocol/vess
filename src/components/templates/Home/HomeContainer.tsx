import styled from '@emotion/styled'
import { disconnect } from '@wagmi/core'
import { useRouter } from 'next/router'
import { FC, useEffect } from 'react'
import {
  Tabs as RACTabs,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
} from 'react-aria-components'
import { useDisconnect } from 'wagmi'
import { PanelButton } from '@/components/atom/Buttons/PanelButton'
import { FlexVertical } from '@/components/atom/Common/FlexVertical'
import { HCLayout } from '@/components/atom/HCLayout'
import { DefaultHeader } from '@/components/atom/Header'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { Tab, TabList, TabPanel, Tabs } from '@/components/atom/tab'
import { UserCard } from '@/components/molecure/User/UserCard'
import { BasicCarousel } from '@/components/organism/Carousel/BasicCarousel'
import { EventItem } from '@/components/profile/EventItem'
import { useConnectDID } from '@/hooks/useConnectDID'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useHeldEventAttendances } from '@/hooks/useHeldEventAttendances'
import { useSocialAccount } from '@/hooks/useSocialAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { Button } from '@/kai/button/Button'
import { useKai } from '@/kai/hooks/useKai'
import { Skelton } from '@/kai/skelton'
import { Text } from '@/kai/text/Text'

const FEATURED_USER_LIST = [
  'did:pkh:eip155:1:0xde695cbb6ec0cf3f4c9564070baeb032552c5111',
  'did:pkh:eip155:1:0xb69cb3efbadb1b30f6d88020e1fa1fc84b8804d4',
  'did:pkh:eip155:1:0xe43577d0fa22a0c156414677bee9baf99a33cfa9',
  'did:pkh:eip155:1:0xad44f4c7703ab3fac0c46624fb52e6e668e4cd24',
  'did:pkh:eip155:1:0x9df610ec3e37e8da858b3d53d6c68178140cf24f',
]
export const HomeContainer: FC = () => {
  const { did } = useDIDAccount()
  const { profile, isloadingProfile } = useSocialAccount(did)
  const router = useRouter()
  const { setShowConnectModal } = useVESSWidgetModal()
  const { kai } = useKai()
  const { disConnectDID } = useConnectDID()
  const { displayHeldEventAttendances, isFetchingHeldEventAttendances } = useHeldEventAttendances()

  const jumpToURL = (url: string) => {
    window.open(url, '_blank')
  }
  const jumpToProfile = () => {
    if (!did) {
      setShowConnectModal(true)
      return
    }
    router.push(`/did/${did}`)
  }

  const logout = async () => {
    await disConnectDID()
  }

  // useEffect(() => {
  //   if (!did) {
  //     router.push('/login')
  //   }
  // }, [did])

  return (
    <HCLayout header={<DefaultHeader />}>
      <MainFrame>
        <Skelton
          width={kai.size.ref[144]}
          height={kai.size.ref[144]}
          radius={kai.size.sys.round.xl}
          isLoading={isloadingProfile || !profile.avatarSrc}
        >
          <NextImageContainer
            src={profile.avatarSrc || '/base_item_header.png'}
            width={kai.size.ref[144]}
            height={kai.size.ref[144]}
            objectFit='cover'
            borderRadius={kai.size.sys.round.xl}
          />
        </Skelton>
        <FlexVertical gap={kai.size.ref[12]} alignItems='center'>
          <Text
            as='h2'
            typo='headline-sm'
            color={kai.color.sys.onBackground}
            isLoading={isloadingProfile}
          >
            {profile.displayName || '名前なし'}
          </Text>
          <Text
            as='p'
            typo='body-lg'
            color={kai.color.sys.onBackground}
            isLoading={isloadingProfile}
            height='fit-content'
            align='center'
          >
            {profile.bio || '自己紹介文はありません。'}
          </Text>
        </FlexVertical>
        <Tabs>
          <TabList>
            <Tab id='membership'>会員証</Tab>
            <Tab id='attendance'>イベント参加証</Tab>
          </TabList>
          <TabPanel id='membership'>
            <div>会員証はありませaん。</div>
          </TabPanel>
          <TabPanel id='attendance'>
            <EventListFrame>
              <EventItem id={'aaa'} />
              <EventItem id={'aaa'} />
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
        <Button onPress={() => logout()}>接続解除</Button>
      </MainFrame>
    </HCLayout>
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
