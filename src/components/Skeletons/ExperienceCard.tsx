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
    justify-content: start;

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
    gap: 10px;

    padding-top: 10px;
    display: flex;
    flex-direction: row;
    background-color: ${currentTheme.background}

    @media (max-width: 599px) {
      width: 100%;
      padding-top: 0px;
      gap: 4px;
    }
  `

  const InfoContainer2 = styled.div`
 
  display: flex;
  flex-direction: column;

`
  const LoadingBox = styled.div`
    width: 300px;
    height: 200px;
    margin: 10px;
    background-color: ${currentTheme.primaryContainerOpacity10};
    border-radius:10px;
    display: flex;
  `

  const LoadingBox2 = styled.div`
    width: 400px;
    height: 30px;
    margin: 10px;
    background-color: ${currentTheme.primaryContainerOpacity10};
    border-radius:5px;
    display: flex;
  `

  const LoadingBox3 = styled.div`
    width: 300px;
    height: 20px;
    margin: 10px;
    background-color: ${currentTheme.primaryContainerOpacity10};
    border-radius:5px;
    display: flex;
  `

  return (
    <MembershipCardWrapper>
      <LoadingBox/>
      <InfoContainer2>
      <LoadingBox2/>
      <LoadingBox3/>
      <LoadingBox2/>
      <LoadingBox3/>
      </InfoContainer2>
    </MembershipCardWrapper>
  )
}
