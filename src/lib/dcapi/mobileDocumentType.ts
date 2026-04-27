// Swift側 MobileDocumentType.swift と一致させる。
// IdentityProvider.entitlements の mobile-document-types に列挙されたもの。
export const MOBILE_DOCUMENT_TYPES = [
  'org.iso.18013.5.1.mDL',
  'org.iso.23220.photoid.1',
  'eu.europa.ec.av.1',
  'org.iso.23220.1.jp.mnc',
  'eu.europa.ec.eudi.pid.1',
] as const

export type MobileDocumentType = (typeof MOBILE_DOCUMENT_TYPES)[number]

export interface MobileDocumentTypeMeta {
  docType: MobileDocumentType
  displayName: string
  defaultNamespace: string
  defaultElements: string[]
}

export const MOBILE_DOCUMENT_TYPE_META: Record<MobileDocumentType, MobileDocumentTypeMeta> = {
  'org.iso.18013.5.1.mDL': {
    docType: 'org.iso.18013.5.1.mDL',
    displayName: 'モバイル運転免許証 (mDL)',
    defaultNamespace: 'org.iso.18013.5.1',
    defaultElements: [
      'family_name',
      'given_name',
      'birth_date',
      'portrait',
      'age_over_18',
      'driving_privileges',
    ],
  },
  'org.iso.23220.photoid.1': {
    docType: 'org.iso.23220.photoid.1',
    displayName: '写真付き身分証 (Photo ID)',
    defaultNamespace: 'org.iso.23220.1',
    defaultElements: ['family_name_unicode', 'given_name_unicode', 'birth_date', 'portrait'],
  },
  'eu.europa.ec.av.1': {
    docType: 'eu.europa.ec.av.1',
    displayName: 'EU 年齢確認 (Age Verification)',
    defaultNamespace: 'eu.europa.ec.av.1',
    defaultElements: ['age_over_18'],
  },
  'org.iso.23220.1.jp.mnc': {
    docType: 'org.iso.23220.1.jp.mnc',
    displayName: 'マイナンバーカード (JP MNC)',
    defaultNamespace: 'org.iso.23220.1.jp.mnc',
    defaultElements: [
      'family_name_unicode',
      'given_name_unicode',
      'birth_date',
      'individual_number',
    ],
  },
  'eu.europa.ec.eudi.pid.1': {
    docType: 'eu.europa.ec.eudi.pid.1',
    displayName: 'EU 個人識別情報 (PID)',
    defaultNamespace: 'eu.europa.ec.eudi.pid.1',
    defaultElements: ['family_name', 'given_name', 'birth_date', 'age_over_18'],
  },
}
