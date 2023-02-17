import styled from '@emotion/styled'
import { FC, forwardRef, useMemo, useRef } from 'react'
import { VESSModal, VESSModalContainer } from '../VESSModal'
import { QRCode } from './QRCode'
import { Button } from '@/components/atom/Buttons/Button'
import { Chip } from '@/components/atom/Chips/Chip'
import { useDIDAccount } from '@/hooks/useDIDAccount'
import { useVESSWidgetModal } from '@/hooks/useVESSModal'
import { useVESSTheme } from '@/hooks/useVESSTheme'
import { shortenStr } from '@/utils/objectUtil'
import { getCurrentDomain } from '@/utils/url'

export const ProfileQRModal: FC = () => {
  const { currentTheme, currentTypo, getBasicFont } = useVESSTheme()
  const { showQRModal, setShowQRModal } = useVESSWidgetModal()
  const { did } = useDIDAccount()

  const Container = styled.div`
    padding: 32px;
    border-radius: 32px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    justify-content: center;
    align-items: center;
    background: ${currentTheme.surface3};
  `
  const QRContent = styled.div`
    display: flex;
    column-gap: 8px;
    justify-content: center;
    align-items: center;
  `
  const Title = styled.p`
    color: ${currentTheme.onSurfaceVariant};
    ${getBasicFont(currentTypo.headLine.small)};
    @media (max-width: 599px) {
      ${getBasicFont(currentTypo.title.large)};
    }
  `

  const myLink = useMemo(() => {
    if (!did) return ''
    return `${getCurrentDomain()}/${did}`
  }, [did])

  const qrcodeRef = useRef<HTMLDivElement>(null)

  const QRCodeContent = forwardRef<HTMLDivElement, { url: string }>((props, ref) => {
    return (
      <div ref={ref}>
        <QRCode url={props.url} />
      </div>
    )
  })
  QRCodeContent.displayName = 'QRCodeContent'

  return (
    <VESSModalContainer open={showQRModal} onOpenChange={setShowQRModal}>
      <VESSModal>
        <Container>
          <Title>Your Profile</Title>
          <QRContent>
            <QRCodeContent url={myLink} ref={qrcodeRef} />
          </QRContent>
          <Chip
            text={shortenStr(myLink, 50)}
            solo
            size='S'
            mainColor={currentTheme.outline}
            textColor={currentTheme.outline}
          />
          <Button
            variant='outlined'
            text='Close'
            mainColor={currentTheme.primary}
            textColor={currentTheme.primary}
            type='button'
            onClick={() => setShowQRModal(false)}
          />
        </Container>
      </VESSModal>
    </VESSModalContainer>
  )
}
