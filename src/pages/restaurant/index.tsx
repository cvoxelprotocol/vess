import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Meta } from '@/components/layouts/Meta'
import { BowlVariant, RamenBowl, ShopMap } from '@/components/restaurant/illustrations'
import { SHOP_NAME, Shell, actionCss, color, font } from '@/components/restaurant/ui'

const KODAWARI = [
  {
    no: '壱',
    title: '18時間炊き出す豚骨スープ',
    text: 'げんこつと背ガラを強火で炊き続け、骨の髄までうま味を引き出します。三年熟成の再仕込み醤油で、濃厚なのに後味はすっきり。',
  },
  {
    no: '弐',
    title: '毎朝打つ自家製ちぢれ麺',
    text: '国産小麦を店内で毎朝製麺。加水率を抑えた中太のちぢれ麺が、スープをしっかり持ち上げます。',
  },
  {
    no: '参',
    title: '低温で仕上げる炙りチャーシュー',
    text: '肩ロースを低温でじっくり火入れし、提供直前に炙って香ばしさをまとわせます。',
  },
]

const MENU: { name: string; price: string; text: string; variant: BowlVariant; badge?: string }[] = [
  {
    name: '特製豚骨醤油らーめん',
    price: '1,280',
    text: 'チャーシュー2枚・味玉・海苔3枚をのせた全部のせ。',
    variant: 'special',
    badge: '一番人気',
  },
  { name: '豚骨醤油らーめん', price: '980', text: 'まずはこの一杯から。店の味の基本です。', variant: 'classic' },
  {
    name: '味玉らーめん',
    price: '1,100',
    text: '半熟の味付け玉子を2個。お誕生月は1杯無料。',
    variant: 'ajitama',
    badge: '誕生月無料',
  },
  { name: '濃厚つけ麺', price: '1,150', text: '魚介を合わせた濃厚なつけ汁で。麺は並・中・大盛り同額。', variant: 'tsukemen' },
]

const SIDES = [
  ['炙りチャーシュー丼', '420'],
  ['羽根つき餃子（5個）', '380'],
  ['ライス', '150'],
  ['生ビール（中）', '550'],
]

const PRIVACY = [
  { t: 'お客さまが持つ', d: '氏名・生年月日・住所などは、お客さまのスマートフォンの VESS Wallet に保存されています。' },
  { t: '必要な項目だけ受け取る', d: 'お店は用途ごとに必要な項目だけを依頼し、お客さまは内容を確認してから提示します。' },
  { t: '使ったら集計だけ残す', d: '受け取った値は応募の判定やご連絡に使い、お店の記録には集計値だけを残します。' },
]

