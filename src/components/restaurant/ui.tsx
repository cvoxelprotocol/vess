import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { Noto_Sans_JP, Oswald } from 'next/font/google'
import Link from 'next/link'
import { FC, ReactNode } from 'react'
import { QRCode } from '@/components/sticker/QRCode'
import type { ClaimValue, DemoResult } from '@/lib/restaurant/types'

export const SHOP_NAME = '麺処 宇田川'

const body = Noto_Sans_JP({ weight: ['400', '500', '700', '900'], subsets: ['latin'], display: 'swap', preload: false })
const latin = Oswald({ weight: ['500', '600'], subsets: ['latin'], display: 'swap' })

export const font = {
  display: body.style.fontFamily,
  body: body.style.fontFamily,
  latin: latin.style.fontFamily,
}

export const color = {
  ink: '#1f1915',
  sub: '#6b6159',
  paper: '#faf6ef',
  kraft: '#f1e8d9',
  card: '#ffffff',
  line: 'rgba(43, 38, 34, 0.12)',
  accent: '#e2711d',
  accentDeep: '#b9560f',
  indigo: '#1f1b18',
  night: '#15110e',
  red: '#b8322a',
  ok: '#2e7d4f',
}

const NAV = [
  { href: '/restaurant#kodawari', label: 'こだわり' },
  { href: '/restaurant#menu', label: 'お品書き' },
  { href: '/restaurant#news', label: 'キャンペーン' },
  { href: '/restaurant#shop', label: '店舗情報' },
]

export const Shell: FC<{ children: ReactNode; back?: boolean; bare?: boolean }> = ({
  children,
  back = true,
  bare = false,
}) => (
  <Page>
    <DemoStrip>
      <DemoTag>DEMO</DemoTag>VESS のデモ用に作成した架空の店舗サイトです
    </DemoStrip>
    <Header>
      <HeaderInner>
        <Logo href='/restaurant'>
          <LogoMark>麺</LogoMark>
          <LogoText>
            <LogoSub>濃厚豚骨醤油</LogoSub>
            {SHOP_NAME}
          </LogoText>
        </Logo>
        <Nav>
          {NAV.map((n) => (
            <NavLink key={n.href} href={n.href}>
              {n.label}
            </NavLink>
          ))}
        </Nav>
      </HeaderInner>
    </Header>
    {bare ? (
      children
    ) : (
      <Main>
        {back && <BackLink href='/restaurant'>← トップへ戻る</BackLink>}
        {children}
      </Main>
    )}
    <Footer>
      <FooterInner>
        <FooterBrand>
          <Logo href='/restaurant'>
            <LogoMark>麺</LogoMark>
            <LogoText>{SHOP_NAME}</LogoText>
          </Logo>
          <FooterText>
            東京都渋谷区宇田川町 0-0-0 宇田川ビル1F
            <br />
            11:00〜15:00 ／ 17:30〜22:00（火曜定休）
          </FooterText>
        </FooterBrand>
        <FooterLinks>
          <FooterLink href='/restaurant#menu'>お品書き</FooterLink>
          <FooterLink href='/restaurant/campaign'>10周年キャンペーン</FooterLink>
          <FooterLink href='/restaurant/birthday'>誕生日クーポン</FooterLink>
          <FooterLink href='/restaurant#privacy'>個人情報の取り扱い</FooterLink>
          <FooterLink href='/restaurant/dashboard'>お店の方へ（集計）</FooterLink>
        </FooterLinks>
      </FooterInner>
      <FooterNote>
        このサイトは VESS Wallet のデモ用に作成した架空の店舗です。店名・住所・メニュー・キャンペーンはすべて架空のものです。
      </FooterNote>
    </Footer>
  </Page>
)

// 下層ページの見出し帯
export const PageHero: FC<{ kicker: string; title: string; text?: string; tone?: 'night' | 'gold' | 'orange' }> = ({
  kicker,
  title,
  text,
  tone = 'night',
}) => (
  <HeroBand tone={tone}>
    <HeroKicker>{kicker}</HeroKicker>
    <HeroTitle>{title}</HeroTitle>
    {text && <HeroText>{text}</HeroText>}
  </HeroBand>
)

