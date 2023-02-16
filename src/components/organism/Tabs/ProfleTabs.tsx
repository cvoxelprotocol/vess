import styled from '@emotion/styled'
import * as Tabs from '@radix-ui/react-tabs'
import { FC, useEffect, useState } from 'react'
import { isMobileOnly } from 'react-device-detect'
import { EventTabContent } from './EventTabContent'

import { MembershipsTabContent } from './MembershipsTabContent'
import { WorkTabContent } from './WorkTabContent'
import { useVESSTheme } from '@/hooks/useVESSTheme'
type Props = {
  did: string
}

export const ProfleTabs: FC<Props> = ({ did }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const [isClient, setClient] = useState(false)

  useEffect(() => {
    // Avoid hydration error
    if (isMobileOnly !== isClient) {
      setClient(isMobileOnly)
    }
  }, [])

  const TabsRoot = styled(Tabs.Root)`
    width: 100%;
    height: auto;
    min-height: 100vh;
  `

  const TabsContainer = styled.div`
    width: 100%;
    height: auto;
  `

  const TabsList = styled(Tabs.List)`
    flex-shrink: 0;
    border: 1px solid ${currentTheme.surfaceVariant};
    border-width: 0px 0px 1px 0px;
    display: flex;
    flex-direction: row;
    gap: 0px;
    align-items: center;
    justify-content: flex-start;
    height: 40px;
    width: 100%;
  `

  const TabsTrigger = styled(Tabs.Trigger)`
    all: unset;
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.medium)};
    padding: 0 20px;
    height: 100%;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    &[data-state='active'] {
      border-radius: 16px 16px 0px 0px;
      background: ${currentTheme.surface3};
    }
  `

  const TabsContent = styled(Tabs.Content)`
    flex-grow: 1;
    margin: 24px 0px;
    outline: 'none';
    width: 100%;
  `

  const SPContainer = styled.div`
    width: 100%;
    height: auto;
    min-height: 100vh;
  `
  const SPTabHeader = styled.div`
    border-radius: 16px 16px 0px 0px;
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.large)};
    padding: 2px;
    border: 1px solid ${currentTheme.surfaceVariant};
    border-width: 0px 0px 1px 0px;
    margin: 48px 0 36px;
  `

  if (isClient) {
    return (
      <SPContainer>
        <SPTabHeader id={'Attendances'}>Attendances</SPTabHeader>
        <EventTabContent did={did} />
        <SPTabHeader id={'Works'}>Works</SPTabHeader>
        <WorkTabContent did={did} />
      </SPContainer>
    )
  }

  return (
    <TabsRoot defaultValue='Attendances' asChild id={'List'}>
      <TabsContainer>
        <TabsList aria-label='Profiles'>
          <TabsTrigger value='Attendances'>Attendances</TabsTrigger>
          <TabsTrigger value='Works'>Works</TabsTrigger>
        </TabsList>
        <TabsContent value='Attendances'>
          <EventTabContent did={did} />
        </TabsContent>
        <TabsContent value='Works'>
          <WorkTabContent did={did} />
        </TabsContent>
      </TabsContainer>
    </TabsRoot>
  )
}
