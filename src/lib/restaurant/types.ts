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
}
