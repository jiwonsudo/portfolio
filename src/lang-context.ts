import { createContext } from 'react';
import type { Lang, StringKey } from './i18n';

export type LangContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggle: () => void;
  t: (key: StringKey) => string;
  /** 팀 규모 문구 */
  team: (size: number) => string;
};

export const LangContext = createContext<LangContextValue | null>(null);
