import styled from '@emotion/styled'
import React, { FC, useMemo } from 'react'
import { CredItem } from './CredItem'
import { ProfileRack } from './ProfileRack'
import { HCLayout } from '@/components/app/HCLayout'
import { DefaultHeader } from '@/components/app/Header'
import { Tab, TabList, TabPanel, Tabs } from '@/components/home/tab'
import { FlexVertical } from '@/components/ui-v1/Common/FlexVertical'
import { useVESSAuthUser } from '@/hooks/useVESSAuthUser'
import { useVerifiableCredentials } from '@/hooks/useVerifiableCredentials'

type Props = {
  did: string
}

export const HomeContainer: FC<Props> = ({ did }) => {
  const { user } = useVESSAuthUser()
  const { isInitialLoading, formatedCredentials } = useVerifiableCredentials(did)

  const isEditable = useMemo(() => {
    return user?.did === did
  }, [did, user?.did])

  return (
    <>
      <HCLayout header={<DefaultHeader />}>
        <MainFrame>
          <ProfileRack did={did} isEditable={isEditable} />
          <Tabs defaultSelectedKey={'attendance'}>
            <TabList>
              <Tab id='attendance'>デジタル証明</Tab>
            </TabList>
            <TabPanel id='attendance' style={{ position: 'relative', zIndex: '0' }}>
              {formatedCredentials.length > 0 ? (
                <EventListFrame>
                  {formatedCredentials && formatedCredentials.length > 0 && (
                    <>
                      {formatedCredentials.map((credential) => (
                        <CredItem
                          key={credential.id}
                          image={credential.image}
                          name={credential.title}
                          credId={credential.id}
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
  padding: var(--kai-size-sys-space-lg) var(--kai-size-sys-space-md);
  overflow: visible;
`
const EventListFrame = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(var(--kai-size-ref-240), 1fr));
  grid-column-gap: var(--kai-size-ref-12);
  grid-row-gap: var(--kai-size-ref-12);
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
