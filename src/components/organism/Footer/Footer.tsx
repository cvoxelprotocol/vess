import styled from '@emotion/styled'
import { FC } from 'react'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { NextImageContainer } from '@/components/atom/Images/NextImageContainer'
import { footerLinksType } from '@/constants/footerLinks'
import { SOURCE_LINK } from '@/constants/sourceLink'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  src: string
  links: footerLinksType
  copyright?: string
  background?: string
  textColor?: string
}

export const Footer: FC<Props> = ({
  src,
  links,
  copyright = '©️ 2023 VESS Labs, Inc. All rights reserved.',
  background,
  textColor,
}) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const FooterSection = styled.section`
    width: 100%;
    display: flex;
    flex-direction: column;
    background: ${background || 'transparent'};
  `

  const FooterContainer = styled.footer`
    width: 100%;
    height: fit-content;
    background: transparent;
    display: flex;
    flex-wrap: wrap;
  `

  const LogoContainer = styled.div`
    display: flex;
    align-items: start;
    justify-content: center;
    padding: 0px 40px;
    flex-direction: column;
    width: 320px;
    min-height: 150px;

    @media (max-width: 599px) {
      padding: 0px 8px;
      width: 100%;
    }
  `

  const LinksContainer = styled.div`
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    flex: 1;
    @media (max-width: 599px) {
      flex-wrap: wrap;
    }
  `

  const LinksSection = styled.div`
    display: flex;
    padding: 8px 24px;
    flex-direction: column;
    width: 100%;
    gap: 8px;
    @media (max-width: 599px) {
      padding: 8px 8px;
    }
  `

  const LinksTitle = styled.div`
    color: ${textColor || currentTheme.onSurfaceVariant};
    opacity: 0.6;
    ${getBasicFont(currentTypo.title.medium)};
  `

  const LinkStyle = styled.a`
    color: ${textColor || currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.title.large)};
    text-decoration: none;
    white-space: nowrap;

    &:hover {
      color: ${currentTheme.primary};
    }
  `

  const CopyRight = styled.div`
    width: 100%;
    margin: 16px 32px;
    border-top: solid 1px ${textColor || currentTheme.onSurfaceVariant};
    padding: 32px 16px;
    color: ${textColor || currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.body.medium)}
    opacity: 0.6;

    @media (max-width: 599px) {
      margin: 16px 8px;
      padding: 24px 8px;
      ${getBasicFont(currentTypo.body.small)}
    }
  `
  const SourceLinkWrapper = styled.a`
    width: 40px;
    height: 40px;
    margin: 8px 8px;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  `

  return (
    <FooterSection>
      <FooterContainer>
        <LogoContainer>
          <NextImageContainer
            src={src}
            objectFit={'contain'}
            width='200px'
            height='64px'
          ></NextImageContainer>
          <Flex>
            <SourceLinkWrapper
              href={SOURCE_LINK.DISCORD}
              target={'_blank'}
              rel='noopener noreferrer'
            >
              <Icon icon={ICONS.DISCORD} mainColor={currentTheme.onSurface} fill />
            </SourceLinkWrapper>
            <SourceLinkWrapper
              href={SOURCE_LINK.TWITTER}
              target={'_blank'}
              rel='noopener noreferrer'
            >
              <Icon icon={ICONS.TWITTER} mainColor={currentTheme.onSurface} fill />
            </SourceLinkWrapper>
            <SourceLinkWrapper
              href={SOURCE_LINK.GITHUB}
              target={'_blank'}
              rel='noopener noreferrer'
            >
              <Icon icon={ICONS.GITHUB} mainColor={currentTheme.onSurface} fill />
            </SourceLinkWrapper>
          </Flex>
        </LogoContainer>
        <LinksContainer>
          {Object.keys(links).map((title) => {
            return (
              <>
                <LinksSection key={title}>
                  <LinksTitle>{title}</LinksTitle>

                  {links[title].links.map((link) => {
                    return (
                      <LinkStyle
                        href={link.url}
                        key={link.label}
                        target='_blank'
                        rel='noopener noreferrer'
                      >
                        {link.label}
                      </LinkStyle>
                    )
                  })}
                </LinksSection>
              </>
            )
          })}
        </LinksContainer>
      </FooterContainer>
      <CopyRight>{copyright}</CopyRight>
    </FooterSection>
  )
}
