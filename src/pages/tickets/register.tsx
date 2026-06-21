import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Meta } from '@/components/layouts/Meta'

// 鍵直結デモ：会員VCの取得はVESSアプリ内で本人確認 → この端末の鍵に直接発行する。
// 譲渡できる受け取りQR（bearerオファー）はWebに出さない。
const TicketRegister: NextPage = () => {
  return (
    <>
      <Meta pageTitle='会員VC取得 - Ticket Provider デモ' />
      <Wrapper>
        <BackLink href='/tickets'>← 一覧へ戻る</BackLink>
        <Brand>Ticket Provider</Brand>
        <Title>会員VCを取得</Title>

        <Desc>
          会員VC（本人確認済みVC）の取得は <b>VESSアプリ内で完結</b> します。アプリで本人確認を行い、<b>その端末（鍵）に直接発行</b> されます。譲渡できる受け取りQRは発行しません（鍵直結）。
        </Desc>

        <Steps>
          <Step>
            <Num>1</Num>
            <StepBody>
              <StepTitle>VESSアプリを開く</StepTitle>
              <StepDesc>会員VCを持たせたい端末で開きます。</StepDesc>
            </StepBody>
          </Step>
          <Step>
            <Num>2</Num>
            <StepBody>
              <StepTitle>設定 →「会員VC取得（本人確認）」</StepTitle>
              <StepDesc>
                画面下部の歯車（⚙️）アイコン＝「設定」→「会員VC取得（本人確認）」を開きます。
              </StepDesc>
            </StepBody>
          </Step>
          <Step>
            <Num>3</Num>
            <StepBody>
              <StepTitle>本人確認 → この端末に直接発行</StepTitle>
              <StepDesc>
                本人確認（デモ用モック）を行うと、本人確認済みVCがこの端末の鍵に直接保存されます。受け取りQRは出ません。
              </StepDesc>
            </StepBody>
          </Step>
        </Steps>

        <Why>
          <WhyTitle>なぜQRを出さないのか（鍵直結）</WhyTitle>
          <WhyText>
            受け取りQR（bearerオファー）は、コピーして他人に渡すと別の鍵で発行できてしまいます。アプリ内で本人確認した端末の鍵に直接発行することで、<b>渡せる引換券そのものを作らない</b>＝会員VCのコピー転売を防ぎます。
          </WhyText>
        </Why>

        <Secondary href='/tickets/purchase'>次へ：チケット購入</Secondary>
      </Wrapper>
    </>
  )
}

const BackLink = styled(Link)`
  align-self: flex-start;
  font-size: 13px;
  color: #2d5bd6;
  text-decoration: none;
  font-weight: 600;
  &:hover {
    text-decoration: underline;
  }
`
const Wrapper = styled.main`
  width: 100%;
  max-width: 560px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 14px;
`
const Brand = styled.div`
  font-weight: 800;
  color: #2d5bd6;
`
const Title = styled.h1`
  font-size: 24px;
  margin: 0;
`
const Desc = styled.p`
  font-size: 13px;
  opacity: 0.85;
  line-height: 1.8;
  margin: 0;
`
const Steps = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 4px;
`
const Step = styled.div`
  display: flex;
  gap: 12px;
  align-items: flex-start;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.1);
`
const Num = styled.div`
  flex: 0 0 30px;
  width: 30px;
  height: 30px;
  border-radius: 999px;
  background: #2d5bd6;
  color: #fff;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
`
const StepBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`
const StepTitle = styled.div`
  font-weight: 700;
  font-size: 15px;
`
const StepDesc = styled.div`
  font-size: 12.5px;
  opacity: 0.75;
  line-height: 1.7;
`
const Why = styled.div`
  background: #fff7e6;
  border: 1px solid #ffe0a3;
  border-radius: 12px;
  padding: 14px;
  margin-top: 4px;
`
const WhyTitle = styled.div`
  font-weight: 800;
  font-size: 13px;
  color: #8a5a00;
  margin-bottom: 4px;
`
const WhyText = styled.div`
  font-size: 12.5px;
  color: #6b4a00;
  line-height: 1.8;
`
const Secondary = styled.a`
  margin-top: 8px;
  color: #2d5bd6;
  font-weight: 700;
  text-decoration: none;
`

export default TicketRegister
