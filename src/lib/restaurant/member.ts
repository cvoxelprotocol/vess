import crypto from 'crypto'

// 会員登録フォームの入力と、会員証に入れる値

export type MemberInput = {
  name: string
  birthdate: string
  email: string
  prefecture: string
  address: string
}

export type MemberSubject = MemberInput & {
  member_no: string
  birth_month: number
  age_over_20: boolean
  age_band: string
}

const BIRTHDATE = /^(\d{4})-(\d{2})-(\d{2})$/
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LEN = 100

const parseBirthdate = (s: string) => {
  const m = BIRTHDATE.exec(s)
  if (!m) return null
  const [y, mo, d] = m.slice(1).map(Number)
  const date = new Date(y, mo - 1, d)
  // 2月30日のような存在しない日付を弾く
  if (date.getFullYear() !== y || date.getMonth() !== mo - 1 || date.getDate() !== d) return null
  return { y, mo, d }
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '')

/** 入力を検証する。不正なら項目名→メッセージを返す */
export function parseMemberInput(body: any): { input: MemberInput } | { errors: Record<string, string> } {
  const input: MemberInput = {
    name: str(body?.name),
    birthdate: str(body?.birthdate),
    email: str(body?.email),
    prefecture: str(body?.prefecture),
    address: str(body?.address),
  }
  const errors: Record<string, string> = {}
  for (const [k, v] of Object.entries(input)) {
    if (!v) errors[k] = '入力してください'
    else if (v.length > MAX_LEN) errors[k] = `${MAX_LEN}文字以内で入力してください`
  }
  if (!errors.birthdate) {
    const b = parseBirthdate(input.birthdate)
    if (!b || new Date(b.y, b.mo - 1, b.d) > new Date()) errors.birthdate = '正しい日付を入力してください'
  }
  if (!errors.email && !EMAIL.test(input.email)) errors.email = 'メールアドレスの形式で入力してください'
  return Object.keys(errors).length ? { errors } : { input }
}

const ageBand = (age: number) => (age < 10 ? '10歳未満' : age >= 60 ? '60代以上' : `${Math.floor(age / 10) * 10}代`)

/** 会員番号を採番し、生年月日から導出した値を加えた会員証の中身を作る */
export function buildMemberSubject(input: MemberInput, today = new Date()): MemberSubject {
  const b = parseBirthdate(input.birthdate)
  if (!b) throw new Error('invalid birthdate')
  const month = today.getMonth() + 1
  const hadBirthday = month > b.mo || (month === b.mo && today.getDate() >= b.d)
  const age = today.getFullYear() - b.y - (hadBirthday ? 0 : 1)
  return {
    member_no: `UDG-${crypto.randomInt(0, 1e8).toString().padStart(8, '0')}`,
    ...input,
    birth_month: b.mo,
    age_over_20: age >= 20,
    age_band: ageBand(age),
  }
}
