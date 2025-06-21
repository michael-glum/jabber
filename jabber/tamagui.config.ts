// tamagui.config.ts
import { defaultConfig } from '@tamagui/config/v4'
import { createTamagui } from 'tamagui'

export const config = createTamagui({
  ...defaultConfig,
  onlyAllowShorthands: false,

  themes: {
    light: {
      ...defaultConfig.themes.light,
    },
    dark: {
      ...defaultConfig.themes.dark,
    },
  },
})
export default config

export type Conf = typeof config
declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