const RestaurantTop: NextPage = () => (
  <>
    <Meta pageTitle={`${SHOP_NAME}｜濃厚豚骨醤油らーめん（デモ）`} />
    <Shell bare>
      <Hero>
        <HeroInner>
          <HeroCopy>
            <HeroKicker>渋谷・宇田川町 濃厚豚骨醤油</HeroKicker>
            <HeroTitle>
              一杯に、
              <br />
              十八時間。
            </HeroTitle>
            <HeroText>
              じっくり炊き出した豚骨スープに、三年熟成の醤油を合わせた濃厚豚骨醤油。自家製の中太ちぢれ麺で、今日もお待ちしています。
            </HeroText>
            <HeroActions>
              <HeroPrimary href='#menu'>お品書きを見る</HeroPrimary>
              <HeroGhost href='/restaurant/campaign'>10周年キャンペーン</HeroGhost>
            </HeroActions>
          </HeroCopy>
          <HeroVisual>
            <RamenBowl variant='special' size={340} steam />
            <Stamp>
              開店
              <br />
              十周年
            </Stamp>
          </HeroVisual>
        </HeroInner>
      </Hero>

      <NewsBar id='news'>
        <NewsInner>
          <NewsLabel>お知らせ</NewsLabel>
          <NewsLink href='/restaurant/campaign'>
            <time>11.01</time>開店10周年記念「生ビール1年分」プレゼントキャンペーン開催中
          </NewsLink>
        </NewsInner>
      </NewsBar>

      <Section id='kodawari'>
        <SectionHead>
          <SectionEn>OUR CRAFT</SectionEn>
          <SectionTitle>宇田川のこだわり</SectionTitle>
        </SectionHead>
        <KodawariGrid>
          {KODAWARI.map((k) => (
            <KodawariCard key={k.no}>
              <KodawariNo>{k.no}</KodawariNo>
              <KodawariTitle>{k.title}</KodawariTitle>
              <SectionText>{k.text}</SectionText>
            </KodawariCard>
          ))}
        </KodawariGrid>
      </Section>

      <Section id='menu' tinted>
        <SectionHead>
          <SectionEn>MENU</SectionEn>
          <SectionTitle>お品書き</SectionTitle>
        </SectionHead>
        <MenuGrid>
          {MENU.map((m) => (
            <MenuCard key={m.name}>
              <MenuVisual>
                <RamenBowl variant={m.variant} size={150} />
                {m.badge && <MenuBadge>{m.badge}</MenuBadge>}
              </MenuVisual>
              <MenuName>{m.name}</MenuName>
              <MenuPrice>
                {m.price}
                <span>円（税込）</span>
              </MenuPrice>
              <MenuText>{m.text}</MenuText>
            </MenuCard>
          ))}
        </MenuGrid>
        <Sides>
          {SIDES.map(([n, p]) => (
            <SideRow key={n}>
              <span>{n}</span>
              <SideDots />
              <span>{p}円</span>
            </SideRow>
          ))}
        </Sides>
      </Section>

      <Section>
        <SectionHead>
          <SectionEn>CAMPAIGN</SectionEn>
          <SectionTitle>キャンペーン・特典</SectionTitle>
        </SectionHead>
        <PromoGrid>
          <Promo href='/restaurant/campaign' tone='gold'>
            <PromoKicker>開店10周年キャンペーン</PromoKicker>
            <PromoTitle>生ビール1年分が当たる！</PromoTitle>
            <PromoText>抽選で10名さま。応募フォームの入力なし、VESS Login だけで応募できます。</PromoText>
            <PromoGo>応募する</PromoGo>
          </Promo>
          <Promo href='/restaurant/birthday' tone='orange'>
            <PromoKicker>HAPPY BIRTHDAY</PromoKicker>
            <PromoTitle>お誕生月は味玉らーめん1杯無料</PromoTitle>
            <PromoText>提示するのは「誕生月」だけ。生年月日もお名前も、お店には渡りません。</PromoText>
            <PromoGo>クーポンを受け取る</PromoGo>
          </Promo>
        </PromoGrid>
      </Section>

      <Section id='privacy' dark>
        <SectionHead>
          <SectionEn>PRIVACY</SectionEn>
          <SectionTitle>個人情報を、お預かりしません</SectionTitle>
        </SectionHead>
        <SectionText light>
          {SHOP_NAME}は、お客さまの個人情報をお店のデータベースに保存しません。キャンペーンや誕生日クーポンに必要な情報は、その都度
          VESS Login で提示していただきます。
        </SectionText>
        <PrivacyGrid>
          {PRIVACY.map((s, i) => (
            <PrivacyItem key={s.t}>
              <PrivacyNum>0{i + 1}</PrivacyNum>
              <PrivacyTitle>{s.t}</PrivacyTitle>
              <PrivacyText>{s.d}</PrivacyText>
            </PrivacyItem>
          ))}
        </PrivacyGrid>
        <PrivacyNote>
          体験には、VESS Wallet に「個人情報」の証明書を登録しておく必要があります。お店の方は
          <Link href='/restaurant/dashboard'>集計ダッシュボード</Link>
          で、お店に残る情報を確認できます。
        </PrivacyNote>
      </Section>

      <Section id='shop'>
        <SectionHead>
          <SectionEn>SHOP</SectionEn>
          <SectionTitle>店舗情報</SectionTitle>
        </SectionHead>
        <ShopGrid>
          <ShopTable>
            {[
              ['店名', SHOP_NAME],
              ['住所', '東京都渋谷区宇田川町 0-0-0 宇田川ビル1F'],
              ['アクセス', '渋谷駅 ハチ公口から徒歩7分'],
              ['営業時間', '11:00〜15:00 ／ 17:30〜22:00（L.O. 21:30）'],
              ['定休日', '火曜日'],
              ['席数', 'カウンター10席・テーブル2卓'],
              ['お支払い', '現金・各種カード・QR決済'],
            ].map(([k, v]) => (
              <ShopRow key={k}>
                <ShopDt>{k}</ShopDt>
                <ShopDd>{v}</ShopDd>
              </ShopRow>
            ))}
          </ShopTable>
          <MapBox>
            <ShopMap />
          </MapBox>
        </ShopGrid>
      </Section>
    </Shell>
  </>
)

const inner = `
  max-width: 1080px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
`

const Hero = styled.section`
  position: relative;
  overflow: hidden;
  color: #fff;
  background:
    radial-gradient(circle at 75% 45%, rgba(226, 113, 29, 0.35), transparent 45%),
    radial-gradient(circle at 10% 90%, #3a2213, transparent 50%),
    ${color.night};
`
const HeroInner = styled.div`
  ${inner}
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  align-items: center;
  gap: 24px;
  padding-top: 56px;
  padding-bottom: 64px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
    padding-top: 36px;
    padding-bottom: 40px;
  }
`
const HeroCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`
const HeroKicker = styled.div`
  font-family: ${font.serif}, serif;
  font-weight: 600;
  font-size: 18px;
  letter-spacing: 0.12em;
  color: ${color.accent};