export const StepBar: FC<{ current: 0 | 1 | 2 }> = ({ current }) => (
  <Steps>
    {['内容の確認', '提示', '完了'].map((s, i) => (
      <StepItem key={s} active={i <= current}>
        <StepDot active={i <= current}>{i + 1}</StepDot>
        {s}
      </StepItem>
    ))}
  </Steps>
)

const VessIcon: FC = () => (
  // eslint-disable-next-line @next/next/no-img-element
  <img src='/VESS_app_icon.png' alt='' width={22} height={22} style={{ borderRadius: 6 }} />
)

// Google のログインボタンに倣った VESS Login ボタン
export const LoginButton: FC<{ children: ReactNode; onClick?: () => void; href?: string }> = ({
  children,
  onClick,
  href,
}) =>
  href ? (
    <LoginAnchor href={href}>
      <VessIcon />
      {children}
    </LoginAnchor>
  ) : (
    <LoginBtn type='button' onClick={onClick}>
      <VessIcon />
      {children}
    </LoginBtn>
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
        <LoginButton href={uri}>VESS Login</LoginButton>
        <QrWrap>
          <QrBox>
            <QRCode url={uri} width={200} />
          </QrBox>
          <Small>パソコンで見ている場合は、スマートフォンでこの QR を読み取って VESS Login してください。</Small>
        </QrWrap>
      </>
    ) : (
      <Small>提示内容を準備しています…</Small>
    )}
    <StatusLine>
      <Pulse />
      VESS Wallet からの提示を待っています {status && `(${status})`}
    </StatusLine>
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
      {result.entryNumber && (
        <EntryNo>
          <EntryLabel>応募番号</EntryLabel>
          {result.entryNumber}
        </EntryNo>
      )}
      {result.coupon && (
        <Coupon>
          <CouponLeft>
            <CouponLabel>BIRTHDAY COUPON</CouponLabel>
            <CouponName>{result.coupon.name}</CouponName>
            <CouponMeta>{result.coupon.validUntil}</CouponMeta>
          </CouponLeft>
          <CouponRight>
            <CouponCodeLabel>CODE</CouponCodeLabel>
            <CouponCode>{result.coupon.code}</CouponCode>
          </CouponRight>
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
  font-family: ${font.body}, sans-serif;
  scroll-behavior: smooth;
  a {
    -webkit-tap-highlight-color: transparent;
  }
`
const DemoStrip = styled.div`
  background: ${color.night};
  color: rgba(255, 255, 255, 0.72);
  font-size: 11px;
  text-align: center;
  padding: 6px 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
const DemoTag = styled.span`
  font-weight: 700;
  letter-spacing: 0.1em;
  color: ${color.night};
  background: ${color.accent};
  border-radius: 3px;
  padding: 1px 6px;
  font-size: 10px;
`
const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(250, 246, 239, 0.92);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid ${color.line};
`
const HeaderInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  @media (max-width: 720px) {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
    padding: 10px 16px 6px;
  }
`
const Logo = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  color: inherit;
  text-decoration: none;
`
const LogoMark = styled.span`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: ${color.red};
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 20px;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.25);
`
const LogoText = styled.span`
  display: flex;
  flex-direction: column;
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 20px;
  letter-spacing: 0.12em;
  line-height: 1.2;
`
const LogoSub = styled.span`
  font-family: ${font.body}, sans-serif;
  font-size: 10px;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: ${color.sub};
`
const Nav = styled.nav`
  display: flex;
  gap: 4px;
  @media (max-width: 720px) {
    overflow-x: auto;
    margin: 0 -16px;
    padding: 0 12px;
  }
`
const NavLink = styled(Link)`
  white-space: nowrap;
  font-size: 13px;
  font-weight: 500;
  color: ${color.ink};
  text-decoration: none;
  padding: 8px 2px;
  margin: 0 10px;
  border-bottom: 2px solid transparent;
  transition: border-color 0.15s;
  &:hover {
    border-bottom-color: ${color.accent};
  }
`
const Main = styled.main`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 20px 16px 56px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  flex: 1;
`
const Footer = styled.footer`
  background: ${color.night};
  color: rgba(255, 255, 255, 0.85);
  margin-top: auto;
`
const FooterInner = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 36px 20px 20px;
  display: flex;
  justify-content: space-between;
  gap: 24px;
  flex-wrap: wrap;
`
const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const FooterText = styled.p`
  margin: 0;
  font-size: 12px;
  line-height: 1.9;
  color: rgba(255, 255, 255, 0.65);
`
const FooterLinks = styled.div`
  display: grid;
  grid-template-columns: repeat(2, auto);
  gap: 8px 28px;
  align-content: start;
`
const FooterLink = styled(Link)`
  color: rgba(255, 255, 255, 0.85);
  font-size: 13px;
  text-decoration: none;
  &:hover {
    color: ${color.accent};
  }
`
const FooterNote = styled.div`
  max-width: 1080px;
  margin: 0 auto;
  padding: 14px 20px 28px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 11px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.5);
`
const BackLink = styled(Link)`
  align-self: flex-start;
  font-size: 13px;
  color: ${color.sub};
  text-decoration: none;
  font-weight: 500;
`
const HeroBand = styled.div<{ tone: 'night' | 'gold' | 'orange' }>`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  padding: 30px 24px;
  color: ${(p) => (p.tone === 'gold' ? '#3b2a00' : '#fff')};
  background: ${(p) =>
    p.tone === 'gold'
      ? 'linear-gradient(135deg, #ffd66b, #f4a93a)'
      : p.tone === 'orange'
        ? `linear-gradient(135deg, ${color.accent}, #9d420a)`
        : `radial-gradient(circle at 80% 20%, #4a2a12, ${color.night} 60%)`};
  &::after {
    content: '';
    position: absolute;
    right: -40px;
    bottom: -60px;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    border: 18px solid rgba(255, 255, 255, 0.12);
  }
`
const HeroKicker = styled.div`
  font-family: ${font.latin}, ${font.body}, sans-serif;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.2em;
  opacity: 0.85;
`
const HeroTitle = styled.h1`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 30px;
  line-height: 1.35;
  margin: 8px 0 0;
  letter-spacing: 0.04em;
  @media (max-width: 560px) {
    font-size: 25px;
  }
`
const HeroText = styled.p`
  font-size: 14px;
  line-height: 1.8;
  margin: 10px 0 0;
  opacity: 0.9;
  max-width: 520px;
`
const Steps = styled.ol`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 6px;
`
const StepItem = styled.li<{ active: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 700;
  color: ${(p) => (p.active ? color.ink : color.sub)};
  padding-bottom: 8px;
  border-bottom: 3px solid ${(p) => (p.active ? color.accent : color.line)};
  @media (max-width: 420px) {
    font-size: 11px;
  }
`
const StepDot = styled.span<{ active: boolean }>`
  flex: 0 0 20px;
  height: 20px;
  border-radius: 50%;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  background: ${(p) => (p.active ? color.accent : '#c9bfb3')};
`
export const Title = styled.h1`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 24px;
  margin: 0;
  line-height: 1.4;
`
export const Lead = styled.p`
  font-size: 14px;
  line-height: 1.9;
  color: ${color.sub};
  margin: 0;
`
export const Card = styled.section`
  background: ${color.card};
  border: 1px solid ${color.line};
  border-radius: 6px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  box-shadow: 0 1px 2px rgba(31, 25, 21, 0.04);
`
export const CardTitle = styled.h2`
  font-size: 17px;
  margin: 0;
`
export const Body = styled.p`
  font-size: 14px;
  line-height: 1.85;
  margin: 0;
`
export const Small = styled.p`
  font-size: 12px;
  line-height: 1.75;
  color: ${color.sub};
  margin: 0;
`
// 角の立った矩形ボタン。右端の矢印が hover で動く
export const actionCss = css`
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  padding: 16px 20px;
  border-radius: 2px;
  font-family: inherit;
  font-weight: 700;
  font-size: 14px;
  letter-spacing: 0.04em;
  text-decoration: none;
  cursor: pointer;
  &::after {
    content: '→';
    font-family: ${font.latin}, sans-serif;
    font-size: 16px;
    transition: transform 0.2s;
  }
  &:hover::after {
    transform: translateX(4px);
  }
`
export const Primary = styled.button`
  ${actionCss}
  border: none;
  background: ${color.accent};
  color: #fff;
`
const loginCss = css`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: 100%;
  min-height: 54px;
  padding: 12px 18px;
  border-radius: 4px;
  border: 1px solid #cfc8bf;
  background: #fff;
  color: #1f1f1f;
  font-family: inherit;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    border-color 0.15s;
  &:hover {
    border-color: #a9a097;
    box-shadow: 0 2px 6px rgba(31, 25, 21, 0.12);
  }
`
const LoginBtn = styled.button`
  ${loginCss}
`
const LoginAnchor = styled.a`
  ${loginCss}
`
const secondaryCss = css`
  ${actionCss}
  flex: 1;
  border: 1px solid ${color.indigo};
  background: transparent;
  color: ${color.indigo};
`
export const Secondary = styled(Link)`
  ${secondaryCss}
`
const SecondaryButton = styled.button`
  ${secondaryCss}
`
export const Err = styled.div`
  color: ${color.red};
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
  border-radius: 2px;
  border: 1px solid ${color.line};
  background: ${color.kraft};
  color: ${color.ink};
  font-weight: 700;
`
const QrWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  padding-top: 4px;
  @media (max-width: 560px) {
    flex-direction: column;
    text-align: center;
  }
`
const QrBox = styled.div`
  flex-shrink: 0;
  padding: 6px;
  background: #fff;
  border-radius: 6px;
  border: 1px solid ${color.line};
`
const StatusLine = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  color: ${color.sub};
`
const Pulse = styled.span`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${color.accent};
  animation: pulse 1.4s ease-in-out infinite;
  @keyframes pulse {
    50% {
      opacity: 0.25;
    }
  }
`
const ResultTitle = styled.h2<{ ok: boolean }>`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 22px;
  margin: 0;
  color: ${(p) => (p.ok ? color.ok : color.ink)};
`
const EntryNo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
  font-family: monospace;
  font-size: 20px;
  font-weight: 700;
  padding: 12px;
  border-radius: 6px;
  background: rgba(46, 125, 79, 0.08);
`
const EntryLabel = styled.span`
  font-family: ${font.body}, sans-serif;
  font-size: 11px;
  color: ${color.sub};
`
const Coupon = styled.div`
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  background: linear-gradient(135deg, ${color.accent}, ${color.accentDeep});
  color: #fff;
`
const CouponLeft = styled.div`
  flex: 1;
  padding: 18px;
  border-right: 2px dashed rgba(255, 255, 255, 0.5);
`
const CouponRight = styled.div`
  flex: 0 0 110px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.12);
  padding: 12px;
`
const CouponLabel = styled.div`
  font-size: 11px;
  letter-spacing: 0.2em;
  font-weight: 700;
  opacity: 0.85;
`
const CouponName = styled.div`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 22px;
  margin: 6px 0;
`
const CouponMeta = styled.div`
  font-size: 12px;
  opacity: 0.85;
`
const CouponCodeLabel = styled.div`
  font-size: 10px;
  letter-spacing: 0.2em;
  opacity: 0.8;
`
const CouponCode = styled.div`
  font-family: monospace;
  font-size: 15px;
  font-weight: 700;
  word-break: break-all;
  text-align: center;
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
  border-radius: 6px;
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
  font-weight: 700;
  text-align: right;
  word-break: break-all;
`
const Actions = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`
