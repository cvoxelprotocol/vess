import { css } from '@emotion/react'
import styled from '@emotion/styled'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { QRCode } from '@/components/sticker/QRCode'
import type { ClaimValue, DemoResult } from '@/lib/restaurant/types'

export const SHOP_NAME = '麺処 宇田川'

export const color = {
  ink: '#231f1c',
  sub: '#6b6159',
  paper: '#fff9ef',
  card: '#ffffff',
  line: 'rgba(43, 38, 34, 0.12)',
  accent: '#e2711d',
  indigo: '#1f1b18',
  ok: '#2e7d4f',
}

export const Shell: FC<{ children: ReactNode; back?: boolean }> = ({ children, back = true }) => (
  <Page>
    <Header>
      <HeaderInner>
        <Logo href='/restaurant'>
          <LogoMark>麺</LogoMark>
          {SHOP_NAME}
        </Logo>
        <DemoBadge>DEMO</DemoBadge>
      </HeaderInner>
    </Header>
    <Main>
      {back && <BackLink href='/restaurant'>← トップへ戻る</BackLink>}
      {children}
    </Main>
    <Footer>このサイトは VESS Wallet のデモ用に作成した架空の店舗です。</Footer>
  </Page>
)

// ウォレットへの提示依頼（同一端末はボタン、PC は QR）
export const PresentPanel: FC<{ uri: string | null; status: string; requested: string[] }> = ({
  uri,
  status,
  requested,
}) => (
  <Card>
    <CardTitle>VESS Login で提示してください</CardTitle>
    <Small>お店が受け取る項目</Small>
    <Chips>
      {requested.map((r) => (
        <Chip key={r}>{r}</Chip>
      ))}
    </Chips>
    {uri ? (
      <>
        <OpenButton href={uri}>VESS Login</OpenButton>
        <Small>パソコンで見ている場合は、スマートフォンでこの QR を読み取って VESS Login してください。</Small>
        <QrBox>
          <QRCode url={uri} width={220} />
        </QrBox>
        <UriBox>{uri}</UriBox>
      </>
    ) : (
      <Small>提示内容を確認しています…</Small>
    )}
    <StatusLine>検証待ち… {status && `(${status})`}</StatusLine>
  </Card>
)

const fmt = (v: ClaimValue) => {
  if (v === null || v === undefined) return '（開示なし）'
  if (typeof v === 'boolean') return v ? 'はい' : 'いいえ'
  return String(v)
}

export const ResultView: FC<{ result: DemoResult; labels: Record<string, string>; onRetry: () => void }> = ({
  result,
  labels,
  onRetry,
}) => (
  <>
    <Card>
      <ResultTitle ok={result.ok}>{result.title}</ResultTitle>
      <Body>{result.message}</Body>
      {result.entryNumber && <EntryNo>応募番号 {result.entryNumber}</EntryNo>}
      {result.coupon && (
        <Coupon>
          <CouponLabel>BIRTHDAY COUPON</CouponLabel>
          <CouponName>{result.coupon.name}</CouponName>
          <CouponMeta>
            コード {result.coupon.code} ／ {result.coupon.validUntil}
          </CouponMeta>
        </Coupon>
      )}
    </Card>
    <Panels>
      <Panel>
        <PanelTitle>受け取った値</PanelTitle>
        <PanelNote>処理に使い、保存しません</PanelNote>
        <Dl>
          {Object.entries(result.received).map(([k, v]) => (
            <Row key={k}>
              <Dt>{labels[k] ?? k}</Dt>
              <Dd>{fmt(v)}</Dd>
            </Row>
          ))}
        </Dl>
      </Panel>
      <Panel stored>
        <PanelTitle>お店が保存した値</PanelTitle>
        <PanelNote>個人を特定できる値は残りません</PanelNote>
        {result.stored ? (
          <Dl>
            {Object.entries(result.stored).map(([k, v]) => (
              <Row key={k}>
                <Dt>{k}</Dt>
                <Dd>{v}</Dd>
              </Row>
            ))}
          </Dl>
        ) : (
          <Body>なし</Body>
        )}
      </Panel>
    </Panels>
    <Actions>
      <SecondaryButton onClick={onRetry}>もう一度試す</SecondaryButton>
      <Secondary href='/restaurant/dashboard'>集計ダッシュボードを見る</Secondary>
    </Actions>
  </>
)