`
const HeroTitle = styled.h1`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 64px;
  line-height: 1.2;
  letter-spacing: 0.02em;
  margin: 0;
  @media (max-width: 560px) {
    font-size: 40px;
  }
`
const HeroText = styled.p`
  font-size: 15px;
  line-height: 2;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
  max-width: 460px;
`
const HeroActions = styled.div`
  display: flex;
  gap: 28px;
  flex-wrap: wrap;
  align-items: center;
`
const HeroPrimary = styled(Link)`
  ${actionCss}
  min-width: 220px;
  background: ${color.accent};
  color: #fff;
`
const HeroGhost = styled(Link)`
  ${actionCss}
  padding-left: 4px;
  padding-right: 4px;
  gap: 14px;
  color: #fff;
  border-bottom: 1px solid rgba(255, 255, 255, 0.4);
  border-radius: 0;
`
const HeroVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  svg {
    max-width: 100%;
    height: auto;
    filter: drop-shadow(0 30px 40px rgba(0, 0, 0, 0.5));
  }
`
const Stamp = styled.div`
  position: absolute;
  top: 8%;
  right: 8%;
  width: 78px;
  height: 78px;
  border-radius: 50%;
  border: 2px solid ${color.red};
  background: rgba(184, 50, 42, 0.92);
  color: #fff;
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 14px;
  line-height: 1.3;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  transform: rotate(-12deg);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.35);
`
const NewsBar = styled.div`
  background: ${color.kraft};
  border-bottom: 1px solid ${color.line};
`
const NewsInner = styled.div`
  ${inner}
  display: flex;
  align-items: center;
  gap: 14px;
  padding-top: 14px;
  padding-bottom: 14px;
`
const NewsLabel = styled.span`
  flex-shrink: 0;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: ${color.red};
  padding: 3px 10px;
  border-radius: 3px;
`
const NewsLink = styled(Link)`
  font-size: 13px;
  color: ${color.ink};
  text-decoration: none;
  time {
    font-weight: 700;
    margin-right: 10px;
    color: ${color.sub};
  }
  &:hover {
    text-decoration: underline;
  }
`
const Section = styled.section<{ tinted?: boolean; dark?: boolean }>`
  width: 100%;
  padding: 72px 20px;
  background: ${(p) => (p.dark ? color.night : p.tinted ? color.kraft : 'transparent')};
  color: ${(p) => (p.dark ? '#fff' : 'inherit')};
  scroll-margin-top: 64px;
  & > * {
    max-width: 1040px;
    margin-left: auto;
    margin-right: auto;
  }
  @media (max-width: 560px) {
    padding-top: 52px;
    padding-bottom: 52px;
  }
`
const SectionHead = styled.div`
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 20px;
  padding-bottom: 18px;
  margin-bottom: 36px;
  border-bottom: 1px solid currentColor;
  border-bottom-color: rgba(128, 112, 96, 0.35);
`
const SectionEn = styled.div`
  font-family: ${font.latin}, sans-serif;
  font-size: 52px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: 0.02em;
  color: ${color.accent};
  @media (max-width: 560px) {
    font-size: 40px;
  }
`
const SectionTitle = styled.h2`
  font-family: ${font.serif}, serif;
  font-weight: 600;
  font-size: 22px;
  letter-spacing: 0.12em;
  margin: 0;
  @media (max-width: 560px) {
    font-size: 18px;
  }
`
const SectionText = styled.p<{ light?: boolean }>`
  font-size: 14px;
  line-height: 1.95;
  margin: 0;
  color: ${(p) => (p.light ? 'rgba(255,255,255,0.8)' : color.sub)};
`
const KodawariGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`
const KodawariCard = styled.div`
  background: ${color.card};
  border: 1px solid ${color.line};
  border-radius: 6px;
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
`
const KodawariNo = styled.div`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 40px;
  color: ${color.red};
  line-height: 1;
`
const KodawariTitle = styled.h3`
  font-family: ${font.serif}, serif;
  font-weight: 600;
  font-size: 19px;
  letter-spacing: 0.04em;
  margin: 0;
`
const MenuGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 18px;
  @media (max-width: 900px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    gap: 12px;
  }
`
const MenuCard = styled.article`
  background: ${color.card};
  border-radius: 6px;
  padding: 18px 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  box-shadow: 0 2px 10px rgba(31, 25, 21, 0.06);
`
const MenuVisual = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
  svg {
    max-width: 100%;
    height: auto;
  }
