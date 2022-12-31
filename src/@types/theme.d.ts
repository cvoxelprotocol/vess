import '@emotion/react'

declare module '@emotion/react' {
  interface Theme {
    source: string
    schemes: Schemes
    palettes: Palettes
    typography: Typographies
    customColors: any[]
  }
}
export interface Schemes {
  light: Scheme
  dark: Scheme
}

export interface Scheme {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  secondary: string
  onSecondary: string
  secondaryContainer: string
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
  scrim: string
  inverseSurface: string
  inverseOnSurface: string
  inversePrimary: string
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

export interface Palettes {
  primary: Palette
  secondary: Palette
  tertiary: Palette
  neutral: Palette
  neutralVariant: Palette
  error: Palette
}

export interface Palette {
  hue: number
  chroma: number
  cache: Cache
}

export interface Font {
  fontFamily: string
  fontSize: string
  lineHeight: string
  fontWeight: number
}

export interface Typographies {
  en: Typography
  jp: Typography
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

export interface Cache {}
