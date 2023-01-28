import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { AddFileIcon } from './AddFileIcon'
import { AddIcon } from './AddIcon'
import { BellIcon } from './BellIcon'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { ChainIcon } from './ChainIcon'
import { Chat } from './Chat'
import { CheckedCircleIcon } from './CheckedCircleIcon'
import { CheckedIcon } from './CheckedIcon'
import { CheckedSquareIcon } from './CheckedSquareIcon'
import { CopyIcon } from './CopyIcon'
import { CrossFilledIcon } from './CrossFilledIcon'
import { CrossIcon } from './CrossIcon'
import { DiscordIcon } from './DiscordIcon'
import { Dollar } from './Dollar'
import { ENSIcon } from './ENSIcon'
import { EditIcon } from './EditIcon'
import { EthereumIcon } from './EthereumIcon'
import { EventAttendanceIcon } from './EventAttendanceIcon'
import { ExpandIcon } from './ExpandIcon'
import { ExportIcon } from './ExportIcon'
import { GithubIcon } from './GithubIcon'
import { GlassIcon } from './GlassIcon'
import { HomeIcon } from './HomeIcon'
import { ImportIcon } from './ImportIcon'
import { LeftArrowIcon } from './LeftArrowIcon'
import { Location } from './Location'
import { MessageCircleIcon } from './MessageCircleIcon'
import { MoonIcon } from './MoonIcon'
import { Pc } from './Pc'
import { Person } from './Person'
import { PointsIcon } from './PointsIcon'
import { QuestionIcon } from './QuestionIcon'
import { SettingIcon } from './SettingIcon'
import { SunIcon } from './SunIcon'
import { SurinkIcon } from './SurinkIcon'
import { TwitterIcon } from './TwitterIcon'
import { VoxelIcon } from './VoxelIcon'
import { VoxelslIcon } from './VoxelsIcon'

export const ICONS = {
  VOXEL: 'voxel',
  ENS: 'ens',
  CROSS: 'cross',
  ADD_FILE: 'addFile',
  ADD: 'add',
  BELL: 'bell',
  CHAIN: 'chain',
  CHECKED_CIRCLE: 'checkedCircle',
  CHECKED: 'checked',
  CHECKED_SQUARE: 'checkedSquare',
  COPY: 'copy',
  CROSS_FILLED: 'crossFilled',
  DISCORD: 'discord',
  EDIT: 'edit',
  ETHEREUM: 'ethereum',
  VOXELS: 'voxels',
  EVENT_ATTENDANCE: 'eventAttendance',
  EXPAND: 'expand',
  EXPORT: 'export',
  GITHUB: 'github',
  GLASS: 'glass',
  HOME: 'home',
  IMPORT: 'import',
  LEFT_ARROW: 'leftArrow',
  MESSAGE_CIRCLE: 'messageCircle',
  MOON: 'moon',
  POINTS: 'points',
  QUESTION: 'question',
  SETTING: 'setting',
  SUN: 'sun',
  SURINK: 'surink',
  TWITTER: 'twitter',
  PERSON: 'person',
  CALENDAR: 'calendar',
  DOLLAR: 'dollar',
  LOCATION: 'location',
  CHAT: 'chat',
  CARD: 'card',
  PC: 'pc',
} as const

export type IconsType = typeof ICONS[keyof typeof ICONS]

export const ICONSIZE = {
  XS: '8px',
  SS: '12px',
  S: '14px',
  M: '16px',
  MM: '20px',
  L: '24px',
  XL: '32px',
  XXL: '56px',
  '100': '100px',
  '180': '180px',
  '200': '200px',
} as const

export type IconSize = keyof typeof ICONSIZE

type IconProps = {
  icon: IconsType
  size?: IconSize
  mainColor?: string
  focusColor?: string
}

