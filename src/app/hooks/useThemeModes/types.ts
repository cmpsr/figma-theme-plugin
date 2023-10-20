import { SELECT_THEME_MODE_ID, SET_AVAILABLE_THEME_MODES } from './useThemeModes';

export type ThemeMode = {
  name: string;
  modeId: string;
};

export type ThemeModes = {
  defaultModeId: string;
  modes: ThemeMode[];
};

export type State = {
  availableThemeModes?: ThemeModes;
  selectedThemeModeId?: string;
};

export type Action =
  | { type: typeof SET_AVAILABLE_THEME_MODES; payload: ThemeModes }
  | { type: typeof SELECT_THEME_MODE_ID; payload: string };
