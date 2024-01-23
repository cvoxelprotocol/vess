import '@emotion/react'

declare module '@emotion/react' {
  interface Theme {
    schemes: ADSColors
    typography: Typographies
    effects: Effects
  }
}

export interface PrimitiveTheme {
  prim: {
    colors: PrimitiveColors
  }
}

export interface PrimitiveColors {
  black: string
  white: string
  primary0: string
  primary10: string
  primary20: string
  primary25: string
  primary30: string
  primary35: string
  primary40: string
  primary50: string
  primary60: string
  primary70: string
  primary80: string
  primary90: string
  primary95: string
  primary98: string
  primary99: string
  primary100: string
  secondary0: string
  secondary10: string
  secondary20: string
  secondary25: string
  secondary30: string
  secondary35: string
  secondary40: string
  secondary50: string
  secondary60: string
  secondary70: string
  secondary80: string
  secondary90: string
  secondary95: string
  secondary98: string
  secondary99: string
  secondary100: string
  tertiary0: string
  tertiary10: string
  tertiary20: string
  tertiary25: string
  tertiary30: string
  tertiary35: string
  tertiary40: string
  tertiary50: string
  tertiary60: string
  tertiary70: string
  tertiary80: string
  tertiary90: string
  tertiary95: string
  tertiary98: string
  tertiary99: string
  tertiary100: string
  error0: string
  error10: string
  error20: string
  error25: string
  error30: string
  error35: string
  error40: string
  error50: string
  error60: string
  error70: string
  error80: string
  error90: string
  error95: string
  error98: string
  error99: string
  error100: string
  neutral0: string
  neutral4: string
  neutral6: string
  neutral10: string
  neutral12: string
  neutral17: string
  neutral20: string
  neutral22: string
  neutral25: string
  neutral30: string
  neutral35: string
  neutral40: string
  neutral50: string
  neutral60: string
  neutral70: string
  neutral80: string
  neutral90: string
  neutral92: string
  neutral94: string
  neutral95: string
  neutral96: string
  neutral98: string
  neutral99: string
  neutral100: string
  neutralVariant0: string
  neutralVariant10: string
  neutralVariant20: string
  neutralVariant25: string
  neutralVariant30: string
  neutralVariant35: string
  neutralVariant40: string
  neutralVariant50: string
  neutralVariant60: string
  neutralVariant70: string
  neutralVariant80: string
  neutralVariant90: string
  neutralVariant95: string
  neutralVariant98: string
  neutralVariant99: string
  neutralVariant100: string
}

export interface ADSColors {
  light: SemanticColors
  dark: SemanticColors
}

export interface SemanticColors {
  surfaceTint: string
  primary: string
  primaryHovered: string
  primaryFocused: string
  onPrimary: string
  primaryContainer: string
  primaryContainerLight: string
  primaryContainerLightest: string
  onPrimaryContainer: string
  secondary: string
  secondaryHovered: string
  secondaryFocused: string
  onSecondary: string
  secondaryContainer: string
  secondaryContainerLight: string
  secondaryContainerLightest: string
  onSecondaryContainer: string
  tertiary: string
  onTertiary: string
  tertiaryContainer: string
  onTertiaryContainer: string
  error: string
  onError: string
  errorContainer: string
  onErrorContainer: string
  background: string
  onBackground: string
  surface: string
  onSurface: string
  surfaceVariant: string
  onSurfaceVariant: string
  outline: string
  outlineVariant: string
  shadow: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
  surfaceContainerHighest: string
  surfaceContainerHigh: string
  surfaceContainer: string
  surfaceContainerLow: string
  surfaceContainerLowest: string
  white: string
  black: string

  // These will be depricated
  scrim?: string
  primaryContainerOpacity10: string
  primaryContainerOpacity20: string
  primaryContainerOpacity40: string
  onPrimaryContainerOpacity10: string
  onPrimaryContainerOpacity20: string
  onPrimaryContainerOpacity40: string
  surface1: string
  surface2: string
  surface3: string
  surface4: string
  surface5: string
  depth1: string
  depth2: string
  depth3: string
  depth4: string
  bodyBackground: string
}

export interface Font {
  fontFamily: string
  fontSize: string
  lineHeight: string
  fontWeight: number
}

export interface Typographies {
  en: Typography
  ja: Typography
}

export interface Typography {
  display: TypoCategory
  headLine: TypoCategory
  title: TypoCategory
  label: TypoCategory
  body: TypoCategory
  bodyBold: TypoCategory
}

export interface TypoCategory {
  exLarge?: Font
  large: Font
  medium: Font
  small: Font
}

export interface Effects {
  cardShadow: string
}
