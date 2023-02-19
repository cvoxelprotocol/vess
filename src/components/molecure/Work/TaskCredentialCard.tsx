import styled from '@emotion/styled'
import { FC, useMemo } from 'react'
import type { TaskCredential, WithCeramicId } from 'vess-sdk'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { convertTimestampToDateStr, formatDate } from '@/utils/date'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  crdl: WithCeramicId<TaskCredential>
  handleClick?: (item: WithCeramicId<TaskCredential>) => void
}

export const TaskCredentialCard: FC<Props> = ({ crdl, handleClick }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { organization } = useOrganization(
    crdl?.client?.format === 'did' ? crdl?.client.value : undefined,
  )

  const urlProof = useMemo(() => {
    return crdl.deliverables?.find((d) => d.format === 'url')?.value
  }, [crdl])

  const txProof = useMemo(() => {
    return crdl.deliverables?.find((d) => d.format === 'tx')?.value
  }, [crdl])

  const date = useMemo(() => {
    return crdl.endDate
      ? formatDate(crdl.endDate)
      : crdl.startDate
      ? formatDate(crdl.startDate)
      : crdl.createdAt
      ? `${convertTimestampToDateStr(crdl.createdAt)}`
      : '-'
  }, [crdl])

  const CardContainer = styled.div`
    background: ${currentTheme.depth2};
    &:hover {
      background: ${currentTheme.surface1};
    }
    overflow: hidden;
    border-radius: 16px;
    border-width: 1px;
    width: 295px;
    min-height: 160px;
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0 auto;
  `

  const Container = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding: 16px;
  `

  const Name = styled.div`
    color: ${currentTheme.onSurface};
    ${getBasicFont(currentTypo.title.medium)};
    word-break: break-all;
  `
  const ChipsContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `

  const InfoItem = styled.p`
    color: ${currentTheme.onSurface};
    text-align: left;
    ${getBasicFont(currentTypo.label.medium)};
    display: flex;
    align-items: center;
    column-gap: 4px;
  `

  const ClentHeader = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    text-align: right;
    ${getBasicFont(currentTypo.label.medium)};
  `

  const HeaderContent = styled.div`
    background-image: url('/cardHeaderBackground.png');
    width: 100%;
    height: 100px;
    filter: blur();
    display: flex;
    align-items: center;
    justify-content: space-evenly;
    padding: 20px;
  `
  const IconContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    background: ${currentTheme.surface2};
    border-radius: 12px;
    width: 56px;
    height: 56px;
    @media (max-width: 599px) {
      width: 44px;
      height: 44px;
    }
  `
  const Project = styled.div`
    display: flex;
    align-items: center;
    justify-content: end;
    gap: 8px;
  `
  const ProjectName = styled.p`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.body.small)};
  `

  const jumpToProof = (link?: string) => {
    if (!link) return
    window.open(link, '_blank')
  }

  return (
    <CardContainer>
      <HeaderContent>
        <IconContainer onClick={() => jumpToProof(urlProof)}>
          <Icon
            icon={ICONS.CHAIN}
            size={'L'}
            mainColor={
              !!urlProof && urlProof !== '' ? currentTheme.onSurface : currentTheme.surfaceVariant
            }
          />
        </IconContainer>
        <IconContainer onClick={() => jumpToProof(txProof)}>
          <Icon
            icon={ICONS.TX}
            size={'L'}
            mainColor={
              !!txProof && txProof !== '' ? currentTheme.onSurface : currentTheme.surfaceVariant
            }
          />
        </IconContainer>
      </HeaderContent>
      <Container onClick={() => handleClick && handleClick(crdl)}>
        <InfoItem>{date}</InfoItem>
        <Name>{crdl?.summary}</Name>
        {/* {crdl.deliverables &&
          crdl.deliverables.length > 0 &&
          crdl.deliverables.map((deliverable) => (
            <a
              href={`${
                deliverable.format === 'url'
                  ? deliverable.value
                  : `https://dweb.link/ipfs/${deliverable.value}`
              }`}
              target='_blank'
              rel='noreferrer'
              key={`${deliverable.format}_${deliverable.value}`}
            >
              <LinkText>
                {deliverable.format === 'url' ? deliverable.value : shortenStr(deliverable.value)}
              </LinkText>
            </a>
          ))} */}
        <Flex colGap='8px' rowGap='8px'>
          <ChipsContainer>
            {crdl?.genre && (
              <Chip
                text={crdl.genre}
                variant={'filled'}
                mainColor={currentTheme.primaryContainer}
                textColor={currentTheme.onPrimaryContainer}
                size={'S'}
                solo
              />
            )}
            {crdl?.tags &&
              crdl?.tags.map((chip) => {
                return (
                  <Chip
                    key={chip}
                    text={chip}
                    variant={'outlined'}
                    mainColor={currentTheme.outline}
                    textColor={currentTheme.onSurface}
                    size={'S'}
                  />
                )
              })}
          </ChipsContainer>
        </Flex>
        {crdl?.client && (
          <Flex justifyContent='end' colGap='8px' width='100%'>
            <ClentHeader>Client</ClentHeader>
            {organization ? (
              <Project>
                <ImageContainer
                  src={organization?.icon || 'https://workspace.vess.id/company.png'}
                  width={'26px'}
                />
                <ProjectName>{organization?.name}</ProjectName>
              </Project>
            ) : (
              <Project>
                <ImageContainer src={'https://workspace.vess.id/company.png'} width={'20px'} />
                <ProjectName>{shortenStr(crdl.client.value, 20)}</ProjectName>
              </Project>
            )}
          </Flex>
        )}
      </Container>
    </CardContainer>
  )
}
