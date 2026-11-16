import styled from '@emotion/styled'
import { NextPage } from 'next'
import Link from 'next/link'
import { Meta } from '@/components/layouts/Meta'
import { Body, Card, CardTitle, Lead, SHOP_NAME, Shell, Small, Title, color } from '@/components/restaurant/ui'

const MENUS = [
  {
    href: '/restaurant/campaign',
    tag: 'キャンペーン',
    title: '生ビール1年分が当たる！',
    desc: '20歳以上の方が対象。年齢確認・お住まいの都道府県・年代・連絡先メールを提示して応募します。',
  },
  {
    href: '/restaurant/birthday',
    tag: '誕生日クーポン',
    title: 'お誕生月は天ざるそば1杯無料',
    desc: '提示するのは「誕生月」だけ。生年月日も名前も、お店には渡りません。',
  },
  {
    href: '/restaurant/dashboard',
    tag: 'お店の方へ',
    title: '集計ダッシュボード',
    desc: '応募の年代別・都道府県別の件数。お店が持っているのはこの集計値だけです。',
  },
]

const STEPS = [
  { t: 'お客さまが持つ', d: '氏名・生年月日・住所などの情報は、お客さまの VESS Wallet に保存されています。' },
  { t: '必要な項目だけ渡す', d: 'お店は用途ごとに必要な項目だけを依頼し、お客さまは内容を確認して提示します。' },
  { t: '使ったら集計だけ残す', d: '受け取った値は応募の判定や連絡に使い、お店の記録には集計値だけを残します。' },
]

const RestaurantTop: NextPage = () => (
  <>
    <Meta pageTitle={`${SHOP_NAME}（デモ）`} />
    <Shell back={false}>
      <Hero>
        <HeroSub>手打ち二八そば</HeroSub>
        <HeroTitle>{SHOP_NAME}</HeroTitle>
        <HeroText>毎朝石臼で挽くそば粉と、昆布と鰹の濃いめのつゆでお待ちしています。</HeroText>
      </Hero>

      <Card>
        <CardTitle>個人情報を預からずに、キャンペーンと分析を</CardTitle>
        <Body>
          {SHOP_NAME}では、お客さまの個人情報をお店のデータベースに保存しません。キャンペーンや誕生日クーポンに必要な情報は、その都度お客さまの
          VESS Wallet から提示していただきます。
        </Body>
        <Steps>
          {STEPS.map((s, i) => (
            <Step key={s.t}>
              <Num>{i + 1}</Num>
              <div>
                <StepTitle>{s.t}</StepTitle>
                <Small>{s.d}</Small>
              </div>
            </Step>
          ))}
        </Steps>
      </Card>

      <Title as='h2'>ご案内</Title>
      <Menus>
        {MENUS.map((m) => (
          <MenuCard key={m.href} href={m.href}>
            <Tag>{m.tag}</Tag>
            <MenuTitle>{m.title}</MenuTitle>
            <Small>{m.desc}</Small>
            <Go>開く →</Go>
          </MenuCard>
        ))}
      </Menus>

      <Lead>
        体験には、VESS Wallet に「個人情報クレデンシャル」（PersonalInfoCredential）を登録しておく必要があります。
      </Lead>
    </Shell>
  </>
)

const Hero = styled.div`
  border-radius: 16px;
  padding: 28px 20px;
  color: #fff;
  background: linear-gradient(135deg, ${color.indigo}, #1a253d);
`
const HeroSub = styled.div`
  font-size: 12px;
  letter-spacing: 0.2em;
  opacity: 0.8;
`
const HeroTitle = styled.div`
  font-size: 30px;
  font-weight: 800;
  margin: 6px 0 10px;
  letter-spacing: 0.08em;
`
const HeroText = styled.p`
  font-size: 13px;
  line-height: 1.8;
  margin: 0;
  opacity: 0.9;
`
const Steps = styled.ol`
  list-style: none;
  padding: 0;
  margin: 4px 0 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
const Step = styled.li`
  display: flex;
  gap: 12px;
  align-items: flex-start;
`
const Num = styled.span`
  flex: 0 0 26px;
  height: 26px;
  border-radius: 999px;
  background: ${color.accent};
  color: #fff;
  font-weight: 800;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
`
const StepTitle = styled.div`
  font-weight: 700;
  font-size: 14px;
`
const Menus = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
const MenuCard = styled(Link)`
  background: ${color.card};
  border: 1px solid ${color.line};
  border-radius: 14px;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
  color: ${color.ink};
  text-decoration: none;
  &:hover {
    border-color: ${color.accent};
  }
`
const Tag = styled.span`
  align-self: flex-start;
  font-size: 11px;
  font-weight: 700;
  color: ${color.accent};
  border: 1px solid ${color.accent};
  border-radius: 999px;
  padding: 2px 8px;
`
const MenuTitle = styled.div`
  font-size: 16px;
  font-weight: 800;
`
const Go = styled.div`
  margin-top: auto;
  font-size: 13px;
  font-weight: 700;
  color: ${color.indigo};
`

export default RestaurantTop
