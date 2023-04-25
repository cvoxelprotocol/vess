import styled from '@emotion/styled'
import * as Tabs from '@radix-ui/react-tabs'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'
import { isMobileOnly } from 'react-device-detect'
import ConnectionTabContent from './ConnectionTabContent'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { useStateProfileTab } from '@/jotai/ui'
type Props = {
  did: string
}

const EventTabContent = dynamic(() => import('@/components/organism/Tabs/EventTabContent'), {
  ssr: false,
})

const WorkTabContent = dynamic(() => import('@/components/organism/Tabs/WorkTabContent'), {
  ssr: false,
})

export default function ProfleTabs({ did }: Props) {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const [isClient, setClient] = useState(false)
  const [selectedTab, selectTab] = useStateProfileTab()

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
        <SPTabHeader id={'Connections'}>Connections</SPTabHeader>
        <ConnectionTabContent did={did} />
        <SPTabHeader id={'Attendances'}>Attendances</SPTabHeader>
        <EventTabContent did={did} />
        <SPTabHeader id={'Tasks'}>Works</SPTabHeader>
        <WorkTabContent did={did} />
      </SPContainer>
    )
  }

  return (
    <TabsRoot
      defaultValue={selectedTab}
      id={'List'}
      activationMode='manual'
      onValueChange={(v) =>
        selectTab(v === 'Attendances' ? 'Attendances' : v === 'Tasks' ? 'Tasks' : 'Connections')
      }
    >
      <TabsContainer>
        <TabsList aria-label='Profiles'>
          <TabsTrigger value='Connections'>Connections</TabsTrigger>
          <TabsTrigger value='Attendances'>Attendances</TabsTrigger>
          <TabsTrigger value='Tasks'>Works</TabsTrigger>
        </TabsList>
        <TabsContent value='Connections' id={'Connections'}>
          <ConnectionTabContent did={did} />
        </TabsContent>
        <TabsContent value='Attendances' id={'Attendances'}>
          <EventTabContent did={did} />
        </TabsContent>
        <TabsContent value='Tasks' id={'Tasks'}>
          <WorkTabContent did={did} />
        </TabsContent>
      </TabsContainer>
    </TabsRoot>
  )
}
