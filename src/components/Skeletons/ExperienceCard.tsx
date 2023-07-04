import styled from '@emotion/styled'
import { useVESSTheme } from '@/hooks/useVESSTheme'

export const SkeletonExperienceCard = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()

  const MembershipCardWrapper = styled.div`
    background: ${currentTheme.depth2};
    width: 100%;
    display: flex;
    padding: 12px 16px;
    gap: 24px;
    position: relative;
    border-radius: 24px;
    @media (max-width: 599px) {
      flex-direction: column;
      align-items: center;
      padding: 24px 16px;
      gap: 8px;
      width: 292px;
    }
  `
  const InfoContainer = styled.div`
    flex-grow: 1;
    gap: 8px;
    padding-top: 8px;
    display: flex;
    flex-direction: column;
    @media (max-width: 599px) {
      width: 100%;
      padding-top: 0px;
      gap: 4px;
    }
  `

  return (
    <MembershipCardWrapper>
      <InfoContainer></InfoContainer>
    </MembershipCardWrapper>
  )
}
