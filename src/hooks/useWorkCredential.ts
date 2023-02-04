import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  getVESS,
  formatTransaction,
  formatClient,
  formatWork,
  verifyWorkCredential,
  getPkhDIDFromAddress,
  getAddressFromPkh,
  convertDateToTimestampStr,
} from 'vess-sdk'
import type {
  BaseResponse,
  CustomResponse,
  DeliverableItem,
  WorkCredential,
  WorkSubject,
  WorkCredentialWithId,
} from 'vess-sdk'
import { useToast } from './useToast'
import { useVESSLoading } from './useVESSLoading'
import { CERAMIC_NETWORK } from '@/constants/common'
import {
  WORK_CREDENTIAL_CREATION_FAILED,
  WORK_CREDENTIAL_CREATION_SUCCEED,
  WORK_CREDENTIAL_UPDATE_FAILED,
  WORK_CREDENTIAL_UPDATE_SUCCEED,
} from '@/constants/toastMessage'
import { TransactionLogWithChainId } from '@/interfaces/explore'
import { getFiat } from '@/lib/firebase/fiat'
import { getNetworkSymbol } from '@/utils/networkUtil'

export const useFetchWorkCredential = (streamId?: string) => {
  // const vess = getVESS()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const { data: workCredential, isInitialLoading } = useQuery<WorkCredential | null>(
    ['useFetchWorkCredential', streamId],
    () => vess.getWorkCredential(streamId),
    {
      enabled: !!streamId && streamId !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )
  return { workCredential, isInitialLoading }
}

export const useWorkCredentials = (did?: string) => {
  // const vess = getVESS()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()

  const { data: workCredentials, isInitialLoading } = useQuery<WorkCredentialWithId[]>(
    ['heldWorkCredentials', did],
    () => vess.getHeldWorkCredentials(did),
    {
      enabled: !!did && did !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const { mutateAsync: deleteCRDLs } = useMutation<BaseResponse, unknown, string[]>(
    (param) => vess.deleteWorkCredential(param),
    {
      onSuccess() {},
      onError(error) {
        console.log(error)
      },
      onSettled: () => {
        queryClient.invalidateQueries(['heldWorkCredentials'])
      },
    },
  )

  return {
    workCredentials,
    isInitialLoading,
    deleteCRDLs,
  }
}

export const useWorkCredential = () => {
  const { showLoading, closeLoading } = useVESSLoading()
  const { showToast } = useToast()
  // const vess = getVESS()
  const vess = getVESS(CERAMIC_NETWORK !== 'mainnet')
  const queryClient = useQueryClient()

  const { mutateAsync: issueCRDL } = useMutation<
    CustomResponse<{
      streamId: string | undefined
    }>,
    unknown,
    WorkSubject
  >((param) => vess.issueWorkCredential(param), {
    onSuccess(data) {
      if (data.streamId) {
        closeLoading()
        showToast(WORK_CREDENTIAL_CREATION_SUCCEED)
      } else {
        closeLoading()
        showToast(WORK_CREDENTIAL_CREATION_FAILED)
      }
    },
    onError(error) {
      console.log('error', error)
      closeLoading()
      showToast(WORK_CREDENTIAL_CREATION_FAILED)
    },
    onSettled: () => {
      queryClient.invalidateQueries(['heldWorkCredentials'])
      // refetch  offchain DB
      queryClient.invalidateQueries(['offchainCVoxelMeta'])
    },
  })

  const publish = async (
    address: string,
    selectedTx: TransactionLogWithChainId,
    summary: string,
    detail?: string,
    deliverables?: DeliverableItem[],
    relatedAddresses?: string[],
    genre?: string,
    tags?: string[],
  ) => {
    if (!summary) {
      return null
    }
    if (!vess) {
      showToast(WORK_CREDENTIAL_CREATION_FAILED)
      return null
    }

    if (!genre) {
      showToast(WORK_CREDENTIAL_CREATION_FAILED)
      return null
    }

    showLoading()

    const fiat = await getFiat(
      selectedTx.value,
      selectedTx.tokenSymbol || getNetworkSymbol(selectedTx.chainId),
      selectedTx.tokenDecimal || '18',
      selectedTx.timeStamp,
    )
    const to = selectedTx.to.toLowerCase()
    const from = selectedTx.from.toLowerCase()
    const usr = address.toLowerCase()
    const did = getPkhDIDFromAddress(address)
    const isPayer = from === usr
    const nowTimestamp = convertDateToTimestampStr(new Date())

    // create metadata
    // if from address is contract address and gnosissafe treasury, use following api and get owners as potentialClient
    // https://safe-transaction.rinkeby.gnosis.io/api/v1/safes/0x9576Ab75741201f430223EDF2d24A750ef787591/

    const releted =
      !relatedAddresses || relatedAddresses.length === 0
        ? [from.toLowerCase(), to.toLowerCase()]
        : relatedAddresses.concat([from.toLowerCase(), to.toLowerCase()])
    const uniqRelated = Array.from(new Set(releted))

    const clientDID = getPkhDIDFromAddress(isPayer ? to : from)
    const client = formatClient('DID', clientDID)

    const tx = formatTransaction(
      selectedTx.hash,
      from,
      to,
      isPayer,
      selectedTx.value,
      fiat,
      'USD',
      selectedTx.tokenSymbol || getNetworkSymbol(selectedTx.chainId),
      Number(selectedTx.tokenDecimal) || 18,
      selectedTx.chainId || 1,
      selectedTx.timeStamp,
      [selectedTx.hash],
      uniqRelated,
    )

    const work = formatWork(
      did,
      summary,
      fiat || selectedTx.value,
      '0',
      detail || '',
      genre || '',
      tags || [],
      'OneTime',
      '',
      '',
      '',
      '',
      '',
      nowTimestamp,
    )

    const subject: WorkSubject = {
      work,
      tx,
      deliverables,
      client,
    }
    console.log('subject', JSON.stringify(subject))
    return await issueCRDL(subject)
  }

  const update = async (id: string, newItem: WorkCredential) => {
    try {
      if (!vess) {
        showToast(WORK_CREDENTIAL_UPDATE_FAILED)
        return null
      }

      showLoading()

      await vess.updateWorkCredential(id, newItem)

      closeLoading()
      showToast(WORK_CREDENTIAL_UPDATE_SUCCEED)
      return true
    } catch (error) {
      console.log('error', error)
      closeLoading()
      showToast(WORK_CREDENTIAL_UPDATE_FAILED)
      return false
    }
  }
  const updateWithoutNotify = async (id: string, newItem: WorkCredential) => {
    try {
      if (!vess) {
        showToast(WORK_CREDENTIAL_UPDATE_FAILED)
        return null
      }

      await vess.updateWorkCredential(id, newItem)
      return true
    } catch (error) {
      console.log('error', error)
      return false
    }
  }

  const verify = async (work: WorkCredential) => {
    if (work.signature?.agentSig && work.signature.agentSigner) {
      const address = getAddressFromPkh(work.signature.agentSigner)
      const res = await verifyWorkCredential(work, address, work.signature?.agentSig)
    } else if (work.signature?.holderSig) {
      const address = getAddressFromPkh(work.id)
      if (!address) return
      const res = await verifyWorkCredential(work, address, work.signature?.holderSig)
      console.log(`verify: ${res}`)
    }
  }

  return {
    publish,
    update,
    updateWithoutNotify,
    verify,
    issueCRDL,
  }
}
