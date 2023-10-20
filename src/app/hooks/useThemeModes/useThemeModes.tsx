import { useEffect, useReducer, Dispatch } from 'react';
import { MESSAGE_ACTIONS } from '../../../plugin/constants';
import { Action, State } from './types';

export const SET_AVAILABLE_THEME_MODES = 'SET_AVAILABLE_THEME_MODES';
export const SELECT_THEME_MODE_ID = 'SELECT_THEME_MODE_ID';

const initialState: State = {};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case SET_AVAILABLE_THEME_MODES:
      return { ...state, availableThemeModes: action.payload };
    case SELECT_THEME_MODE_ID:
      return { ...state, selectedThemeModeId: action.payload };
    default:
      return state;
  }
};

export const useThemeModes = (): [State, Dispatch<Action>] => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const actionType = event.data?.pluginMessage?.action;
      const payload = event.data?.pluginMessage?.payload;

      switch (actionType) {
        case MESSAGE_ACTIONS.DOWNLOAD:
          const anchor = document.createElement('a');
          const blob = new Blob([JSON.stringify(payload)]);
          anchor.href = URL.createObjectURL(blob);
          anchor.download = 'theme.json';
          anchor.click();
          break;

        case MESSAGE_ACTIONS.GET_THEME_MODES:
          dispatch({ type: SET_AVAILABLE_THEME_MODES, payload });
          break;

        default:
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const getThemeModes = () => {
    window.parent.postMessage(
      {
        pluginMessage: {
          action: MESSAGE_ACTIONS.GET_THEME_MODES,
        },
      },
      '*'
    );
  };

  useEffect(() => {
    getThemeModes();
  }, []);

  return [state, dispatch];
};
