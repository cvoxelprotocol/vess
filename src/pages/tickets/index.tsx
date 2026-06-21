import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Meta } from '@/components/layouts/Meta'

const TicketHome: NextPage = () => {
  return (
    <>
      <Meta pageTitle='Ticket Provider 不正転売対策デモ' />
      <Wrapper>
        <Brand>Ticket Provider</Brand>
        <Title>不正転売対策デモ</Title>
        <Lead>
          会員VCを発行し、それを提示してチケットを購入、チケットVCを受け取り、入場時に2つのVCで本人確認する一気通貫の流れを体験できます。
        </Lead>
        <Steps>
          <StepCard href='/tickets/register'>
            <Num>1</Num>
            <StepTitle>会員VC取得</StepTitle>
            <StepDesc>本人確認（デモ用モック）→ 本人確認済みVCをウォレットに発行</StepDesc>
          </StepCard>
          <StepCard href='/tickets/purchase'>
            <Num>2</Num>
            <StepTitle>チケット購入</StepTitle>
            <StepDesc>会員VPを提示 → チケットVCを発行</StepDesc>
          </StepCard>
          <StepCardStatic>
            <Num>3</Num>
            <StepTitle>入場</StepTitle>
            <StepDesc>会員VC＋チケットVCの二重VPを会場ゲートで検証（このステップはVESSアプリで実施）</StepDesc>
          </StepCardStatic>
        </Steps>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.main`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: var(--kai-size-sys-space-lg, 24px);
  display: flex;
  flex-direction: column;
  gap: 14px;
`
const Brand = styled.div`
  font-weight: 800;
  font-size: 20px;
  color: #2d5bd6;
  letter-spacing: 0.04em;
`
const Title = styled.h1`
  font-size: 28px;
  font-weight: 800;
  margin: 0;
`
const Lead = styled.p`
  font-size: 14px;
  line-height: 1.7;
  opacity: 0.8;
  margin: 0 0 8px;
`
const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const cardCss = `
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid rgba(0,0,0,0.1);
  text-decoration: none;
  color: inherit;
`
const StepCard = styled(Link)`
  ${cardCss}
  &:hover { background: rgba(45,91,214,0.08); border-color: #2d5bd6; }
`
const StepCardStatic = styled.div`
  ${cardCss}
  opacity: 0.85;
`
const Num = styled.div`
  width: 34px;
  height: 34px;
  flex: 0 0 34px;
  border-radius: 999px;
  background: #2d5bd6;
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`
const StepTitle = styled.div`
  font-weight: 700;
  font-size: 16px;
`
const StepDesc = styled.div`
  font-size: 12px;
  opacity: 0.7;
`

export default TicketHome
