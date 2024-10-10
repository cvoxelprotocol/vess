import { useQueryClient } from '@tanstack/react-query'
import { useVESSAuthUser } from './useVESSAuthUser'
import { useVESSLoading } from './useVESSLoading'
import {
  CredType,
  OBCredentialItemFromBackup,
  VSCredentialItemFromBuckup,
} from '@/@types/credential'
import { issueSocialVerifiableCredentials, issueVerifiableCredentials } from '@/lib/vessApi'

export interface SubjectUniqueInput {
  id: string
  [key: string]: any
}
export interface IssueCredentialRequest {
  issuerAddress: string
  credTypeName: string
  commonContent: any
  holders: SubjectUniqueInput[]
  credentialItemId: string
  expirationDate?: string
}

export interface IssueSocialCredentialRequest {
  userId: string
  commonContent: any
  holders: SubjectUniqueInput[]
  credentialItemId: string
  expirationDate?: string
}

export interface saveCredentialToDBResponse {
  vc: any
}

export const useMyVerifiableCredential = () => {
  const queryClient = useQueryClient()
  const { showLoading, closeLoading } = useVESSLoading()
  const { did } = useVESSAuthUser()

  const issue = async (
    item: VSCredentialItemFromBuckup | OBCredentialItemFromBackup,
  ): Promise<boolean> => {
    if (!did) {
      return false
    }
    showLoading()
    try {
      const type = item.credentialType?.name ? (item.credentialType?.name as CredType) : 'default'
      const workspace = item.organization
      const user = item.user
      console.log({ item })

      let commonContent
      switch (type) {
        case 'attendance':
          const attendance = item as VSCredentialItemFromBuckup
          commonContent = {
            eventId: attendance.id,
            eventName: attendance.title,
            eventIcon: attendance.image,
            startDate: attendance.startDate ? attendance.startDate : '',
            endDate: attendance.endDate ? attendance.endDate : '',
            sticker:
              attendance.sticker && attendance.sticker.length > 0
                ? attendance.sticker.map((s) => s.image)
                : undefined,
          }
          break
        case 'membership':
          const membership = item as VSCredentialItemFromBuckup
          commonContent = {
            organizationName: workspace?.name,
            organizationId: workspace?.id,
            organizationIcon: workspace?.icon || '',
            membershipName: membership.title,
            membershipIcon: membership.image,
            startDate: membership.startDate ? membership.startDate : '',
            endDate: membership.endDate ? membership.endDate : '',
            sticker:
              membership.sticker && membership.sticker.length > 0
                ? membership.sticker.map((s) => s.image)
                : undefined,
          }
          break
        case 'certificate':
          const certificate = item as VSCredentialItemFromBuckup
          commonContent = {
            certificationId: certificate.id,
            certificationName: certificate.title,
            image: certificate.image || '',
            startDate: certificate.startDate ? certificate.startDate : '',
            endDate: certificate.endDate ? certificate.endDate : '',
            sticker:
              certificate.sticker && certificate.sticker.length > 0
                ? certificate.sticker.map((s) => s.image)
                : undefined,
          }
          break

        case 'openbadge':
          const openbadge = item as OBCredentialItemFromBackup
          commonContent = {
            name: openbadge.name,
            description: openbadge.description,
            criteria: openbadge.criteria,
            image: openbadge.image,
            achievementType: openbadge.achievementType,
            activityStartDate: openbadge.activityStartDate,
            activityEndDate: openbadge.activityEndDate,
            validFrom: openbadge.validFrom,
            validUntil: openbadge.validUntil,
          }
          break

        default:
          const defaultCredential = item as VSCredentialItemFromBuckup
          commonContent = {
            name: defaultCredential.title,
            image: defaultCredential.icon || defaultCredential.image || '',
            description: defaultCredential.description || '',
            primaryColor: defaultCredential.primaryColor || '',
            startDate: defaultCredential.startDate ? defaultCredential.startDate : '',
            endDate: defaultCredential.endDate ? defaultCredential.endDate : '',
            itemId: defaultCredential.id,
            sticker:
              defaultCredential.sticker && defaultCredential.sticker.length > 0
                ? defaultCredential.sticker.map((s) => s.image)
                : undefined,
          }
          break
      }

      const subjectUniqueInput = {
        id: did,
      }

      let res: Response | undefined
      if (workspace) {
        const body: IssueCredentialRequest = {
          issuerAddress: workspace.address,
          credTypeName: type,
          commonContent: commonContent,
          holders: [subjectUniqueInput],
          credentialItemId: item.id,
          expirationDate: undefined,
        }
        res = await issueVerifiableCredentials(body)
      } else if (user) {
        const body: IssueSocialCredentialRequest = {
          userId: user.id,
          commonContent: commonContent,
          holders: [subjectUniqueInput],
          credentialItemId: item.id,
          expirationDate: undefined,
        }
        console.log({ body })
        res = await issueSocialVerifiableCredentials(body)
      } else {
        throw new Error('workspace or user is undefined')
      }
      if (!res) {
        throw new Error('res is undefined')
      }
      const resJson = await res.json()
      console.log({ resJson })
      const vcs = resJson.data as saveCredentialToDBResponse[]
      console.log({ vcs })
      queryClient.invalidateQueries(['credItem', item.id])
      queryClient.invalidateQueries(['obCredItem', item.id])
      queryClient.invalidateQueries(['CredentialsByHolder', did])
      if (vcs && vcs.length > 0) {
        closeLoading()
        return true
      }
      closeLoading()
      return false
    } catch (error) {
      console.error('error', error)
      closeLoading()
      return false
    }
  }
  return {
    issue,
  }
}
