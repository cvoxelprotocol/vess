import styled from '@emotion/styled'
import { NextPage } from 'next'
import { FormEvent, useState } from 'react'
import { Meta } from '@/components/layouts/Meta'
import {
  Card,
  CardTitle,
  Err,
  Lead,
  LoginButton,
  PageHero,
  Primary,
  QrBlock,
  SHOP_NAME,
  Secondary,
  Shell,
  Small,
  SplitPanels,
  StepBar,
  color,
} from '@/components/restaurant/ui'

const FIELDS = [
  { name: 'name', label: '氏名', placeholder: '宇田川 太郎', type: 'text', autoComplete: 'name' },
  { name: 'birthdate', label: '生年月日', placeholder: '', type: 'date', autoComplete: 'bday' },
  { name: 'email', label: 'メールアドレス', placeholder: 'taro@example.com', type: 'email', autoComplete: 'email' },
  { name: 'prefecture', label: '都道府県', placeholder: '東京都', type: 'text', autoComplete: 'address-level1' },
  { name: 'address', label: '市区町村以下', placeholder: '渋谷区宇田川町0-0-0', type: 'text', autoComplete: 'address-line1' },
] as const

type FieldName = (typeof FIELDS)[number]['name']
type Form = Record<FieldName, string>

const EMPTY: Form = { name: '', birthdate: '', email: '', prefecture: '', address: '' }

const RegisterPage: NextPage = () => {
  const [form, setForm] = useState<Form>(EMPTY)
  const [errors, setErrors] = useState<Partial<Record<FieldName, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [issued, setIssued] = useState<{ memberNo: string; offerUri: string } | null>(null)

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setErrors({})
    setSending(true)
    try {
      const r = await fetch('/api/restaurant/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const json = await r.json().catch(() => ({}))
      if (r.ok && json.offerUri) {
        setIssued(json)
        // 入力値は画面からも消す
        setForm(EMPTY)
      } else if (json.errors) {
        setErrors(json.errors)
      } else {
        setError('会員証の発行に失敗しました。時間をおいて再度お試しください。')
      }
    } catch (err: any) {
      setError(String(err?.message ?? err))
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <Meta pageTitle={`会員登録 - ${SHOP_NAME}（デモ）`} />
      <Shell>
        <PageHero
          kicker='MEMBERSHIP'
          title='宇田川 会員証を発行します'
          text='一度登録すると、会員証が VESS Wallet に届きます。次回からは ID もパスワードも使わず、会員証を見せるだけでログインできます。'
        />

        <StepBar current={issued ? 1 : 0} labels={['会員情報の入力', '会員証の受け取り', 'ログイン']} />

        {!issued && (
          <>
            <Card>
              <CardTitle>お店は会員番号だけを残します</CardTitle>
              <Lead>
                入力いただいた内容は会員証に書き込んでお客さまにお渡しし、お店のデータベースには保存しません。お店に残るのは会員番号と、ご利用の履歴だけです。
              </Lead>
            </Card>
            <FormCard onSubmit={submit} noValidate>
              <CardTitle>会員情報</CardTitle>
              <Small>デモのため、架空の値で登録してください。</Small>
              {FIELDS.map((f) => (
                <Field key={f.name}>
                  <Label htmlFor={f.name}>{f.label}</Label>
                  <Input
                    id={f.name}
                    name={f.name}
                    type={f.type}
                    placeholder={f.placeholder}
                    autoComplete={f.autoComplete}
                    value={form[f.name]}
                    aria-invalid={!!errors[f.name]}
                    onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                  />
                  {errors[f.name] && <Err>{errors[f.name]}</Err>}
                </Field>
              ))}
              <Primary type='submit' disabled={sending}>
                {sending ? '会員証を準備しています…' : '会員証を発行する'}
              </Primary>
              {error && <Err>{error}</Err>}
            </FormCard>
          </>
        )}

        {issued && (
          <>
            <Card>
              <CardTitle>会員証を受け取ってください</CardTitle>
              <MemberNo>
                <span>会員番号</span>
                {issued.memberNo}
              </MemberNo>
              <LoginButton href={issued.offerUri}>VESS Wallet で会員証を受け取る</LoginButton>
              <QrBlock
                uri={issued.offerUri}
                note='パソコンで見ている場合は、スマートフォンの VESS Wallet でこの QR を読み取ってください。受け取りの有効期限は10分です。'
              />
              <Small>受け取ったら、このページに戻って会員ページからログインしてください。</Small>
            </Card>
            <SplitPanels
              left={{
                title: '会員証に入れた値',
                note: 'お客さまの VESS Wallet にだけ残ります',
                rows: {
                  会員番号: issued.memberNo,
                  '氏名・生年月日': '入力どおり',
                  'メール・住所': '入力どおり',
                  '誕生月・20歳以上・年代': '生年月日から計算',
                },
              }}
              right={{
                title: 'お店が保存した値',
                note: '氏名や生年月日は残りません',
                rows: { 会員番号: issued.memberNo, 履歴: '会員登録（会員証を発行）' },
              }}
            />
            <Actions>
              <Secondary href='/restaurant/member'>会員ページへ</Secondary>
            </Actions>
          </>
        )}
      </Shell>
    </>
  )
}

const FormCard = Card.withComponent('form')
const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`
const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
`
const Input = styled.input`
  font: inherit;
  font-size: 16px;
  padding: 10px 12px;
  border: 1px solid #cfc8bf;
  border-radius: 4px;
  background: #fff;
  color: ${color.ink};
  &:focus {
    outline: 2px solid ${color.accent};
    outline-offset: -1px;
    border-color: transparent;
  }
  &[aria-invalid='true'] {
    border-color: ${color.red};
  }
`
const MemberNo = styled.div`
  display: flex;
  align-items: baseline;
  gap: 12px;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.04em;
  span {
    font-size: 12px;
    font-weight: 700;
    color: ${color.accentDeep};
    letter-spacing: 0;
  }
`
const Actions = styled.div`
  display: flex;
  gap: 8px;
`

export default RegisterPage
