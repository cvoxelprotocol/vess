import styled from '@emotion/styled'
import * as Tabs from '@radix-ui/react-tabs'
import { FC } from 'react'
import { CreateWorkCredentialContent } from './CreateWorkCredentialContent'
import { SelfClaimMembershipContent } from './SelfClaimMembershipContent'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const ClaimTabs: FC = () => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()

  const TabsRoot = styled(Tabs.Root)`
    width: 100%;
    height: auto;
  `

  const TabsContainer = styled.div`
    width: 100%;
    height: auto;
  `

  const TabsList = styled(Tabs.List)`
    flex-shrink: 0;
    border-bottom: 1px solid ${currentTheme.outline};
    border-width: 0px 0px 1px 0px;
    display: flex;
    flex-direction: row;
    gap: 0px;
    align-items: center;
    justify-content: flex-start;
    height: 58px;
    width: 100%;
  `

  const TabsTrigger = styled(Tabs.Trigger)`
    all: unset;
    color: ${currentTheme.onSurface};
    font: ${getFont(currentTypo.title.large)};
    margin: 16px 0px;
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
    font: ${getFont(currentTypo.title.large)};
    padding: 2px;
    border: 1px solid ${currentTheme.surfaceVariant};
    border-width: 0px 0px 1px 0px;
    margin: 48px 0 36px;
  `

  return (
    <TabsRoot defaultValue='Experiences' asChild id={'List'}>
      <TabsContainer>
        <TabsList aria-label='Claim'>
          <TabsTrigger value='Experiences'>Experiences</TabsTrigger>
          <TabsTrigger value='Works'>Works</TabsTrigger>
        </TabsList>
        <TabsContent value='Experiences' asChild>
          <SelfClaimMembershipContent />
        </TabsContent>
        <TabsContent value='Works' asChild>
          <CreateWorkCredentialContent />
        </TabsContent>
      </TabsContainer>
    </TabsRoot>
  )
}
