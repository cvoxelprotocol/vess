import Link from 'next/link'
import { FC } from 'react'

export const DCApiMenuPage: FC = () => {
  return (
    <div style={{ padding: 20, maxWidth: 900, margin: '0 auto', fontFamily: 'system-ui' }}>
      <h1>Digital Credentials API デモ</h1>
      <p style={{ color: '#666' }}>
        対向 Wallet:{' '}
        iOS は <code>~/Workspace/dc-api-demo</code> の <code>IdentityProvider</code> extension、
        Android は <code>~/Workspace/dc-api-demo-android</code>。
      </p>
      <ul style={{ lineHeight: 1.8 }}>
        <li>
          <Link href="/dcapi/verify-ios">
            <strong>Verifier — iOS Safari</strong>
          </Link>{' '}
          — <code>org-iso-mdoc</code> ( ISO 18013-7 Annex C / Apple/WebKit 形式 ) で提示要求。
          <code>navigator.credentials.get()</code>。
        </li>
        <li>
          <Link href="/dcapi/verify-android">
            <strong>Verifier — Android Chrome</strong>
          </Link>{' '}
          — <code>openid4vp-v1-unsigned</code> ( OpenID4VP DC API + DCQL ) で提示要求。
          <code>navigator.credentials.get()</code>。
        </li>
        <li>
          <Link href="/dcapi/issue">
            <strong>Issuer</strong>
          </Link>{' '}
          — <code>openid4vci</code> で発行要求。
          <code>navigator.credentials.create()</code>。 Offer URI を手入力。
        </li>
      </ul>
    </div>
  )
}
