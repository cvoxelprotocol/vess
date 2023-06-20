import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import { AccountIcon } from './AccountIcon'
import { AddFileIcon } from './AddFileIcon'
import { AddIcon } from './AddIcon'
import { BellIcon } from './BellIcon'
import { Calendar } from './Calendar'
import { Card } from './Card'
import { ChainIcon } from './ChainIcon'
import { Chat } from './Chat'
import { CheckedIcon } from './CheckedIcon'
import { CopyIcon } from './CopyIcon'
import { CrossIcon } from './CrossIcon'
import { DiscordIcon } from './DiscordIcon'
import { Dollar } from './Dollar'
import { EditIcon } from './EditIcon'
import { EthereumIcon } from './EthereumIcon'
import { ExternalIcon } from './ExternalIcon'
import { GithubIcon } from './GithubIcon'
import { HomeIcon } from './HomeIcon'
import { LeftArrowIcon } from './LeftArrowIcon'
import { Location } from './Location'
import { LogOut } from './LogOut'
import { MailIcon } from './MailIcon'
import { Pc } from './Pc'
import { Person } from './Person'
import { PointsIcon } from './PointsIcon'
import { QrIcon } from './QrIcon'
import { QuestionIcon } from './QuestionIcon'
import { RightArrowIcon } from './RightArrowIcon'
import { TelegramIcon } from './TelegramIcon'
import { TwitterIcon } from './TwitterIcon'
import { TxIcon } from './TxIcon'
import { VerifiedIcon } from './VerifiedIcon'
import { VoxelIcon } from './VoxelIcon'
import { WalletIcon } from './WalletIcon'
import { WaveIcon } from './WaveIcon'
import { WorkspaceIcon } from './WorkspaceIcon'

export const ICONS = {
  VOXEL: 'voxel',
  CROSS: 'cross',
  ADD: 'add',
  ADD_FILE: 'addFile',
  BELL: 'bell',
  CHAIN: 'chain',
  CHECKED: 'checked',
  COPY: 'copy',
  DISCORD: 'discord',
  EDIT: 'edit',
  ETHEREUM: 'ethereum',
  GITHUB: 'github',
  HOME: 'home',
  LEFT_ARROW: 'leftArrow',
  RIGHT_ARROW: 'rightArrow',
  POINTS: 'points',
  QUESTION: 'question',
  TWITTER: 'twitter',
  PERSON: 'person',
  CALENDAR: 'calendar',
  DOLLAR: 'dollar',
  LOCATION: 'location',
  LOGOUT: 'logOut',
  CHAT: 'chat',
  CARD: 'card',
  PC: 'pc',
  TELEGRAM: 'telegram',
  MAIL: 'mail',
  WORKSPACE: 'workspace',
  VERIFIED: 'verified',
  QR: 'qr',
  EXTERNAL: 'external',
  TX: 'tx',
  ACCOUNT: 'account',
  WALLET: 'wallet',
  WAVE: 'wave',
} as const

export type IconsType = (typeof ICONS)[keyof typeof ICONS]

export const ICONSIZE = {
  XS: '8px',
  SS: '12px',
  S: '14px',
  M: '16px',
  MM: '20px',
  L: '24px',
  LL: '32px',
  XL: '44px',
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
  fill?: boolean
}

export const Icon: FC<IconProps> = ({ icon, size = 'S', mainColor, focusColor, fill = false }) => {
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
    width: ${fill ? '100%' : ICONSIZE[size]};
    height: ${fill ? '100%' : ICONSIZE[size]};
    display: flex;
    align-items: center;
    justify-items: center;
  `
  const IconComponent = useMemo(() => {
    switch (icon) {
      case 'rightArrow':
        return (
          <IconContainer>
            <RightArrowIcon />
          </IconContainer>
        )
      case 'account':
        return (
          <IconContainer>
            <AccountIcon />
          </IconContainer>
        )
      case 'addFile':
        return (
          <IconContainer>
            <AddFileIcon />
          </IconContainer>
        )
      case 'wave':
        return (
          <IconContainer>
            <WaveIcon />
          </IconContainer>
        )
      case 'wallet':
        return (
          <IconContainer>
            <WalletIcon />
          </IconContainer>
        )
      case 'tx':
        return (
          <IconContainer>
            <TxIcon />
          </IconContainer>
        )
      case 'voxel':
        return (
          <IconContainer>
            <VoxelIcon />
          </IconContainer>
        )
      case 'cross':
        return (
          <IconContainer>
            <CrossIcon />
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
      case 'checked':
        return (
          <IconContainer>
            <CheckedIcon />
          </IconContainer>
        )
      case 'copy':
        return (
          <IconContainer>
            <CopyIcon />
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
      case 'github':
        return (
          <IconContainer>
            <GithubIcon />
          </IconContainer>
        )
      case 'home':
        return (
          <IconContainer>
            <HomeIcon />
          </IconContainer>
        )
      case 'leftArrow':
        return (
          <IconContainer>
            <LeftArrowIcon />
          </IconContainer>
        )
      case 'logOut':
        return (
          <IconContainer>
            <LogOut />
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
      case 'twitter':
        return (
          <IconContainer>
            <TwitterIcon />
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
      case 'telegram':
        return (
          <IconContainer>
            <TelegramIcon />
          </IconContainer>
        )
      case 'mail':
        return (
          <IconContainer>
            <MailIcon />
          </IconContainer>
        )
      case 'workspace':
        return (
          <IconContainer>
            <WorkspaceIcon />
          </IconContainer>
        )
      case 'verified':
        return (
          <IconContainer>
            <VerifiedIcon />
          </IconContainer>
        )
      case 'qr':
        return (
          <IconContainer>
            <QrIcon />
          </IconContainer>
        )
      case 'external':
        return (
          <IconContainer>
            <ExternalIcon />
          </IconContainer>
        )
      default:
        return (
          <IconContainer>
            <VoxelIcon />
          </IconContainer>
        )
    }
  }, [IconContainer, icon])

  return IconComponent
}
