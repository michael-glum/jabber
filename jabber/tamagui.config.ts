// tamagui.config.ts
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui, createTokens } from 'tamagui'

const jabberTokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    //...defaultConfig.tokens.color,
    // Brand colors for the unhinged vibe
    jabberPurple: '#9333EA',
    jabberPink: '#EC4899',
    jabberYellow: '#FCD34D',
    jabberGreen: '#34D399',
    jabberBlue: '#3B82F6',
    jabberRed: '#EF4444',
    jabberOrange: '#F97316',
    
    // Chaos gradients
    chaosStart: '#9333EA',
    chaosEnd: '#EC4899',
  },
})

export const config = createTamagui({
  ...defaultConfig,
  tokens: jabberTokens,
  onlyAllowShorthands: false,

  themes: {
    light: {
      ...defaultConfig.themes.light,
      background: '#FAFAFA',
      backgroundStrong: '#FFFFFF',
      color: '#18181B',
      color1: '#F4F4F5',
      color2: '#E4E4E7',
      color10: '#71717A',
      borderColor: '#E4E4E7',
      
      // Brand accents
      accent: '#9333EA',
      accentBackground: '#F3E8FF',
      accentForeground: '#9333EA',
    },
    dark: {
      ...defaultConfig.themes.dark,
      background: '#09090B',
      backgroundStrong: '#000000',
      color: '#FAFAFA',
      color1: '#18181B',
      color2: '#27272A',
      color10: '#A1A1AA',
      borderColor: '#27272A',
      
      // Brand accents
      accent: '#A855F7',
      accentBackground: '#1E1B4B',
      accentForeground: '#A855F7',
    },
  },
})

export default config

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
