import styled from '@emotion/styled'
import { CertificationCard } from '@/components/molecure/Profile/Certifications/CertificationCard'
import { useCertificationSBT } from '@/hooks/useCertificationSBT'
import { useVESSTheme } from '@/hooks/useVESSTheme'

type Props = {
  did?: string
}
export default function CertificationsContainer({ did }: Props) {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { heldCertificationSubjects, isInitialLoading } = useCertificationSBT(did)

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
  const ItemHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 16px;
  `
  const HeaderText = styled.p`
    color: ${currentTheme.onBackground};
    ${getBasicFont(currentTypo.title.large)};
  `

  if (!(!isInitialLoading && heldCertificationSubjects && heldCertificationSubjects?.length > 0)) {
    return <></>
  }
  return (
    <>
      <ItemHeader>
        <HeaderText>Certifications</HeaderText>
      </ItemHeader>
      <Container>
        {heldCertificationSubjects &&
          heldCertificationSubjects.map((item) => {
            return <CertificationCard key={`${item.id}`} item={item} />
          })}
      </Container>
    </>
  )
}
