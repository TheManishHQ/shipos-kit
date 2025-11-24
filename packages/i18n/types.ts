import type { config } from "@shipos/config";
import type messages from "./translations/en.json";

export type Messages = typeof messages;

export type Locale = keyof (typeof config)["i18n"]["locales"];
