import styled from '@emotion/styled'
import { useRouter } from 'next/router'
import { FC, useMemo } from 'react'
import type { WorkCredentialWithId } from 'vess-sdk'
import { Avatar } from '@/components/atom/Avatars/Avatar'
import { Chip } from '@/components/atom/Chips/Chip'
import { Icon, ICONS } from '@/components/atom/Icons/Icon'
import { useOrganization } from '@/hooks/useOrganization'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { convertTimestampToDateStr, formatDate } from '@/utils/date'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  workCredential: WorkCredentialWithId
}

export const WorkCredentialCard: FC<Props> = ({ workCredential }) => {
  const { currentTheme, currentTypo, getFont } = useVESSTheme()
  const router = useRouter()

  const work = useMemo(() => {
    return workCredential.subject.work
  }, [workCredential])

  const CardContainer = styled.div`
    background: ${currentTheme.surface};
    &:hover {
      background: ${currentTheme.surface1};
    }
    overflow: hidden;
    border-radius: 16px;
    border: solid ${currentTheme.outline};
    border-width: 1px;
    width: 295px;
    min-height: 160px;
    padding: 16px;
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
  `

  const Name = styled.div`
    color: ${currentTheme.onSurface};
    font: ${getFont(currentTypo.title.medium)};
    word-break: break-all;
  `
  const ChipsContainer = styled.div`
    width: 100%;
    height: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  `

  const ButtonContainer = styled.div`
    padding-top: 16px;
    align-items: center;
    justify-content: center;
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  `
  const Flex = styled.div`
    display: flex;
    gap: 8px;
  `
  const InfoItem = styled.p`
    color: ${currentTheme.onSurface};
    text-align: left;
    font: ${getFont(currentTypo.label.medium)};
    display: flex;
    align-items: center;
    column-gap: 4px;
  `
  const LinkText = styled.div`
    color: ${currentTheme.secondary};
    text-align: left;
    font: ${getFont(currentTypo.label.medium)};
  `

  return (
    <CardContainer>
      <Container>
        <InfoItem>{`${convertTimestampToDateStr(workCredential.createdAt)}`}</InfoItem>
        <Name>{work?.summary}</Name>
        {workCredential?.subject.deliverables &&
          workCredential?.subject.deliverables.length > 0 &&
          workCredential?.subject.deliverables.map((deliverable) => (
            <a
              href={`${
                deliverable.format === 'url'
                  ? deliverable.value
                  : `https://dweb.link/ipfs/${deliverable.value}`
              }`}
              target='_blank'
              rel='noreferrer'
              key={deliverable.value}
            >
              <LinkText>
                {deliverable.format === 'url' ? deliverable.value : shortenStr(deliverable.value)}
              </LinkText>
            </a>
          ))}
        <Flex>
          <ChipsContainer>
            {work?.genre && (
              <Chip
                text={work.genre}
                variant={'filled'}
                mainColor={currentTheme.primaryContainer}
                textColor={currentTheme.onPrimaryContainer}
                size={'S'}
                solo
              />
            )}
            {work?.tags &&
              work?.tags.map((chip) => {
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
      </Container>
    </CardContainer>
  )
}