export const Icon: FC<IconProps> = ({ icon, size = 'S', mainColor, focusColor }) => {
  const IconContainer = styled.span`
    color: ${mainColor};
    &:active {
      transition: all 0.15s ease-out;
      color: ${focusColor || mainColor};
    }
    &:focus {
      transition: all 0.15s ease-out;
      color: ${focusColor || mainColor};
    }
    width: ${ICONSIZE[size]};
    height: ${ICONSIZE[size]};
    display: flex;
    align-items: center;
    justify-items: center;
  `
  const IconComponent = useMemo(() => {
    switch (icon) {
      case 'voxel':
        return (
          <IconContainer>
            <VoxelIcon />
          </IconContainer>
        )
      case 'ens':
        return (
          <IconContainer>
            <ENSIcon />
          </IconContainer>
        )
      case 'cross':
        return (
          <IconContainer>
            <CrossIcon />
          </IconContainer>
        )
      case 'addFile':
        return (
          <IconContainer>
            <AddFileIcon />
          </IconContainer>
        )
      case 'add':
        return (
          <IconContainer>
            <AddIcon />
          </IconContainer>
        )
      case 'bell':
        return (
          <IconContainer>
            <BellIcon />
          </IconContainer>
        )
      case 'chain':
        return (
          <IconContainer>
            <ChainIcon />
          </IconContainer>
        )
      case 'checkedCircle':
        return (
          <IconContainer>
            <CheckedCircleIcon />
          </IconContainer>
        )
      case 'checked':
        return (
          <IconContainer>
            <CheckedIcon />
          </IconContainer>
        )
      case 'checkedSquare':
        return (
          <IconContainer>
            <CheckedSquareIcon />
          </IconContainer>
        )
      case 'copy':
        return (
          <IconContainer>
            <CopyIcon />
          </IconContainer>
        )
      case 'crossFilled':
        return (
          <IconContainer>
            <CrossFilledIcon />
          </IconContainer>
        )
      case 'discord':
        return (
          <IconContainer>
            <DiscordIcon />
          </IconContainer>
        )
      case 'edit':
        return (
          <IconContainer>
            <EditIcon />
          </IconContainer>
        )
      case 'ethereum':
        return (
          <IconContainer>
            <EthereumIcon />
          </IconContainer>
        )
      case 'voxels':
        return (
          <IconContainer>
            <VoxelslIcon />
          </IconContainer>
        )
      case 'eventAttendance':
        return (
          <IconContainer>
            <EventAttendanceIcon />
          </IconContainer>
        )
      case 'expand':
        return (
          <IconContainer>
            <ExpandIcon />
          </IconContainer>
        )
      case 'export':
        return (
          <IconContainer>
            <ExportIcon />
          </IconContainer>
        )
      case 'github':
        return (
          <IconContainer>
            <GithubIcon />
          </IconContainer>
        )
      case 'glass':
        return (
          <IconContainer>
            <GlassIcon />
          </IconContainer>
        )
      case 'home':
        return (
          <IconContainer>
            <HomeIcon />
          </IconContainer>
        )
      case 'import':
        return (
          <IconContainer>
            <ImportIcon />
          </IconContainer>
        )
      case 'leftArrow':
        return (
          <IconContainer>
            <LeftArrowIcon />
          </IconContainer>
        )
      case 'moon':
        return (
          <IconContainer>
            <MoonIcon />
          </IconContainer>
        )
      case 'messageCircle':
        return (
          <IconContainer>
            <MessageCircleIcon />
          </IconContainer>
        )
      case 'points':
        return (
          <IconContainer>
            <PointsIcon />
          </IconContainer>
        )
      case 'question':
        return (
          <IconContainer>
            <QuestionIcon />
          </IconContainer>
        )
      case 'setting':
        return (
          <IconContainer>
            <SettingIcon />
          </IconContainer>
        )
      case 'surink':
        return (
          <IconContainer>
            <SurinkIcon />
          </IconContainer>
        )
      case 'twitter':
        return (
          <IconContainer>
            <TwitterIcon />
          </IconContainer>
        )
      case 'sun':
        return (
          <IconContainer>
            <SunIcon />
          </IconContainer>
        )
      case 'person':
        return (
          <IconContainer>
            <Person />
          </IconContainer>
        )
      case 'calendar':
        return (
          <IconContainer>
            <Calendar />
          </IconContainer>
        )
      case 'dollar':
        return (
          <IconContainer>
            <Dollar />
          </IconContainer>
        )
      case 'location':
        return (
          <IconContainer>
            <Location />
          </IconContainer>
        )
      case 'chat':
        return (
          <IconContainer>
            <Chat />
          </IconContainer>
        )
      case 'card':
        return (
          <IconContainer>
            <Card />
          </IconContainer>
        )
      case 'pc':
        return (
          <IconContainer>
            <Pc />
          </IconContainer>
        )
      default:
        return (
          <IconContainer>
            <VoxelIcon />
          </IconContainer>
        )
    }
  }, [icon])

  return IconComponent
}
