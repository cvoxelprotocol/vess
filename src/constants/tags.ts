import type { StylesConfig } from 'react-select'

export type TagOption = {
  value: string
  label: string
}

export const CLIENTS: TagOption[] = [
  { value: 'did:pkh:eip155:1:0xf6dcc520f11ad600da7e01da44e0e70d094ea246', label: 'VESS Labs' },
]

export const TAGS: TagOption[] = [
  { value: 'web3', label: 'web3' },
  { value: 'NFT', label: 'NFT' },
  { value: 'Decentralized Identity', label: 'Decentralized Identity' },
  { value: 'DeFi', label: 'DeFi' },
  { value: 'BCG', label: 'BCG' },
  { value: 'GameFi', label: 'GameFi' },
  { value: 'Ceramic', label: 'Ceramic' },
  { value: 'Ethereum', label: 'Ethereum' },
  { value: 'IPFS', label: 'IPFS' },
  { value: 'Polygon', label: 'Polygon' },
  { value: 'Solana', label: 'Solana' },
]

export const EVENT_TAGS: TagOption[] = [
  { value: 'Conference', label: 'Conference' },
  { value: 'Hackathon', label: 'Hackathon' },
]

export const getTagOption = (tag: string, options?: TagOption[]): TagOption => {
  const tagOp = options?.find((t) => t.value === tag)
  return tagOp ? tagOp : { value: tag, label: tag }
}

export const colourMultiStyles = (
  isDarkMode: boolean,
  hasIcon: boolean = false,
): StylesConfig<TagOption, true> => {
  return {
    container: (base) => ({
      width: '100%',
      paddingLeft: `${hasIcon ? '46px' : base.paddingLeft}`,
    }),
    control: (styles) => ({
      ...styles,
      background: 'none',
      border: 0,
      boxShadow: 'none',
      width: '100%',
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: 'none',
    }),
    input: (base) => ({
      ...base,
      color: `${isDarkMode ? '#ffffff' : '#333333'} !important`,
    }),
    multiValue: (base) => ({
      ...base,
      border: `none`,
      background: 'none',
      margin: 0,
      padding: 0,
    }),
    multiValueLabel: (base) => ({
      ...base,
      color: `${isDarkMode ? '#ffffff' : '#333333'} !important`,
    }),
  }
}

export const colourStyles = (
  isDarkMode: boolean,
  hasIcon: boolean = false,
): StylesConfig<TagOption, false> => {
  return {
    container: (base) => ({
      width: '100%',
      paddingLeft: `${hasIcon ? '46px' : base.paddingLeft}`,
    }),
    control: (styles) => ({
      ...styles,
      background: 'none',
      border: 0,
      margin: 0,
      padding: 0,
      minHeight: 0,
      boxShadow: 'none',
      width: '100%',
    }),
    valueContainer: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorsContainer: (base) => ({
      ...base,
      margin: 0,
      padding: 0,
    }),
    indicatorSeparator: (base) => ({
      ...base,
      display: 'none',
    }),
    dropdownIndicator: (base) => ({
      ...base,
      display: 'none',
    }),
    input: (base) => ({
      ...base,
      color: `${isDarkMode ? '#ffffff' : '#333333'} !important`,
    }),
    singleValue: (base) => ({
      ...base,
      border: `none`,
      background: 'none',
      margin: 0,
      padding: 0,
      color: `${isDarkMode ? '#ffffff' : '#333333'} !important`,
    }),
  }
}
