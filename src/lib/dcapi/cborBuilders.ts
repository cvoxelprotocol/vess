import { encode, Tag } from 'cbor2'

export interface RequestedElement {
  identifier: string
  intentToRetain: boolean
}

// ISO/IEC 18013-5 §8.3.2.1.2.1 DeviceRequest
//
// DeviceRequest = {
//   "version": tstr,
//   "docRequests": [+ DocRequest]
// }
// DocRequest = { "itemsRequest": ItemsRequestBytes, ? "readerAuth": ReaderAuth }
// ItemsRequestBytes = #6.24(bstr .cbor ItemsRequest)
// ItemsRequest = { "docType": DocType, "nameSpaces": NameSpaces, ? "requestInfo": ... }
// NameSpaces = {+ NameSpace => {+ DataElement => IntentToRetain}}
export const buildDeviceRequest = (
  docType: string,
  nameSpace: string,
  elements: RequestedElement[]
): Uint8Array => {
  const dataElements = new Map<string, boolean>()
  for (const el of elements) dataElements.set(el.identifier, el.intentToRetain)

  const nameSpaces = new Map<string, Map<string, boolean>>()
  nameSpaces.set(nameSpace, dataElements)

  const itemsRequest = new Map<string, unknown>()
  itemsRequest.set('docType', docType)
  itemsRequest.set('nameSpaces', nameSpaces)

  const itemsRequestBytes = new Tag(24, encode(itemsRequest))

  const docRequest = new Map<string, unknown>()
  docRequest.set('itemsRequest', itemsRequestBytes)

  const deviceRequest = new Map<string, unknown>()
  deviceRequest.set('version', '1.0')
  deviceRequest.set('docRequests', [docRequest])

  return encode(deviceRequest)
}

// ISO/IEC 18013-7 Annex C EncryptionInfo
//
// EncryptionInfo = ["dcapi", DCAPIEncryptionInfo]
// DCAPIEncryptionInfo = {
//   "nonce": bstr,
//   "recipientPublicKey": COSE_Key
// }
// COSE_Key (P-256) = { 1: 2 (EC2), -1: 1 (P-256), -2: x, -3: y }
export const buildEncryptionInfo = (
  nonce: Uint8Array,
  publicKey: { x: Uint8Array; y: Uint8Array }
): Uint8Array => {
  const coseKey = new Map<number, unknown>()
  coseKey.set(1, 2)
  coseKey.set(-1, 1)
  coseKey.set(-2, publicKey.x)
  coseKey.set(-3, publicKey.y)

  const params = new Map<string, unknown>()
  params.set('nonce', nonce)
  params.set('recipientPublicKey', coseKey)

  return encode(['dcapi', params])
}