`
const MenuBadge = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  font-size: 11px;
  font-weight: 700;
  color: #fff;
  background: ${color.red};
  padding: 3px 8px;
  border-radius: 2px;
`
const MenuName = styled.h3`
  font-family: ${font.serif}, serif;
  font-weight: 600;
  font-size: 16px;
  margin: 0;
  line-height: 1.45;
`
const MenuPrice = styled.div`
  font-family: ${font.latin}, sans-serif;
  font-size: 26px;
  font-weight: 500;
  color: ${color.accentDeep};
  span {
    font-size: 11px;
    font-weight: 500;
    color: ${color.sub};
    margin-left: 2px;
  }
`
const MenuText = styled.p`
  font-size: 12px;
  line-height: 1.75;
  color: ${color.sub};
  margin: 0;
`
const Sides = styled.div`
  margin-top: 28px;
  background: ${color.card};
  border-radius: 6px;
  padding: 20px 24px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px 40px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
const SideRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
  font-size: 14px;
`
const SideDots = styled.span`
  flex: 1;
  border-bottom: 1px dotted ${color.sub};
  opacity: 0.5;
`
const PromoGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr;
  }
`
const Promo = styled(Link)<{ tone: 'gold' | 'orange' }>`
  position: relative;
  overflow: hidden;
  border-radius: 6px;
  padding: 30px 26px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  text-decoration: none;
  color: ${(p) => (p.tone === 'gold' ? '#3b2a00' : '#fff')};
  background: ${(p) =>
    p.tone === 'gold'
      ? 'linear-gradient(135deg, #ffd66b, #f4a93a)'
      : `linear-gradient(135deg, ${color.accent}, #9d420a)`};
  transition: transform 0.15s;
  &:hover {
    transform: translateY(-2px);
  }
  &::after {
    content: '';
    position: absolute;
    right: -50px;
    top: -50px;
    width: 170px;
    height: 170px;
    border-radius: 50%;
    border: 16px solid rgba(255, 255, 255, 0.18);
  }
`
const PromoKicker = styled.div`
  font-family: ${font.serif}, serif;
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.12em;
  opacity: 0.85;
`
const PromoTitle = styled.div`
  font-family: ${font.display}, sans-serif;
  font-weight: 900;
  font-size: 26px;
  line-height: 1.4;
`
const PromoText = styled.p`
  font-size: 13px;
  line-height: 1.8;
  margin: 0;
  opacity: 0.9;
`
const PromoGo = styled.div`
  margin-top: 10px;
  align-self: flex-start;
  display: inline-flex;
  gap: 12px;
  font-weight: 700;
  font-size: 14px;
  padding-bottom: 4px;
  border-bottom: 1px solid currentColor;
  &::after {
    content: '→';
    font-family: ${font.latin}, sans-serif;
    transition: transform 0.2s;
  }
  a:hover > &::after {
    transform: translateX(4px);
  }
`
const PrivacyGrid = styled.div`
  margin-top: 36px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`
const PrivacyItem = styled.div`
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: 6px;
  padding: 24px;
  background: rgba(255, 255, 255, 0.03);
`
const PrivacyNum = styled.div`
  font-family: ${font.latin}, sans-serif;
  font-size: 34px;
  font-weight: 500;
  color: ${color.accent};
`
const PrivacyTitle = styled.h3`
  font-size: 17px;
  margin: 8px 0;
`
const PrivacyText = styled.p`
  font-size: 13px;
  line-height: 1.85;
  margin: 0;
  color: rgba(255, 255, 255, 0.72);
`
const PrivacyNote = styled.p`
  margin-top: 28px;
  font-size: 12px;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.6);
  a {
    color: ${color.accent};
    margin: 0 2px;
  }
`
const ShopGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 28px;
  align-items: start;
  @media (max-width: 800px) {
    grid-template-columns: 1fr;
  }
`
const ShopTable = styled.dl`
  margin: 0;
  background: ${color.card};
  border-radius: 6px;
  padding: 8px 24px;
  border: 1px solid ${color.line};
`
const ShopRow = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr;
  gap: 12px;
  padding: 14px 0;
  font-size: 14px;
  border-bottom: 1px solid ${color.line};
  &:last-of-type {
    border-bottom: none;
  }
`
const ShopDt = styled.dt`
  color: ${color.sub};
  font-weight: 700;
`
const ShopDd = styled.dd`
  margin: 0;
  line-height: 1.7;
`
const MapBox = styled.div`
  border-radius: 6px;
  overflow: hidden;
  border: 1px solid ${color.line};
  svg {
    display: block;
  }
`

export default RestaurantTop
