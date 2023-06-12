import styled from '@emotion/styled'
import { ButtonHTMLAttributes, FC, useMemo } from 'react'
import { Avatar } from '../Avatars/Avatar'
import { IconButton } from '../Buttons/IconButton'
import { Icon, IconsType } from '../Icons/Icon'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const PLATESIZE = {
  M: 'M',
  L: 'L',
} as const

export type PlateSize = keyof typeof PLATESIZE

interface PlateProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  name: string
  pfp?: string
  pfpIcon?: IconsType
  iconOnly?: boolean
  markIcon?: IconsType
  tailIcon?: IconsType
  size?: PlateSize
  onClickTailIcon?: () => void
}

export const Plate: FC<PlateProps> = ({
  name,
  pfp,
  pfpIcon,
  iconOnly = false,
  markIcon,
  tailIcon,
  size = 'L',
  onClickTailIcon,
  ...props
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const typo = useMemo(() => {
    return size === 'L' ? currentTypo.title.medium : currentTypo.label.large
  }, [size, currentTypo])

  const iconSize = useMemo(() => {
    return size === 'L' ? 'MM' : 'M'
  }, [size])

  const padding = useMemo(() => {
    return !iconOnly ? (tailIcon ? `4px 6px 4px 5px` : '4px 16px 4px 5px') : '4px 16px 4px 16px'
  }, [size, tailIcon])

  if (props.disabled) {
    const PlateContainer = styled.button`
      background: none;
      opacity: 0.4;
      border-radius: 67px;
      border: none;
      display: flex;
      flex-direction: column;
      gap: 10px;
      align-items: center;
      justify-content: center;
      padding: 0;
      width: fit-content;
      height: fit-content;
    `
    const PlateLayer = styled.div`
      background: ${currentTheme.surfaceVariant};
      border: ${`solid ${currentTheme.outline}`};
      border-radius: 79px;
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: flex;
      width: fit-content;
      border-width: 1px;
      padding: ${padding};
    `
    const ProfileWrapper = styled.div`
      display: flex;
      flex-direction: row;
      gap: 8px;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
      position: relative;
    `
    const NameWrapper = styled.div`
      display: flex;
      flex-direction: row;
      gap: 4px;
      align-items: center;
      justify-content: flex-start;
      flex-shrink: 0;
      position: relative;
    `

    const PlateText = styled.span`
      background: none;
      text-align: center;
      ${getBasicFont(typo)};
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      white-space: nowrap;
      color: ${currentTheme.onSurfaceVariant};
      opacity: 1;
    `
    return (
      <PlateContainer {...props}>
        <PlateLayer>
          <ProfileWrapper>
            {pfp && <Avatar url={pfp} size={size === 'L' ? 'XL' : 'L'} />}
            {pfpIcon && <Icon icon={pfpIcon} size={size === 'L' ? 'XL' : 'L'} />}
            {!iconOnly && (
              <>
                <NameWrapper>
                  <PlateText>{name}</PlateText>
                  {markIcon && <Icon icon={markIcon} size={iconSize} />}
                </NameWrapper>
                {tailIcon && (
                  <IconButton
                    icon={tailIcon}
                    size={'XS'}
                    mainColor={currentTheme.onSurfaceVariant}
                    variant={'text'}
                    onClick={() => onClickTailIcon}
                  />
                )}
              </>
            )}
          </ProfileWrapper>
        </PlateLayer>
      </PlateContainer>
    )
  }

  const PlateContainer = styled.button`
    background: ${currentTheme.primaryContainer};
    border: ${`solid 1px ${currentTheme.primary}`};
    border-radius: 67px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    padding: 0px;
  `
  const PlateLayer = styled.div`
    background: 'none';
    &:hover {
      background: ${currentTheme.onPrimaryContainerOpacity10};
      transition: all 0.15s ease-out;
    }
    &:active {
      transition: all 0.15s ease-out;
      background: ${currentTheme.onPrimaryContainerOpacity10};
    }
    &:focus {
      transition: all 0.15s ease-out;
      background: ${currentTheme.onPrimaryContainerOpacity40};
    }
    border-radius: 79px;
    display: flex;
    flex-direction: row;
    gap: 16px;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    position: flex;
    width: fit-content;
    padding: ${padding};
  `

  const ProfileWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 8px;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
  `
  const NameWrapper = styled.div`
    display: flex;
    flex-direction: row;
    gap: 4px;
    align-items: center;
    justify-content: flex-start;
    flex-shrink: 0;
    position: relative;
  `

  const PlateText = styled.span`
    background: none;
    color: ${currentTheme.onSurface};
    &:focus {
      transition: all 0.15s ease-out;
      color: ${currentTheme.onPrimary};
    }
    text-align: center;
    ${getBasicFont(typo)};
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    white-space: nowrap;
  `

  return (
    <PlateContainer {...props}>
      <PlateLayer>
        <ProfileWrapper>
          {pfp && <Avatar url={pfp} size={size === 'L' ? 'XL' : 'L'} />}
          {pfpIcon && <Icon icon={pfpIcon} size={size === 'L' ? 'XL' : 'L'} />}
          {!iconOnly && (
            <>
              <NameWrapper>
                <PlateText>{name}</PlateText>
                {markIcon && <Icon icon={markIcon} size={iconSize} />}
              </NameWrapper>
              {tailIcon && (
                <IconButton
                  icon={tailIcon}
                  size={'XS'}
                  mainColor={currentTheme.onSurface}
                  focusColor={currentTheme.onPrimary}
                  variant={'text'}
                  onClick={() => onClickTailIcon}
                />
              )}
            </>
          )}
        </ProfileWrapper>
      </PlateLayer>
    </PlateContainer>
  )
}
