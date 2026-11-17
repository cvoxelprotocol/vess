// API とページで共有するレスポンス型

export type ClaimValue = string | number | boolean | null

export type DemoResult = {
  ok: boolean
  // 画面表示用メッセージ
  title: string
  message: string
  // ウォレットから開示された値（お店側では保存しない）
  received: Record<string, ClaimValue>
  // お店が保存した値
  stored: Record<string, string | number> | null
  entryNumber?: string
  coupon?: { name: string; code: string; validUntil: string }
}

export type Stats = {
  ageBands: string[]
  entries: Record<string, Record<string, number>>
  coupons: Record<number, number>
  members: number
}

export type MemberResult = {
  memberNo: string
  joinedAt: string | null
  history: { at: string; label: string }[]
  // 会員番号に紐づけてお店が保存している値（会員番号・日時・利用履歴のみ）
  stored: Record<string, string | number>
}
