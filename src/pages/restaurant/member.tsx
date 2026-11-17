import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Meta } from '@/components/layouts/Meta'
import {
  Card,
  CardTitle,
  Err,
  Lead,
  LoginButton,
  PageHero,
  PresentPanel,
  SHOP_NAME,
  Shell,
  Small,
  SplitPanels,
  StepBar,
  color,
  font,
} from '@/components/restaurant/ui'
import { useVpFlow } from '@/components/restaurant/useVpFlow'

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat('ja-JP', {
    timeZone: 'Asia/Tokyo',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))

const MemberPage: NextPage = () => {
  const { phase, authReqUri, status, result, error, start, reset } = useVpFlow('login')
  const step = phase === 'idle' ? 0 : phase === 'done' ? 2 : 1

  return (
    <>
      <Meta pageTitle={`会員ページ - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <PageHero
          kicker='MEMBER'
          title='会員ページ'
          text='ID とパスワードはありません。VESS Wallet の会員証を提示してログインします。'
        />

        <StepBar current={step} labels={['ログイン', '会員証の提示', '会員ページ']} />

        {phase === 'idle' && (
          <>
            <Card>
              <CardTitle>会員証でログイン</CardTitle>
              <Lead>
                お店が受け取るのは会員番号だけです。会員証にはお店の署名が入っているため、番号が書き換えられていないことと、このお店が発行したものであることを確かめられます。
              </Lead>
            </Card>
            <LoginButton onClick={start}>VESS Login でログインする</LoginButton>
            <Small style={{ textAlign: 'center' }}>
              会員証をお持ちでない方は <Link href='/restaurant/register'>会員登録</Link> へ
            </Small>
            {error && <Err>{error}</Err>}
          </>
        )}

        {phase === 'present' && (
          <>
            <PresentPanel uri={authReqUri} status={status} requested={['会員番号']} />
            {error && <Err>{error}</Err>}
          </>
        )}

        {phase === 'processing' && (
          <Card>
            <Small>会員証を確認しています…</Small>
          </Card>
        )}

        {phase === 'done' && result && (
          <>
            <MemberCard>
              <MemberCardHead>
                <span>{SHOP_NAME}</span>
                <span>MEMBER</span>
              </MemberCardHead>
              <MemberCardLabel>会員番号</MemberCardLabel>
              <MemberCardNo>{result.memberNo}</MemberCardNo>
              <MemberCardMeta>
                {result.joinedAt ? `${fmtTime(result.joinedAt)} 登録` : 'このデモの記録より前に登録された会員'}
              </MemberCardMeta>
            </MemberCard>
            <Card>
              <CardTitle>ご利用の履歴</CardTitle>
              <Small>会員番号に紐づけてお店が記録している内容です。</Small>
              <History>
                {result.history.map((h, i) => (
                  <li key={`${h.at}-${i}`}>
                    <time>{fmtTime(h.at)}</time>
                    {h.label}
                  </li>
                ))}
              </History>
              <Links>
                <Link href='/restaurant/campaign'>10周年キャンペーンに応募する →</Link>
                <Link href='/restaurant/birthday'>誕生日クーポンを受け取る →</Link>
              </Links>
            </Card>
            <SplitPanels
              left={{
                title: '受け取った値',
                note: '会員証から提示された値',
                rows: { 会員番号: result.memberNo },
              }}
              right={{ title: 'お店が保存している値', note: '氏名・生年月日・住所は持っていません', rows: result.stored }}
            />
            <Small style={{ textAlign: 'center' }}>
              <a href='#' onClick={(e) => (e.preventDefault(), reset())}>
                ログアウト
              </a>
            </Small>
          </>
        )}
      </Shell>
    </>
  )
}

const MemberCard = styled.div`
  background: linear-gradient(135deg, #2b1a12, #4a2b1a);
  color: #fff;
  border-radius: 10px;
  padding: 20px 22px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  box-shadow: 0 6px 18px rgba(31, 25, 21, 0.25);
`
const MemberCardHead = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: ${font.serif}, serif;
  font-size: 14px;
  margin-bottom: 16px;
  span:last-of-type {
    font-family: ${font.latin}, sans-serif;
    letter-spacing: 0.2em;
    color: ${color.accent};
  }
`
const MemberCardLabel = styled.div`
  font-size: 11px;
  opacity: 0.7;
`
const MemberCardNo = styled.div`
  font-family: ${font.latin}, sans-serif;
  font-size: 30px;
  letter-spacing: 0.08em;
`
const MemberCardMeta = styled.div`
  font-size: 12px;
  opacity: 0.7;
`
const History = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  li {
    display: grid;
    grid-template-columns: 110px 1fr;
    gap: 12px;
    padding: 10px 0;
    border-top: 1px solid ${color.line};
    font-size: 13px;
  }
  time {
    color: ${color.sub};
    font-variant-numeric: tabular-nums;
  }
`
const Links = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14px;
  font-weight: 700;
  a {
    color: ${color.accentDeep};
  }
`

export default MemberPage
