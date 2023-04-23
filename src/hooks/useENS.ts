import { ENS } from '@ensdomains/ensjs'
import { JsonRpcProvider } from '@ethersproject/providers'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { useProvider } from 'wagmi'
export const useENS = (address?: string) => {
  const provider = useProvider()
  const { data: ensProfile, isInitialLoading } = useQuery(
    ['ensProfile', address],
    () => fetchENS(address),
    {
      enabled: !!address && address !== '',
      staleTime: Infinity,
      cacheTime: 300000,
      retry: false,
    },
  )

  const fetchENS = async (address?: string) => {
    if (!address || !provider) return null
    const ENSInstance = new ENS()
    return (
      (await ENSInstance.withProvider(provider as JsonRpcProvider).getProfile(address, {
        texts: true,
      })) || null
    )
  }

  const ensDiscord = useMemo(() => {
    if (!ensProfile || !ensProfile.records?.texts) return
    return ensProfile.records?.texts.find((t) => t.key === 'com.discord')?.value
  }, [ensProfile])

  const ensTwitter = useMemo(() => {
    if (!ensProfile || !ensProfile.records?.texts) return
    return ensProfile.records?.texts.find((t) => t.key === 'com.twitter')?.value
  }, [ensProfile])

  const ensTelegram = useMemo(() => {
    if (!ensProfile || !ensProfile.records?.texts) return
    return ensProfile.records?.texts.find((t) => t.key === 'org.telegram')?.value
  }, [ensProfile])

  const ensGithub = useMemo(() => {
    if (!ensProfile || !ensProfile.records?.texts) return
    return ensProfile.records?.texts.find((t) => t.key === 'com.github')?.value
  }, [ensProfile])

  const ensAvatar = useMemo(() => {
    if (!ensProfile || !ensProfile.records?.texts) return
    return ensProfile.records?.texts.find((t) => t.key === 'avatar')?.value
  }, [ensProfile])

  return {
    ensProfile,
    isInitialLoading,
    ensDiscord,
    ensTwitter,
    ensTelegram,
    ensGithub,
    ensAvatar,
  }
}
