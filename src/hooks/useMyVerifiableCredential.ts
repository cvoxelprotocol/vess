import { useQueryClient } from '@tanstack/react-query'
import { useVESSAuthUser } from './useVESSAuthUser'
import { useVESSLoading } from './useVESSLoading'
import { CredType, VSCredentialItemFromBuckup } from '@/@types/credential'
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
  const { showLoading, closeLoading } = useVESSLoading()
  const { did } = useVESSAuthUser()

  const issue = async (item: VSCredentialItemFromBuckup): Promise<boolean> => {
    if (!item.organization) {
      return false
    }
    if (!did) {
      return false
    }
    showLoading()
    try {
      const type = item.credentialType.name as CredType
      const workspace = item.organization
      console.log({ item })

      let commonContent
      switch (type) {
        case 'attendance':
          commonContent = {
            eventId: !!item.ceramicId && item.ceramicId !== '' ? item.ceramicId : item.id,
            eventName: item.title,
            eventIcon: item.image,
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
          }
          break
        case 'membership':
          commonContent = {
            organizationName: workspace.name,
            organizationId: workspace.ceramicId || workspace.id,
            organizationIcon: workspace.icon || '',
            membershipName: item.title,
            membershipIcon: item.image,
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
          }
          break
        case 'certificate':
          commonContent = {
            certificationId: !!item.ceramicId && item.ceramicId !== '' ? item.ceramicId : item.id,
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
        issuerAddress: workspace.address,
        credTypeName: type,
        commonContent: commonContent,
        holders: [subjectUniqueInput],
        credentialItemId: item.id,
        expirationDate: undefined,
        saveCompose: workspace.useCompose || false,
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
