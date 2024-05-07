import { useQueryClient } from '@tanstack/react-query'
import { useVESSAuthUser } from './useVESSAuthUser'
import { useVESSLoading } from './useVESSLoading'
import { CredType, VSCredentialItemFromBuckup } from '@/@types/credential'
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
  saveCompose?: boolean
}

export interface IssueSocialCredentialRequest {
  userId: string
  commonContent: any
  holders: SubjectUniqueInput[]
  credentialItemId: string
  expirationDate?: string
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
            organizationName: workspace?.name,
            organizationId: workspace?.ceramicId || workspace?.id,
            organizationIcon: workspace?.icon || '',
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
          commonContent = {
            name: item.title,
            image: item.icon || item.image || '',
            description: item.description || '',
            primaryColor: item.primaryColor || '',
            startDate: item.startDate ? item.startDate : '',
            endDate: item.endDate ? item.endDate : '',
            itemId: item.id,
            ceramicId: item.ceramicId || '',
          }
          break
      }

      const subjectUniqueInput = {
        id: did,
      }
      issueSocialVerifiableCredentials

      let res: Response | undefined
      if (workspace) {
        const body: IssueCredentialRequest = {
          issuerAddress: workspace.address,
          credTypeName: type,
          commonContent: commonContent,
          holders: [subjectUniqueInput],
          credentialItemId: item.id,
          expirationDate: undefined,
          saveCompose: workspace.useCompose || false,
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
