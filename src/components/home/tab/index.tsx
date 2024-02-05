import styled from '@emotion/styled'
import { useKai } from 'kai-kit'
import React, { FC } from 'react'
import {
  Tabs as RACTabs,
  Tab as RACTab,
  TabList as RACTabList,
  TabPanel as RACTabPanel,
} from 'react-aria-components'
import type {
  TabsProps as RACTabsProps,
  TabProps as RACTabProps,
  TabListProps as RACTabListProps,
  TabPanelProps as RACTabPanelProps,
} from 'react-aria-components'

import { Text } from '@/kai/text/Text'

/* Tabs Component */
export type TabsProps = {
  children?: React.ReactNode
  width?: string
} & RACTabsProps

export const Tabs: FC<TabsProps> = ({ children, width = '100%', ...props }) => {
  return (
    <TabsFrame width={width} {...props}>
      {children}
    </TabsFrame>
  )
}

const TabsFrame = styled(RACTabs)<{ width: string }>`
  display: flex;
  flex-direction: column;
  gap: var(--kai-size-ref-16);
  align-items: center;
  justify-content: center;
  width: ${({ width }) => width};

  .react-aria-TabPanel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: var(--kai-size-ref-16);
  }

  .react-aria-TabList {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--kai-size-ref-4);
    width: 100%;
    height: 100%;
    padding: var(--kai-size-ref-4);
    background: var(--kai-color-sys-surface-container-high);
    border-radius: var(--kai-size-sys-round-sm);

    .react-aria-Tab {
      display: flex;
      justify-content: center;
      align-items: center;
      flex: 1;
      height: var(--kai-size-ref-32);
      background: transparent;
      border-radius: calc(var(--kai-size-sys-round-sm) - var(--kai-size-ref-4));
      transition: background 0.5s cubic-bezier(0, 0.7, 0.3, 1);

      &[data-hovered] {
        background: var(--kai-color-sys-surface-container-low);
        cursor: pointer;
      }

      &[data-pressed] {
        transform: scale(0.98);
        opacity: 0.8;
      }

      &[data-selected] {
        background: var(--kai-color-sys-surface-container-lowest);
        cursor: default;
      }

      &:focus {
        outline: none;
      }

      &:focus-visible {
        outline: var(--kai-size-ref-2) solid var(--kai-color-sys-primary);
        outline-offset: var(--kai-size-ref-2);
      }
    }
  }
`

/* TabList Component */
export { RACTabList as TabList }

/* Tab Component */
export type TabProps = {
  children?: React.ReactNode
} & RACTabProps

export const Tab: FC<TabProps> = ({ children, ...props }) => {
  const { kai } = useKai()

  return (
    <RACTab {...props}>
      <Text as='span' typo='label-lg' color={kai.color.sys.onSurface}>
        {children}
      </Text>
    </RACTab>
  )
}

/* TabPanel Component */
export type TabPanelProps = RACTabPanelProps

export { RACTabPanel as TabPanel }
