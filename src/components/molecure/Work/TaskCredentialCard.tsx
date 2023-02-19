import styled from '@emotion/styled'
import { FC } from 'react'
import type { TaskCredential, WithCeramicId } from 'vess-sdk'
import { Chip } from '@/components/atom/Chips/Chip'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { convertTimestampToDateStr } from '@/utils/date'
import { shortenStr } from '@/utils/objectUtil'

type Props = {
  crdl: WithCeramicId<TaskCredential>
}

export const TaskCredentialCard: FC<Props> = ({ crdl }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

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
    height: 100%;
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

  const Flex = styled.div`
    display: flex;
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
  const LinkText = styled.div`
    color: ${currentTheme.secondary};
    text-align: left;
    ${getBasicFont(currentTypo.label.medium)};
  `

  return (
    <CardContainer>
      <Container>
        <InfoItem>{crdl.createdAt ? `${convertTimestampToDateStr(crdl.createdAt)}` : ''}</InfoItem>
        <Name>{crdl?.summary}</Name>
        {crdl.deliverables &&
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
          ))}
        <Flex>
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
      </Container>
    </CardContainer>
  )
}
