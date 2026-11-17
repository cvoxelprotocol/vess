import styled from '@emotion/styled'
import { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { Meta } from '@/components/layouts/Meta'
import { Card, CardTitle, Err, Lead, SHOP_NAME, Shell, Small, Title, color } from '@/components/restaurant/ui'
import type { Stats } from '@/lib/restaurant/types'

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0)

const Bars: React.FC<{ rows: [string, number][] }> = ({ rows }) => {
  const max = Math.max(1, ...rows.map(([, n]) => n))
  return (
    <BarList>
      {rows.map(([label, n]) => (
        <BarRow key={label}>
          <BarLabel>{label}</BarLabel>
          <BarTrack>
            <BarFill style={{ width: `${(n / max) * 100}%` }} />
          </BarTrack>
          <BarValue>{n}</BarValue>
        </BarRow>
      ))}
    </BarList>
  )
}

const DashboardPage: NextPage = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = () =>
      fetch('/api/restaurant/stats')
        .then((r) => r.json())
        .then((j: Stats) => {
          setStats(j)
          setError(null)
        })
        .catch(() => setError('集計を取得できませんでした'))
    load()
    // 応募が入ると数字が動く様子を見せるため定期更新
    const t = setInterval(load, 5000)
    return () => clearInterval(t)
  }, [])

  const prefs = stats ? Object.keys(stats.entries) : []
  // 想定外の年代表記もそのまま列に出す
  const bands = stats
    ? [
        ...stats.ageBands,
        ...Array.from(new Set(prefs.flatMap((p) => Object.keys(stats.entries[p])))).filter(
          (b) => !stats.ageBands.includes(b),
        ),
      ]
    : []
  const cell = (p: string, b: string) => stats?.entries[p]?.[b] ?? 0
  const byBand: [string, number][] = bands.map((b) => [b, sum(prefs.map((p) => cell(p, b)))])
  const byPref: [string, number][] = prefs
    .map((p): [string, number] => [p, sum(bands.map((b) => cell(p, b)))])
    .sort((a, b) => b[1] - a[1])
  const total = sum(byBand.map(([, n]) => n))
  const coupons: [string, number][] = stats
    ? Object.entries(stats.coupons)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map(([m, n]) => [`${m}月`, n])
    : []

  return (
    <>
      <Meta pageTitle={`集計ダッシュボード - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <Title>集計ダッシュボード</Title>
        <Lead>
          お店に残っているのは、会員番号ごとの利用履歴とこの集計値だけです。会員の氏名・メールアドレス・誕生日はデータベースにありません。
        </Lead>
        {error && <Err>{error}</Err>}

        {stats && (
          <>
            <Kpis>
              <Kpi>
                <KpiLabel>会員数</KpiLabel>
                <KpiValue>{stats.members.toLocaleString()}</KpiValue>
              </Kpi>
              <Kpi>
                <KpiLabel>キャンペーン応募数</KpiLabel>
                <KpiValue>{total.toLocaleString()}</KpiValue>
              </Kpi>
              <Kpi>
                <KpiLabel>誕生日クーポン発行数</KpiLabel>
                <KpiValue>{sum(coupons.map(([, n]) => n)).toLocaleString()}</KpiValue>
              </Kpi>
              <Kpi>
                <KpiLabel>保存している個人情報</KpiLabel>
                <KpiValue>0 件</KpiValue>
              </Kpi>
            </Kpis>

            <Grid>
              <Card>
                <CardTitle>年代別の応募数</CardTitle>
                <Bars rows={byBand} />
              </Card>
              <Card>
                <CardTitle>都道府県別の応募数</CardTitle>
                <Bars rows={byPref} />
              </Card>
            </Grid>

            <Card>
              <CardTitle>都道府県 × 年代</CardTitle>
              <TableWrap>
                <Table>
                  <thead>
                    <tr>
                      <th />
                      {bands.map((b) => (
                        <th key={b}>{b}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {byPref.map(([p]) => (
                      <tr key={p}>
                        <th>{p}</th>
                        {bands.map((b) => (
                          <td key={b}>{cell(p, b)}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableWrap>
            </Card>

            <Card>
              <CardTitle>誕生日クーポン発行数（月別）</CardTitle>
              <Bars rows={coupons} />
            </Card>

            <Small>デモ用の初期値を含みます。サーバの再起動で初期値に戻ります。</Small>
          </>
        )}
      </Shell>
    </>
  )
}

const Kpis = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  @media (max-width: 760px) {
    grid-template-columns: 1fr 1fr;
  }
`
const Kpi = styled.div`
  background: ${color.card};
  border: 1px solid ${color.line};
  border-radius: 14px;
  padding: 14px 16px;
`
const KpiLabel = styled.div`
  font-size: 12px;
  color: ${color.sub};
`
const KpiValue = styled.div`
  font-size: 26px;
  font-weight: 800;
  margin-top: 2px;
`
const Grid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`
const BarList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`
const BarRow = styled.div`
  display: grid;
  grid-template-columns: 72px 1fr 40px;
  align-items: center;
  gap: 8px;
  font-size: 13px;
`
const BarLabel = styled.div`
  color: ${color.sub};
`
const BarTrack = styled.div`
  height: 12px;
  border-radius: 6px;
  background: rgba(38, 55, 90, 0.08);
  overflow: hidden;
`
const BarFill = styled.div`
  height: 100%;
  border-radius: 6px;
  background: ${color.indigo};
  transition: width 0.4s;
`
const BarValue = styled.div`
  text-align: right;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`
const TableWrap = styled.div`
  overflow-x: auto;
`
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  th,
  td {
    padding: 8px 10px;
    border-bottom: 1px solid ${color.line};
    text-align: right;
    white-space: nowrap;
  }
  thead th {
    color: ${color.sub};
    font-weight: 600;
  }
  tbody th {
    text-align: left;
    font-weight: 600;
  }
`

export default DashboardPage
