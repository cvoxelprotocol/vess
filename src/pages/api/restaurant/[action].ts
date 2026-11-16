import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  DemoKind,
  VERIFIED,
  createAuthRequest,
  currentMonthTokyo,
  fetchAuthStatus,
  findClaim,
  isDemoKind,
} from '@/lib/restaurant/config'
import { addCoupon, addEntry, snapshot, store } from '@/lib/restaurant/store'
import { ClaimValue, DemoResult } from '@/lib/restaurant/types'
import { HttpStatus } from '@/utils/error'

// 飲食店デモの API。メモリ上の集計を共有するため 1 つのルートにまとめている。
// （デモ用：認証・レート制限・correlationId のセッション束縛は未実装）

type Handler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>

const str = (v: unknown): string | undefined => (typeof v === 'string' && v ? v : undefined)

// 同一端末フローでウォレットから戻る先（?correlationId=... が付与される）
function redirectUriFor(req: NextApiRequest, kind: DemoKind): string | undefined {
  const host = req.headers['x-forwarded-host'] ?? req.headers.host
  if (typeof host !== 'string') return undefined
  const proto = str(req.headers['x-forwarded-proto']) ?? (host.startsWith('localhost') ? 'http' : 'https')
  return `${proto}://${host}/restaurant/${kind}`
}

const createVpRequest: Handler = async (req, res) => {
  const { kind } = req.body ?? {}
  if (!isDemoKind(kind)) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: 'invalid kind' })
    return
  }
  const r = await createAuthRequest(kind, redirectUriFor(req, kind))
  if (!r.json?.authRequestURI) {
    console.error('[restaurant create-vp-request] auth-requests failed', r.status, r.json)
    res.status(HttpStatus.BAD_GATEWAY).json({ error: 'vp request failed' })
    return
  }
  res.status(200).json({ correlationId: r.json.correlationId, authRequestURI: r.json.authRequestURI })
}

// ステータス文字列のみ返す（開示値はここでは返さない）
const pollVpStatus: Handler = async (req, res) => {
  const { kind, correlationId } = req.body ?? {}
  if (!isDemoKind(kind) || !str(correlationId)) {
    res.status(HttpStatus.BAD_REQUEST).json({ error: 'kind and correlationId required' })
    return
  }
  const r = await fetchAuthStatus(kind, correlationId)
  res.status(200).json({ status: r.json?.status ?? 'unknown' })
}

// 検証済みの開示値をサーバ側で取り出す。未検証なら null
async function verifiedClaims(
  kind: DemoKind,
  req: NextApiRequest,
  keys: string[],
): Promise<{ correlationId: string; claims: Record<string, ClaimValue> } | null> {
  const correlationId = str(req.body?.correlationId)
  if (!correlationId) return null
  const r = await fetchAuthStatus(kind, correlationId, {
    withClaims: true,
    responseCode: str(req.body?.responseCode),
  })
  if (r.json?.status !== VERIFIED) return null
  const claims: Record<string, ClaimValue> = {}
  for (const k of keys) claims[k] = findClaim(r.json, k) ?? null
  return { correlationId, claims }
}

const isTrue = (v: ClaimValue) => v === true || v === 'true'

const campaignEntry: Handler = async (req, res) => {
  const v = await verifiedClaims('campaign', req, ['age_over_20', 'age_band', 'prefecture', 'email'])
  if (!v) {
    res.status(HttpStatus.FORBIDDEN).json({ error: 'presentation not verified' })
    return
  }
  const { correlationId, claims } = v
  // 同じ提示での再処理（リダイレクト戻りと PC 側ポーリングの重複など）は保存済み結果を返す
  const done = store.processed.get(correlationId) as Omit<DemoResult, 'received'> | undefined
  if (done) {
    res.status(200).json({ ...done, received: claims })
    return
  }

  let result: Omit<DemoResult, 'received'>
  if (!isTrue(claims.age_over_20)) {
    result = {
      ok: false,
      title: '今回はご応募いただけません',
      message:
        'このキャンペーンは賞品にお酒を含むため、20歳以上の方が対象です。ご確認いただきありがとうございました。',
      stored: null,
    }
  } else {
    const prefecture = String(claims.prefecture ?? '不明')
    const ageBand = String(claims.age_band ?? '不明')
    const { entryNumber, countAfter } = addEntry(prefecture, ageBand)
    result = {
      ok: true,
      title: 'ご応募を受け付けました',
      message: '確認メールを送信しました（デモのため、実際には送信しません）。',
      entryNumber,
      stored: {
        応募番号: entryNumber,
        集計: `${prefecture} × ${ageBand} の応募数 +1（計 ${countAfter} 件）`,
      },
    }
  }
  store.processed.set(correlationId, result)
  res.status(200).json({ ...result, received: claims })
}

const birthdayCoupon: Handler = async (req, res) => {
  const v = await verifiedClaims('birthday', req, ['birth_month'])
  if (!v) {
    res.status(HttpStatus.FORBIDDEN).json({ error: 'presentation not verified' })
    return
  }
  const { correlationId, claims } = v
  const done = store.processed.get(correlationId) as Omit<DemoResult, 'received'> | undefined
  if (done) {
    res.status(200).json({ ...done, received: claims })
    return
  }

  const month = currentMonthTokyo()
  const birthMonth = Number(claims.birth_month)
  let result: Omit<DemoResult, 'received'>
  if (birthMonth === month) {
    const total = addCoupon(month)
    result = {
      ok: true,
      title: 'クーポンを発行しました',
      message: 'お誕生月おめでとうございます。お会計時にこの画面をスタッフにお見せください。',
      coupon: {
        name: '天ざるそば 1杯無料',
        code: crypto.randomBytes(3).toString('hex').toUpperCase(),
        validUntil: `${month}月末まで`,
      },
      stored: { 集計: `${month}月のクーポン発行数 +1（計 ${total} 件）` },
    }
  } else {
    result = {
      ok: false,
      title: 'お誕生月にまたお越しください',
      message: Number.isFinite(birthMonth)
        ? `お誕生日クーポンは ${birthMonth}月 にご利用いただけます。その頃にまたこのページから受け取ってください。`
        : 'お誕生月を確認できませんでした。',
      stored: null,
    }
  }
  store.processed.set(correlationId, result)
  res.status(200).json({ ...result, received: claims })
}

const stats: Handler = async (_req, res) => {
  res.setHeader('Cache-Control', 'no-store')
  res.status(200).json(snapshot())
}

const routes: Record<string, { method: 'GET' | 'POST'; handler: Handler }> = {
  'create-vp-request': { method: 'POST', handler: createVpRequest },
  'poll-vp-status': { method: 'POST', handler: pollVpStatus },
  'campaign-entry': { method: 'POST', handler: campaignEntry },
  'birthday-coupon': { method: 'POST', handler: birthdayCoupon },
  stats: { method: 'GET', handler: stats },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const route = routes[String(req.query.action)]
  if (!route) {
    res.status(HttpStatus.NOT_FOUND).json({ error: 'not found' })
    return
  }
  if (req.method !== route.method) {
    res.status(HttpStatus.METHOD_NOT_ALLOWED).end()
    return
  }
  try {
    await route.handler(req, res)
  } catch (e: any) {
    console.error(`[restaurant ${req.query.action}]`, e)
    res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'internal error' })
  }
}
