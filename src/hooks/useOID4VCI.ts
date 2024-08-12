import {
  CredentialsSupportedDisplay,
  CredentialSupportedV1_0_08,
  EndpointMetadataResult,
  ImageInfo,
  IssuerCredentialSubject,
  MetadataDisplay,
} from '@sphereon/oid4vci-common'
import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { acquireCredential, credentialOffer, getCredentialOffer } from '@/lib/vessDiwApi'

const OFFER_PREFIX = 'openid-credential-offer://?credential_offer='
const OFFER_URI_PREFIX = 'openid-credential-offer://?credential_offer_uri='

export interface AcquireCredentialDto {
  credentialOfferUri: string
  did: string
  pinCode?: string
}

export interface DidBindingCredentialDto {
  didjwk: string
  didpkh: string
}

export interface CredentialResponseDto {
  id: string
  credential: string
}

interface CredentialSubjectDisplay {
  name: string
  key: string
}

export const useOID4VCI = (offerUrl?: string) => {
  const { data: processedOffer, isInitialLoading } = useQuery<credentialOffer | null>(
    ['fetchCredentialOffer', offerUrl],
    () => fetchCredentialOffer(offerUrl),
    {
      enabled: !!offerUrl && offerUrl !== '',
      staleTime: Infinity,
      cacheTime: 300000,
    },
  )

  const fetchCredentialOffer = async (offerUrl?: string) => {
    if (!offerUrl) {
      return null
    }
    console.log('fetchCredentialOffer')
    const formattedOfferUrl = await formatOfferUri(offerUrl)
    try {
      return await getCredentialOffer(formattedOfferUrl)
    } catch (error) {
      console.error({ error })
      throw error
    }
  }

  const issueCredential = async (did: string, pinCode?: string): Promise<CredentialResponseDto> => {
    try {
      if (!offerUrl) {
        throw new Error('No offerUrl')
      }
      const formattedOfferUrl = await formatOfferUri(offerUrl)
      const body: AcquireCredentialDto = {
        credentialOfferUri: formattedOfferUrl,
        did,
        pinCode,
      }
      console.log({ body })
      return await acquireCredential(body)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const credentialConfigType = useMemo(() => {
    if (!processedOffer) {
      return null
    }
    if (processedOffer.credentialOffer?.credential_offer) {
      const credentialOffer = processedOffer.credentialOffer?.credential_offer as any
      const credentialOfferType =
        credentialOffer.credentials && credentialOffer.credentials.length > 0
          ? (credentialOffer.credentials[0] as string)
          : credentialOffer.credential_configuration_ids &&
            credentialOffer.credential_configuration_ids.length > 0
          ? (credentialOffer.credential_configuration_ids[0] as string)
          : null
      return credentialOfferType
    }
    return null
  }, [processedOffer])

  const getOfferUriAndEncode = async (offer: string, prefix: string) => {
    try {
      const withoutPrefix = offer.replace(prefix, '')
      const decoded = decodeURIComponent(withoutPrefix)
      const reEncoded = encodeURIComponent(decoded)
      const processedOffer = `${prefix}${reEncoded}`
      return processedOffer
    } catch (error) {
      throw error
    }
  }

  const formatOfferUri = async (offer: string) => {
    try {
      return offer.startsWith(OFFER_PREFIX)
        ? getOfferUriAndEncode(offer, OFFER_PREFIX)
        : getOfferUriAndEncode(offer, OFFER_URI_PREFIX)
    } catch (error) {
      console.error(error)
      throw error
    }
  }

  const getDisplayInfo = (
    endpointMetadata: EndpointMetadataResult,
    locale: string = 'en-US',
  ): {
    issuerDisplay: MetadataDisplay
    credentialDisplay?: CredentialsSupportedDisplay
    credentialSubjectDisplay: CredentialSubjectDisplay[]
  } | null => {
    const { credentialIssuerMetadata } = endpointMetadata

    // Helper function to get the appropriate display info
    const getAppropriateDisplay = (displays: MetadataDisplay[]): MetadataDisplay => {
      const localeDisplay = displays.find((d) => d.locale === locale)
      const enUSDisplay = displays.find((d) => d.locale === 'en-US')
      return localeDisplay || enUSDisplay || displays[0]
    }

    const getAppropriateSupportedDisplay = (
      displays: CredentialsSupportedDisplay[],
    ): CredentialsSupportedDisplay => {
      const localeDisplay = displays.find((d) => d.locale === locale)
      const enUSDisplay = displays.find((d) => d.locale === 'en-US')
      const selectedDisplay = localeDisplay || enUSDisplay || displays[0]

      // Convert background_image if it's a string
      if (selectedDisplay.background_image) {
        selectedDisplay.background_image = convertToImageInfo(selectedDisplay.background_image)
      }

      return selectedDisplay
    }

    const convertToImageInfo = (input: string | ImageInfo): ImageInfo => {
      if (typeof input === 'string') {
        return { url: input }
      }
      return input
    }

    if (!credentialIssuerMetadata) {
      return null
    }

    // Get issuer display
    const issuerDisplay = getAppropriateDisplay(credentialIssuerMetadata?.display || [])

    let credentialDisplay: CredentialsSupportedDisplay | undefined = undefined
    const credentialSubjectDisplay: CredentialSubjectDisplay[] = []
    if (
      Array.isArray(credentialIssuerMetadata.credentials_supported) &&
      credentialIssuerMetadata.credentials_supported[0]
    ) {
      // Get credential display
      const credentialSUpported =
        credentialIssuerMetadata.credentials_supported as CredentialSupportedV1_0_08[]
      credentialDisplay = getAppropriateSupportedDisplay(credentialSUpported[0]?.display || []) // Assume only one credential supported

      // Get credential subject display
      const credentialSubject = credentialIssuerMetadata.credentials_supported[0]
        .credentialSubject as IssuerCredentialSubject
      console.log({ credentialSubject })
      for (const [key, value] of Object.entries(credentialSubject)) {
        const appropriateDisplay =
          value.display?.find((d) => d.locale === locale) ||
          value.display?.find((d) => d.locale === 'en-US') ||
          value.display?.[0]
        if (appropriateDisplay) {
          credentialSubjectDisplay.push({ key: key, name: appropriateDisplay.name || key })
        }
      }
    } else if (credentialConfigType && credentialIssuerMetadata.credentials_supported) {
      const credentialSupported =
        credentialIssuerMetadata.credentials_supported[credentialConfigType]

      console.log({ credentialConfigType })
      console.log({ credentialSupported })

      // Get credential display
      credentialDisplay = getAppropriateSupportedDisplay(credentialSupported?.display || []) // Assume only one credential supported

      // Get credential subject display
      const credentialSubject = credentialSupported?.credential_definition
        ?.credentialSubject as IssuerCredentialSubject
      console.log({ credentialSubject })
      for (const [key, value] of Object.entries(credentialSubject)) {
        const appropriateDisplay =
          value.display?.find((d) => d.locale === locale) ||
          value.display?.find((d) => d.locale === 'en-US') ||
          value.display?.[0]
        if (appropriateDisplay) {
          credentialSubjectDisplay.push({ key: key, name: appropriateDisplay.name || key })
        }
      }
    }

    return {
      issuerDisplay,
      credentialDisplay,
      credentialSubjectDisplay,
    }
  }

  return {
    processedOffer,
    isInitialLoading,
    getDisplayInfo,
    issueCredential,
  }
}
