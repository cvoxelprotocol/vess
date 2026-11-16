// デモ用のプロセス内メモリストア。個人を特定する値は持たず、集計値と応募番号だけを保存する。
// Vercel ではインスタンスごとに別の値になり、再起動で初期値に戻る（本番は永続ストアへ）。

export const AGE_BANDS = ['20代', '30代', '40代', '50代', '60代以上']

type Store = {
  // prefecture -> age_band -> 件数
  entries: Record<string, Record<string, number>>
  nextEntryNo: number
  // 誕生月(1-12) -> クーポン発行数
  coupons: Record<number, number>
  // correlationId -> 保存結果（二重処理防止。PII は含まない）
  processed: Map<string, unknown>
}

const SEED: Record<string, number[]> = {
  東京都: [42, 58, 47, 31, 14],
  神奈川県: [21, 33, 29, 18, 9],
  大阪府: [19, 27, 22, 16, 8],
  埼玉県: [12, 18, 17, 11, 6],
  千葉県: [10, 15, 14, 10, 5],
  愛知県: [9, 13, 12, 8, 4],
  福岡県: [8, 11, 9, 6, 3],
  北海道: [5, 8, 7, 6, 4],
}

function seed(): Store {
  const entries: Store['entries'] = Object.create(null)
  for (const [pref, counts] of Object.entries(SEED)) {
    entries[pref] = Object.fromEntries(AGE_BANDS.map((b, i) => [b, counts[i]]))
  }
  return {
    entries,
    nextEntryNo: 1288,
    coupons: { 9: 37, 10: 44, 11: 18 },
    processed: new Map(),
  }
}

// dev の HMR でリセットされないよう globalThis に置く
const g = globalThis as unknown as { __restaurantDemoStore?: Store }
export const store: Store = g.__restaurantDemoStore ?? (g.__restaurantDemoStore = seed())

export function addEntry(prefecture: string, ageBand: string): { entryNumber: string; countAfter: number } {
  // 自己申告の値がキーになるため、年代は固定リストに限定し、都道府県は prototype を持たない行に入れる
  const band = AGE_BANDS.includes(ageBand) ? ageBand : 'その他'
  const row = (store.entries[prefecture] ??= Object.create(null) as Record<string, number>)
  row[band] = (row[band] ?? 0) + 1
  const no = store.nextEntryNo++
  return { entryNumber: `BEER-${String(no).padStart(6, '0')}`, countAfter: row[band] }
}

export function addCoupon(month: number): number {
  store.coupons[month] = (store.coupons[month] ?? 0) + 1
  return store.coupons[month]
}

export function snapshot() {
  return {
    ageBands: AGE_BANDS,
    entries: store.entries,
    coupons: store.coupons,
  }
}
