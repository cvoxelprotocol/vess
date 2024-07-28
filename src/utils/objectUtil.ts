import { isDIDstring, ETH_CHAIN_ID } from '@/utils/did'
export const removeUndefined = <T extends {}>(object: T): T => {
  return Object.fromEntries(Object.entries(object).filter(([_, v]) => v !== undefined)) as T
}

export const removeUndefinedFromArray = <T>(arr: Array<T | undefined | null>): Array<T> => {
  return arr.filter((a) => a !== undefined) as Array<T>
}

export const shortenStr = (str?: string, length = 20): string => {
  if (!str) return ''
  const half = Math.floor(length / 2)
  const remaining = half - 3 - length
  return str.length <= length ? str : `${str.slice(0, half)}...${str.slice(remaining)}`
}

export const shortenStrWithEndDots = (str?: string, length = 20): string => {
  if (!str) return ''
  return str.length <= length ? str : `${str.slice(0, length)}...`
}

export const shortHash = (hash?: string, maxLength: number = 20) => {
  if (!hash) return ''
  const half = Math.floor(maxLength / 2)
  const remaining = half - maxLength
  return hash.length <= maxLength ? hash : `${hash.slice(0, half)}...${hash.slice(remaining)}`
}

export const renameType = (obj: { id?: string | undefined } & { [x: string]: any }) => {
  const keyValues = Object.keys(obj).map((key) => {
    if (key === 'type') {
      return { ['_type']: obj[key] }
    } else {
      return { [key]: obj[key] }
    }
  })
  return Object.assign({}, ...keyValues)
}

export const getAddressFromPkhForWagmi = (did?: string): `0x${string}` | undefined => {
  if (!did) return
  if (!isDIDstring(did)) {
    return
  }
  return `0x${did.replace(`did:pkh:${ETH_CHAIN_ID}0x`, '')}`
}

export const dataURLtoFile = (dataurl: string, filename: string): File | null => {
  const [header, base64Data] = dataurl.split(',')
  if (!header || !base64Data) return null

  const mimeMatch = header.match(/:(.*?);/)
  if (!mimeMatch || mimeMatch.length < 2) return null

  const mime = mimeMatch[1]
  if (!mime) return null

  const binaryString = Buffer.from(base64Data, 'base64').toString('binary')
  const u8arr = Uint8Array.from(binaryString, (c) => c.charCodeAt(0))

  return new File([u8arr], filename, { type: mime })
}

export const loadImage = (url?: string): Promise<HTMLImageElement | undefined> => {
  return new Promise((resolve, reject) => {
    if (!url) return resolve(undefined)
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.crossOrigin = 'Anonymous'
    img.src = url
  })
}

export const loadImageWithoutCache = async (
  url?: string,
): Promise<HTMLImageElement | undefined> => {
  return await loadImage(`${url}?rd=${new Date().getTime().toString()}`)
}

export const loadImageWithoutCacheWithMetadata = async (
  url?: string,
): Promise<ImageWithSize | undefined> => {
  if (!url) return
  try {
    const image = await loadImage(`${url}?rd=${new Date().getTime().toString()}`)
    return {
      image,
      width: image?.naturalWidth ?? 0,
      height: image?.naturalHeight ?? 0,
      aspectRatio: (image?.naturalWidth ?? 0) / (image?.naturalHeight ?? 0),
    }
  } catch (error) {
    console.error('loadImageWithoutCacheWithMetadata error: ', error)
    return
  }
}

type ImageSize = {
  width: number
  height: number
  aspectRatio: number
}

export type ImageWithSize = ImageSize & {
  image: HTMLImageElement | undefined
}

export type NonNullableRecursive<T> = T extends (infer U)[]
  ? NonNullableRecursive<U>[]
  : T extends Map<infer K, infer V>
  ? Map<K, NonNullableRecursive<V>>
  : T extends object
  ? { [K in keyof T]: NonNullableRecursive<T[K]> }
  : T

export const convertNullToUndefined = <T>(
  value: T | null | undefined,
): NonNullableRecursive<T> | undefined => {
  if (value === null || value === undefined) {
    return undefined
  }

  if (Array.isArray(value)) {
    return value.map((item) => convertNullToUndefined(item)) as unknown as NonNullableRecursive<T>
  }

  if (value instanceof Map) {
    const newMap = new Map()
    value.forEach((v, k) => {
      newMap.set(k, convertNullToUndefined(v))
    })
    return newMap as unknown as NonNullableRecursive<T>
  }

  if (typeof value === 'object' && value !== null) {
    const newObj: any = {}
    Object.keys(value).forEach((key) => {
      newObj[key] = convertNullToUndefined((value as any)[key])
    })
    return newObj as NonNullableRecursive<T>
  }

  return value as NonNullableRecursive<T>
}
