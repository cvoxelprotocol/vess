import styled from '@emotion/styled'
import dynamic from 'next/dynamic'
import { FC, useMemo } from 'react'
import { Chip } from '@/components/atom/Chips/Chip'
import { Flex } from '@/components/atom/Common/Flex'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { ImageContainer } from '@/components/atom/Images/ImageContainer'
import { useOrganization } from '@/hooks/useOrganization'
import { useTaskCredential } from '@/hooks/useTaskCredential'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { formatDate } from '@/utils/date'
import { shortenStr } from '@/utils/objectUtil'

const VisualizerPresenterWrapper = dynamic(
  () => import('@/components/atom/Voxels/VisualizerPresenterWrapper'),
  {
    ssr: false,
  },
)

type Props = {
  streamId?: string
}
export const TaskDetailContent: FC<Props> = ({ streamId }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { taskDetail } = useTaskCredential(streamId)
  const { organization } = useOrganization(
    taskDetail?.client?.format === 'did' ? taskDetail?.client.value : undefined,
  )

  const Container = styled.div`
    padding: 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    position: relative;
    height: 65vh;
    gap: 16px;
    background: ${currentTheme.surface3};
    margin-bottom: 60px;
    overflow-y: scroll;
    ::-webkit-scrollbar {
      display: none;
    }
    @media (max-width: 599px) {
      height: 70vh;
      margin: 0 12px;
    }
  `
  const InfoContainer = styled.div`
    display: flex;
    gap: 32px;
    @media (max-width: 599px) {
      width: 100%;
      flex-direction: column;
      gap: 8px;
      align-items: center;
    }
  `

  const Title = styled.div`
    color: ${currentTheme.primary};
    ${getBasicFont(currentTypo.headLine.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
  `
  const Project = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
  `
  const ProjectName = styled.p`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.small)};
    }
  `
  const PfpContainer = styled.div`
    width: 200px;
    height: 200px;
    @media (max-width: 599px) {
      width: 120px;
      height: 120px;
    }
  `
  const InfoContent = styled.div`
    display: flex;
    gap: 8px;
    flex-direction: column;
    flex-grow: 1;
    @media (max-width: 599px) {
      width: 100%;
    }
  `
  const InfoItem = styled.p`
    color: ${currentTheme.onSurface};
    text-align: left;
    ${getBasicFont(currentTypo.label.medium)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.label.small)};
    }
    display: flex;
    align-items: center;
    column-gap: 4px;
  `
  const LinkText = styled.a`
    color: ${currentTheme.secondary};
    text-decoration: none;
  `
  const UnVcMarkContainer = styled.div`
    width: 100%;
    flex-grow: 1;
    position: relative;
    padding: 8px 0;
  `
  const UnVcMark = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    width: fit-content;
    right: 0;
    bottom: 0;
    gap: 6px;
  `
  const VcText = styled.div`
    color: ${currentTheme.tertiary};
    ${getBasicFont(currentTypo.label.medium)};
    word-wrap: break-word;
  `

  const UnVcText = styled.div`
    color: ${currentTheme.outline};
    ${getBasicFont(currentTypo.label.medium)};
    word-wrap: break-word;
  `

  const Section = styled.div`
    width: 100%;
    display: flex;
    gap: 16px;
    flex-direction: column;
  `

  const SectionHeader = styled.p`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
  `

  const SectionContent = styled.div`
    width: 100%;
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.body.large)};
    word-wrap: break-word;
  `

  const ChipsContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `

  const VisualizerPresenterMemo = useMemo(
    () => <VisualizerPresenterWrapper content={taskDetail ? [taskDetail] : []} />,
    [taskDetail],
  )

  return (
    <Container>
      <InfoContainer>
        <PfpContainer>{VisualizerPresenterMemo}</PfpContainer>
        <InfoContent>
          <Title>{taskDetail?.summary}</Title>
          <Flex>
            <ChipsContainer>
              {taskDetail?.genre && (
                <Chip
                  text={taskDetail.genre}
                  variant={'filled'}
                  mainColor={currentTheme.primaryContainer}
                  textColor={currentTheme.onPrimaryContainer}
                  size={'S'}
                  solo
                />
              )}
              {taskDetail?.tags &&
                taskDetail?.tags.map((chip) => {
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
          {taskDetail?.client && (
            <>
              <SectionContent>Client</SectionContent>
              <Flex>
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
                    <ProjectName>
                      {taskDetail?.client?.format === 'name' ? taskDetail.client.value : '-'}
                    </ProjectName>
                  </Project>
                )}
              </Flex>
            </>
          )}
          <InfoItem>
            <Icon icon={ICONS.CALENDAR} size={'MM'} />
            {`${formatDate(taskDetail?.startDate)}-${formatDate(taskDetail?.endDate)}`}
          </InfoItem>
          <UnVcMarkContainer>
            <UnVcMark>
              <UnVcText>UnVerified</UnVcText>
            </UnVcMark>
          </UnVcMarkContainer>
        </InfoContent>
      </InfoContainer>
      <Section>
        <SectionHeader>Description</SectionHeader>
        <SectionContent>{taskDetail?.detail}</SectionContent>
      </Section>
      <Section>
        <SectionHeader>Proofs</SectionHeader>
        {taskDetail?.deliverables &&
          taskDetail?.deliverables?.length > 0 &&
          taskDetail?.deliverables?.map((proof) => {
            return (
              <>
                {proof.value !== '' && (
                  <InfoItem key={`${proof.format}-${proof.value}`}>
                    {proof.format === 'tx' ? (
                      <Icon icon={ICONS.TX} size={'MM'} />
                    ) : (
                      <Icon icon={ICONS.CHAIN} size={'MM'} />
                    )}
                    <LinkText href={proof.value} target='_blank' rel='noreferrer'>{`${shortenStr(
                      proof.value,
                      30,
                    )}`}</LinkText>
                  </InfoItem>
                )}
              </>
            )
          })}
      </Section>
    </Container>
  )
}
