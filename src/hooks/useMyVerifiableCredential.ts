import { useQueryClient } from '@tanstack/react-query'
import { useDIDAccount } from './useDIDAccount'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CredType, VSCredentialItemFromBuckup } from '@/@types/credential'
import { VC_CREATION_SUCCEED, VC_CREATION_FAILED } from '@/constants/toastMessage'
import { getVESS } from '@/lib/vess'
import { issueVerifiableCredentials } from '@/lib/vessApi'

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
  saveCompose?: boolean
}

export interface saveCredentialToComposeDBResponse {
  vc: any
  ceramicId?: string
}

export const useMyVerifiableCredential = () => {
  const queryClient = useQueryClient()
  const { showToast } = useToast()
  const { showLoading, closeLoading } = useVESSLoading()
  const vess = getVESS()
  const { did } = useDIDAccount()

  const issue = async (item: VSCredentialItemFromBuckup): Promise<boolean> => {
    if (!item.organization) {
      showToast('Failed to receive credential information')
      return false
    }
    if (!did) {
      showToast('You are not logged in')
      return false
    }
    showLoading()
    try {
      const type = item.credentialType.name as CredType
      const workspace = await vess.getOrganization(item.organization.ceramicId)
      console.log({ item })

      let commonContent
      switch (type) {
        case 'attendance':
          commonContent = {
            eventId: item.ceramicId,
            eventName: item.title,
            eventIcon: item.image,
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
          }
          break
        case 'membership':
          commonContent = {
            organizationName: workspace.name,
            organizationId: workspace.id,
            organizationIcon: workspace.icon || '',
            membershipName: item.title,
            membershipIcon: item.image,
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
          }
          break
        case 'certificate':
          commonContent = {
            certificationId: item.ceramicId,
            certificationName: item.title,
            image: item.image || '',
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
          }
          break

        default:
          break
      }

      const subjectUniqueInput = {
        id: did,
      }
      const body: IssueCredentialRequest = {
        issuerAddress: item.organization.address,
        credTypeName: type,
        commonContent: commonContent,
        holders: [subjectUniqueInput],
        credentialItemId: item.id,
        expirationDate: undefined,
        saveCompose: true,
      }
      const res = await issueVerifiableCredentials(body)
      if (!res) {
        throw new Error('res is undefined')
      }
      const resJson = await res.json()
      console.log({ resJson })
      const vcs = resJson.data as saveCredentialToComposeDBResponse[]
      console.log({ vcs })
      queryClient.invalidateQueries(['credItem', item.id])
      if (vcs && vcs.length > 0) {
        closeLoading()
        showToast(VC_CREATION_SUCCEED)
        return true
      }
      closeLoading()
      showToast(VC_CREATION_FAILED)
      return false
    } catch (error) {
      console.error('error', error)
      closeLoading()
      showToast(VC_CREATION_FAILED)
      return false
    }
  }
  return {
    issue,
  }
}
