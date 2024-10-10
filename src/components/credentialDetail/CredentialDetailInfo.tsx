import styled from '@emotion/styled'
import { Text } from 'kai-kit'
import { FC } from 'react'
import { formatDate } from '@/utils/date'

export type OBCredentialInfoProps = {
  vc?: any
}

export const OBCredentialInfo: FC<OBCredentialInfoProps> = ({ vc }) => {
  if (!vc) return null
  return (
    <>
      {vc.credentialSubject?.achievement?.criteria?.narrative && (
        <InfoItemFrame>
          <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
            達成条件
          </Text>
          <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
            {vc.credentialSubject.achievement.criteria.narrative}
          </Text>
        </InfoItemFrame>
      )}
      {vc.credentialSubject?.achievement?.achievementType && (
        <InfoItemFrame>
          <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
            実績タイプ
          </Text>
          <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
            {vc.credentialSubject.achievement.achievementType}
          </Text>
        </InfoItemFrame>
      )}
      {vc.credentialSubject?.activityStartDate && (
        <InfoItemFrame>
          <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
            活動開始日
          </Text>
          <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
            {formatDate(vc.credentialSubject.activityStartDate)}
          </Text>
        </InfoItemFrame>
      )}
      {vc.credentialSubject?.activityEndDate && (
        <InfoItemFrame>
          <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
            活動終了日
          </Text>
          <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
            {formatDate(vc.credentialSubject.activityEndDate)}
          </Text>
        </InfoItemFrame>
      )}
      {vc.validFrom && (
        <InfoItemFrame>
          <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
            有効開始日
          </Text>
          <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
            {formatDate(vc.validFrom)}
          </Text>
        </InfoItemFrame>
      )}
      <InfoItemFrame>
        <Text typo='label-lg' color='var(--kai-color-sys-on-layer-minor)'>
          有効期限日
        </Text>
        <Text typo='body-lg' color='var(--kai-color-sys-on-layer)'>
          {formatDate(vc.expirationDate || vc.validUntil) || '無期限'}
        </Text>
      </InfoItemFrame>
    </>
  )
}

const InfoItemFrame = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  gap: var(--kai-size-sys-space-xs);
  width: 100%;
`
