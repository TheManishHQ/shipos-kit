import type { config } from './index'

export type Config = typeof config
export type Locale = keyof typeof config.i18n.locales
export type Theme = (typeof config.ui.enabledThemes)[number]
export type PlanId = keyof typeof config.payments.plans
