import styled from '@emotion/styled'
import { FC, useMemo, useState } from 'react'
import { Button } from '@/components/atom/Buttons/Button'
import { Flex } from '@/components/atom/Common/Flex'
import { NoItem } from '@/components/atom/Common/NoItem'
import { ICONS } from '@/components/atom/Icons/Icon'
import { CommonSpinner } from '@/components/atom/Loading/CommonSpinner'
import { Text } from '@/components/atom/Texts/Text'
import { ExperienceCard } from '@/components/molecure/Profile/Experiences/ExperienceCard'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useHeldMembershipSubject } from '@/hooks/useHeldMembershipSubject'
import { useSelfClaimedMembership } from '@/hooks/useSelfClaimedMembership'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { sortedMembership } from '@/interfaces/ui'
import { convertDateStrToTimestamp } from '@/utils/date'

type Props = {
  did?: string
}
export const ExperiencesContainer: FC<Props> = ({ did }) => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { displayHeldMembership, isFetchingHeldMembershipSubjects } = useHeldMembershipSubject(did)
  const { selfClaimedMemberships } = useSelfClaimedMembership(did)
  const { openMembershipModal, openEditSelfClaimMembershipModal } = useVESSWidgetModal()
  const [editExperience, setEditExperience] = useState(false)
  const [ editButtonText, setEditButtonText] = useState('Edit')
  const { did: myDID } = useDIDAccount()

  const hasMemberships = useMemo(() => {
    if (isFetchingHeldMembershipSubjects) return false
    return (
      (displayHeldMembership && displayHeldMembership.length > 0) ||
      (selfClaimedMemberships && selfClaimedMemberships.length > 0)
    )
  }, [displayHeldMembership, selfClaimedMemberships, isFetchingHeldMembershipSubjects])

  const sortedMemberships = useMemo(() => {
    if (!displayHeldMembership && !selfClaimedMemberships) return []
    let sorted: sortedMembership[] = []
    displayHeldMembership.forEach((m) => {
      sorted.push({
        item: m,
        startDate: m.credentialSubject.startDate,
        endDate: m.credentialSubject.endDate,
      })
    })
    selfClaimedMemberships?.forEach((m) => {
      sorted.push({ selfClaim: m, startDate: m.startDate, endDate: m.endDate })
    })
    return sorted.sort((a, b) => {
      return convertDateStrToTimestamp(a.startDate) > convertDateStrToTimestamp(b.startDate)
        ? -1
        : 1
    })
  }, [displayHeldMembership, selfClaimedMemberships])

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    gap: 24px;
    margin-bottom: 32px;
    padding: 16px;
    @media (max-width: 599px) {
      gap: 8px;
    }
  `
  const handleAdd = () => {
    openMembershipModal()
  }
  const handleEdit = () => {
    if (!editExperience) {
      setEditExperience(true)
      //openEditSelfClaimMembershipModal()
      setEditButtonText('Done')
    }else {
      setEditExperience(false)
      setEditButtonText('Edit')
    }
   
  }
  return (
    <>
      <Flex justifyContent='space-between' padding='16px' width='100%'>
        <Text
          type='p'
          color={currentTheme.onBackground}
          font={getBasicFont(currentTypo.title.large)}
          text={`Experiences`}
        />
        {myDID === did && (
      <Flex justifyContent='flex-end' padding='16px' width='100%'>
      <Button
          variant='outlined'
          text='Add'
          onClick={() => handleAdd()} // changing to ADD new experience
          mainColor={currentTheme.outline}
          textColor={currentTheme.onSurface}
          size={'S'}
          icon={ICONS.ADD}
          btnWidth={'80px'}
          style={{marginRight:'5px'}}
        />
          <Button
            variant='filled'
            text={editButtonText}
            onClick={() => handleEdit()}
            mainColor={currentTheme.onPrimary}
            textColor={currentTheme.onSurface}
            size={'S'}
            icon={editExperience ? ICONS.CHECKED : ICONS.EDIT}
            btnWidth={'80px'}
          />
          </Flex>
        )}
      </Flex>
      <Container>
     

        {isFetchingHeldMembershipSubjects ? (
          <CommonSpinner />
        ) : (
          <>
            {!hasMemberships ? (
              <NoItem text={'No Item yet'} />
            ) : (
              <>
                {sortedMemberships &&
                  sortedMemberships.map((item) => {
                    return (
                      <ExperienceCard
                        key={item.item?.ceramicId || item.selfClaim?.ceramicId}
                        item={item.item}
                        selfClaim={item.selfClaim}
                        editExperience={editExperience}
                      />
                    )
                  })}
              </>
            )}
          </>
        )}

      </Container>
    </>
  )
}
