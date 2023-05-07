import { DEFAULT_LNG } from "app/config/config.base";
import { InitOptions } from "i18next";
import EnSource from "./translations/en";
import ViSource from "./translations/vi";

export const availableLng = ["en", "vi"];

export const i18Config: Partial<InitOptions> = {
  lng: DEFAULT_LNG,
  fallbackLng: DEFAULT_LNG,
  returnNull: false,
  resources: {
    en: {
      translation: EnSource,
    },
    vi: {
      translation: ViSource,
    },
  },
};