const Page = styled.div`
  min-height: 100vh;
  background: ${color.paper};
  color: ${color.ink};
  display: flex;
  flex-direction: column;
`
const Header = styled.header`
  background: ${color.indigo};
  color: #fff;
`
const HeaderInner = styled.div`
  max-width: 720px;
  margin: 0 auto;
  padding: 14px 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: #fff;
  font-weight: 800;
  font-size: 18px;
  text-decoration: none;
  letter-spacing: 0.05em;
`
const LogoMark = styled.span`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  background: ${color.accent};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
`
const DemoBadge = styled.span`
  font-size: 11px;
  font-weight: 700;
  border: 1px solid rgba(255, 255, 255, 0.6);
  border-radius: 999px;
  padding: 2px 8px;
`
const Main = styled.main`
  width: 100%;
  max-width: 720px;
  margin: 0 auto;
  padding: 20px 16px 40px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  flex: 1;
`
const Footer = styled.footer`
  text-align: center;
  font-size: 11px;
  color: ${color.sub};
  padding: 16px;
`
const BackLink = styled(Link)`
  align-self: flex-start;
  font-size: 13px;
  color: ${color.indigo};
  text-decoration: none;
  font-weight: 600;
`
export const Title = styled.h1`
  font-size: 24px;
  margin: 0;
  line-height: 1.4;
`
export const Lead = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: ${color.sub};
  margin: 0;
`
export const Card = styled.section`
  background: ${color.card};
  border: 1px solid ${color.line};
  border-radius: 14px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
export const CardTitle = styled.h2`
  font-size: 17px;
  margin: 0;
`
export const Body = styled.p`
  font-size: 14px;
  line-height: 1.8;
  margin: 0;
`
export const Small = styled.p`
  font-size: 12px;
  line-height: 1.7;
  color: ${color.sub};
  margin: 0;
`
export const Primary = styled.button`
  padding: 15px;
  border-radius: 10px;
  border: none;
  background: ${color.accent};
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  cursor: pointer;
`
const secondaryCss = css`
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  border: 1px solid ${color.indigo};
  background: transparent;
  color: ${color.indigo};
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
`
export const Secondary = styled(Link)`
  ${secondaryCss}
`
const SecondaryButton = styled.button`
  ${secondaryCss}
`
export const Err = styled.div`
  color: ${color.accent};
  font-size: 13px;
`
const Chips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`
const Chip = styled.span`
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: rgba(38, 55, 90, 0.08);
  color: ${color.indigo};
  font-weight: 600;
`
const OpenButton = styled.a`
  margin-top: 4px;
  padding: 15px;
  border-radius: 10px;
  background: ${color.indigo};
  color: #fff;
  font-weight: 700;
  font-size: 16px;
  text-align: center;
  text-decoration: none;
`
const QrBox = styled.div`
  align-self: center;
  padding: 8px;
  background: #fff;
  border-radius: 12px;
  border: 1px solid ${color.line};
`
const UriBox = styled.code`
  word-break: break-all;
  font-size: 10px;
  color: ${color.sub};
  background: rgba(0, 0, 0, 0.04);
  padding: 8px;
  border-radius: 8px;
`
const StatusLine = styled.div`
  font-size: 12px;
  color: ${color.sub};
  text-align: center;
`
const ResultTitle = styled.h2<{ ok: boolean }>`
  font-size: 20px;
  margin: 0;
  color: ${(p) => (p.ok ? color.ok : color.ink)};
`
const EntryNo = styled.div`
  font-family: monospace;
  font-size: 16px;
  font-weight: 700;
  padding: 10px;
  border-radius: 8px;
  background: rgba(46, 125, 79, 0.08);
  text-align: center;
`
const Coupon = styled.div`
  border: 2px dashed ${color.accent};
  border-radius: 12px;
  padding: 16px;
  text-align: center;
  background: #fff3e3;
`
const CouponLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.2em;
  color: ${color.accent};
  font-weight: 800;
`
const CouponName = styled.div`
  font-size: 22px;
  font-weight: 800;
  margin: 6px 0;
`
const CouponMeta = styled.div`
  font-size: 12px;
  color: ${color.sub};
  font-family: monospace;
`
const Panels = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`
const Panel = styled.div<{ stored?: boolean }>`
  background: ${(p) => (p.stored ? '#f1f6f2' : color.card)};
  border: 1px solid ${(p) => (p.stored ? 'rgba(46, 125, 79, 0.3)' : color.line)};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`
const PanelTitle = styled.h3`
  font-size: 15px;
  margin: 0;
`
const PanelNote = styled.div`
  font-size: 11px;
  color: ${color.sub};
`
const Dl = styled.dl`
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
`
const Row = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 13px;
  border-bottom: 1px dotted ${color.line};
  padding-bottom: 6px;
`
const Dt = styled.dt`
  color: ${color.sub};
  flex-shrink: 0;
`
const Dd = styled.dd`
  margin: 0;
  font-weight: 600;
  text-align: right;
  word-break: break-all;
`
const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`
