import styled from '@emotion/styled'
import { FlexHorizontal, FlexVertical, Text } from 'kai-kit'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
import type { Key } from 'react-aria-components'
import { HCLayout } from '../app/HCLayout'
import { DefaultHeader } from '../app/Header'
import { CredItem } from '../home/CredItem'
import { NextImageContainer } from '../ui-v1/Images/NextImageContainer'
import { Tab, TabList, TabPanel, Tabs } from '@/components/home/tab'
import { useCcProfile } from '@/hooks/useCcProfile'
import { useENS } from '@/hooks/useENS'
import { useLensProfile } from '@/hooks/useLensProfile'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'

export const IdentityContainer: FC = () => {
  const { did } = useVESSAuthUser()
  const { originalAddress } = useVESSAuthUser()
  const { ccProfile, ccLoading } = useCcProfile(did)
  const { ensProfile, isInitialLoading: ensLoading } = useENS(originalAddress as `0x${string}`)
  const { lensProfile, lensLoading } = useLensProfile(did)
  const { CredentialsByHolder, isInitialLoading, certificates, attendances, memberships } =
    useVerifiableCredentials(did)
  const router = useRouter()
  const [tabKey, setTabKey] = useState<Key>('attendance')

  useEffect(() => {
    if (!did) {
      router.push(`/login`)
    }
    if (router.query.tab) {
      setTabKey(router.query.tab as Key)
    }
  }, [did, router])

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <MainFrame>
          <Tabs
            defaultSelectedKey={'attendance'}
            selectedKey={tabKey}
            onSelectionChange={(k) => setTabKey(k)}
          >
            <TabList style={{ flex: 0 }}>
              <Tab id='attendance'>デジタル証明</Tab>
              <Tab id='id'>ID</Tab>
            </TabList>
            <TabPanel id='attendance' style={{}}>
              {attendances.length > 0 || memberships.length > 0 || certificates.length > 0 ? (
                <EventListFrame>
                  {attendances.map((event) => (
                    <CredItem
                      key={event.id}
                      image={event.credentialSubject.eventIcon}
                      name={event.credentialSubject.eventName}
                      credId={event.id}
                    />
                  ))}
                  {memberships && memberships.length > 0 && (
                    <>
                      {memberships.map((membership) => (
                        <CredItem
                          key={membership.id}
                          image={membership.credentialSubject.membershipIcon}
                          name={membership.credentialSubject.membershipName}
                          credId={membership.id}
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
                          credId={certificate.id}
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
            <TabPanel id='id'>
              <FlexVertical width='100%' gap='var(--kai-size-sys-space-sm)' alignItems='center'>
                <IdFrame>
                  <FlexHorizontal
                    gap='var(--kai-size-sys-space-xs)'
                    alignItems='center'
                    flexWrap='nowrap'
                    style={{ flex: 1 }}
                  >
                    <NextImageContainer
                      src='/brand/vess.png'
                      width='var(--kai-size-ref-32)'
                      height='var(--kai-size-ref-32)'
                    />
                    <Text
                      as='p'
                      typo='label-lg'
                      color='var(--kai-color-sys-on-layer)'
                      lineClamp={1}
                    >
                      {originalAddress}
                    </Text>
                  </FlexHorizontal>
                  <NextImageContainer
                    src='/icon/verified_rich.png'
                    width='var(--kai-size-ref-24)'
                  />
                </IdFrame>
                {ensProfile && (
                  <IdFrame>
                    <FlexHorizontal
                      gap='var(--kai-size-sys-space-xs)'
                      alignItems='center'
                      flexWrap='nowrap'
                      style={{ flex: 1 }}
                    >
                      <NextImageContainer
                        src='/brand/ens.png'
                        width='var(--kai-size-ref-32)'
                        height='var(--kai-size-ref-32)'
                      />
                      <Text
                        as='p'
                        typo='label-lg'
                        color='var(--kai-color-sys-on-layer)'
                        lineClamp={1}
                      >
                        {ensProfile?.displayName}
                      </Text>
                    </FlexHorizontal>
                    <NextImageContainer
                      src='/icon/verified_rich.png'
                      width='var(--kai-size-ref-24)'
                    />
                  </IdFrame>
                )}
                {ccProfile && (
                  <IdFrame>
                    <FlexHorizontal
                      gap='var(--kai-size-sys-space-xs)'
                      alignItems='center'
                      flexWrap='nowrap'
                      style={{ flex: 1 }}
                    >
                      <NextImageContainer
                        src='/brand/cyberconnect.png'
                        width='var(--kai-size-ref-32)'
                        height='var(--kai-size-ref-32)'
                      />
                      <Text
                        as='p'
                        typo='label-lg'
                        color='var(--kai-color-sys-on-layer)'
                        lineClamp={1}
                      >
                        {ccProfile?.displayName}
                      </Text>
                    </FlexHorizontal>
                    <NextImageContainer
                      src='/icon/verified_rich.png'
                      width='var(--kai-size-ref-24)'
                    />
                  </IdFrame>
                )}
                {lensProfile && (
                  <IdFrame>
                    <FlexHorizontal
                      gap='var(--kai-size-sys-space-xs)'
                      alignItems='center'
                      flexWrap='nowrap'
                      style={{ flex: 1 }}
                    >
                      <NextImageContainer
                        src='/brand/lens.png'
                        width='var(--kai-size-ref-32)'
                        height='var(--kai-size-ref-32)'
                      />
                      <Text
                        as='p'
                        typo='label-lg'
                        color='var(--kai-color-sys-on-layer)'
                        lineClamp={1}
                      >
                        {lensProfile?.displayName}
                      </Text>
                    </FlexHorizontal>
                    <NextImageContainer
                      src='/icon/verified_rich.png'
                      width='var(--kai-size-ref-24)'
                    />
                  </IdFrame>
                )}
              </FlexVertical>
            </TabPanel>
          </Tabs>
        </MainFrame>
      </HCLayout>
    </>
  )
}

const MainFrame = styled.main`
  width: 100%;
  height: calc(100dvh - var(--kai-size-ref-80));
  display: flex;
  flex-direction: column;
  z-index: var(--kai-z-index-sys-default);
  align-items: center;
  gap: var(--kai-size-ref-24);
  padding: var(--kai-size-sys-space-md) var(--kai-size-sys-space-md);
  overflow: visible;
`

const EventListFrame = styled.div`
  width: 100%;
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--kai-size-ref-240), 1fr));
  grid-column-gap: var(--kai-size-ref-12);
  grid-row-gap: var(--kai-size-ref-12);
  justify-content: center;
`

const IdFrame = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--kai-size-sys-space-xs);
  width: 100%;
  height: var(--kai-size-ref-56);
  padding: var(--kai-size-sys-space-md);
  border-radius: var(--kai-size-ref-16);
  background: var(--kai-color-sys-layer-default);
`
