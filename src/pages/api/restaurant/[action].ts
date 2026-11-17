import crypto from 'crypto'
import { NextApiRequest, NextApiResponse } from 'next'
import {
  DemoKind,
  VERIFIED,
  createAuthRequest,
  createMemberOffer,
  currentMonthTokyo,
  fetchAuthStatus,
  findClaim,
  isDemoKind,
} from '@/lib/restaurant/config'
import { buildMemberSubject, parseMemberInput } from '@/lib/restaurant/member'
import {
  MemberRecord,
  addCoupon,
  addEntry,
  addHistory,
  memberRecord,
  registerMember,
  snapshot,
  store,
} from '@/lib/restaurant/store'
import { ClaimValue, DemoResult, MemberResult } from '@/lib/restaurant/types'
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
  return `${proto}://${host}/restaurant/${kind === 'login' ? 'member' : kind}`
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

// 会員登録: 会員番号を採番して会員証の発行オファーを返す。入力値は発行に使うだけで保存しない
const register: Handler = async (req, res) => {
  const parsed = parseMemberInput(req.body)
  if ('errors' in parsed) {
    res.status(HttpStatus.BAD_REQUEST).json({ errors: parsed.errors })
    return
  }
  const subject = buildMemberSubject(parsed.input)
  const offerUri = await createMemberOffer(subject)
  if (!offerUri) {
    res.status(HttpStatus.BAD_GATEWAY).json({ error: 'offer failed' })
    return
  }
  registerMember(subject.member_no)
  res.status(200).json({ memberNo: subject.member_no, offerUri })
}

// 検証済みの開示値をサーバ側で取り出す。未検証または会員番号がなければ null
async function verifiedClaims(
  kind: DemoKind,
  req: NextApiRequest,
  keys: string[],
): Promise<{ correlationId: string; memberNo: string; claims: Record<string, ClaimValue> } | null> {
  const correlationId = str(req.body?.correlationId)
  if (!correlationId) return null
  const r = await fetchAuthStatus(kind, correlationId, {
    withClaims: true,
    responseCode: str(req.body?.responseCode),
  })
  if (r.json?.status !== VERIFIED) return null
  const claims: Record<string, ClaimValue> = {}
  for (const k of ['member_no', ...keys]) claims[k] = findClaim(r.json, k) ?? null
  const memberNo = str(claims.member_no)
  if (!memberNo) return null
  return { correlationId, memberNo, claims }
}

const fmtJst = (iso: string) =>
  new Intl.DateTimeFormat('ja-JP', { timeZone: 'Asia/Tokyo', dateStyle: 'medium', timeStyle: 'short' }).format(new Date(iso))

const memberView = (memberNo: string, rec: MemberRecord): MemberResult => ({
  memberNo,
  joinedAt: rec.joinedAt,
  history: [...rec.history].reverse(),
  stored: {
    会員番号: memberNo,
    登録日時: rec.joinedAt ? fmtJst(rec.joinedAt) : '（このデモの記録より前）',
    利用履歴: `${rec.history.length} 件`,
  },
})

// 会員証の提示によるログイン。ID・パスワードの代わりに、お店の署名入りの会員番号で会員を特定する
const memberLogin: Handler = async (req, res) => {
  const v = await verifiedClaims('login', req, [])
  if (!v) {
    res.status(HttpStatus.FORBIDDEN).json({ error: 'presentation not verified' })
    return
  }
  const rec = memberRecord(v.memberNo)
  if (!store.processed.has(v.correlationId)) {
    store.processed.set(v.correlationId, true)
    addHistory(rec, '会員証でログイン')
  }
  res.status(200).json(memberView(v.memberNo, rec))
}

const isTrue = (v: ClaimValue) => v === true || v === 'true'

const campaignEntry: Handler = async (req, res) => {
  const v = await verifiedClaims('campaign', req, ['age_over_20', 'age_band', 'prefecture', 'email'])
  if (!v) {
    res.status(HttpStatus.FORBIDDEN).json({ error: 'presentation not verified' })
    return
  }
  const { correlationId, memberNo, claims } = v
  // 同じ提示での再処理（リダイレクト戻りと PC 側ポーリングの重複など）は保存済み結果を返す
  const done = store.processed.get(correlationId) as Omit<DemoResult, 'received'> | undefined
  if (done) {
    res.status(200).json({ ...done, received: claims })
    return
  }

  const rec = memberRecord(memberNo)
  let result: Omit<DemoResult, 'received'>
  if (rec.campaignEntryNo) {
    result = {
      ok: true,
      title: 'すでにご応募いただいています',
      message: '応募は会員お一人さま1回までです。会員番号で応募済みであることを確認しました。',
      entryNumber: rec.campaignEntryNo,
      stored: null,
    }
  } else if (!isTrue(claims.age_over_20)) {
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
    rec.campaignEntryNo = entryNumber
    addHistory(rec, `10周年キャンペーンに応募（${entryNumber}）`)
    result = {
      ok: true,
      title: 'ご応募を受け付けました',
      message: '確認メールを送信しました（デモのため、実際には送信しません）。',
      entryNumber,
      stored: {
        会員番号: memberNo,
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
  const { correlationId, memberNo, claims } = v
  const done = store.processed.get(correlationId) as Omit<DemoResult, 'received'> | undefined
  if (done) {
    res.status(200).json({ ...done, received: claims })
    return
  }

  const month = currentMonthTokyo()
  const birthMonth = Number(claims.birth_month)
  const rec = memberRecord(memberNo)
  let result: Omit<DemoResult, 'received'>
  if (birthMonth === month && rec.couponMonths.includes(month)) {
    result = {
      ok: false,
      title: '今月のクーポンは受け取り済みです',
      message: 'お誕生日クーポンは、お誕生月のうち1回までです。会員番号で受け取り済みであることを確認しました。',
      stored: null,
    }
  } else if (birthMonth === month) {
    const total = addCoupon(month)
    rec.couponMonths.push(month)
    addHistory(rec, `誕生日クーポンを受け取り（${month}月）`)
    result = {
      ok: true,
      title: 'クーポンを発行しました',
      message: 'お誕生月おめでとうございます。お会計時にこの画面をスタッフにお見せください。',
      coupon: {
        name: '味玉らーめん 1杯無料',
        code: crypto.randomBytes(3).toString('hex').toUpperCase(),
        validUntil: `${month}月末まで`,
      },
      stored: { 会員番号: memberNo, 集計: `${month}月のクーポン発行数 +1（計 ${total} 件）` },
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
  register: { method: 'POST', handler: register },
  'member-login': { method: 'POST', handler: memberLogin },
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
