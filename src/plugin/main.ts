import { MESSAGE_ACTIONS } from './constants';
import { Theme } from './theme';

function getThemeModes() {
  try {
    const variableCollection = figma.variables
      .getLocalVariableCollections()
      .find((variableCollection) => variableCollection.name.includes('Composer'));

    if (!variableCollection) {
      throw new Error('No Composer Variable Collection found');
    }

    figma.ui.postMessage({
      action: MESSAGE_ACTIONS.GET_THEME_MODES,
      payload: { modes: variableCollection.modes, defaultModeId: variableCollection.defaultModeId },
    });
  } catch (error) {
    figma.notify(error?.message ?? 'Something went wrong during theme detection', { timeout: 3000 });
  }
}

function downloadTheme(modeId: string) {
  try {
    const theme = new Theme(modeId).get();
    figma.ui.postMessage({
      action: MESSAGE_ACTIONS.DOWNLOAD,
      payload: theme,
    });
  } catch (error) {
    figma.notify(error?.message ?? 'Something went wrong during theme download', { timeout: 3000 });
  }
}

figma.showUI(__html__, {
  visible: true,
  title: 'Composer Themes',
  width: 352,
  height: 524,
});

figma.ui.onmessage = (msg) => {
  switch (msg.action) {
    case MESSAGE_ACTIONS.CLOSE_PLUGIN:
      figma.closePlugin();
      break;
    case MESSAGE_ACTIONS.GET_THEME_MODES:
      getThemeModes();
      break;
    case MESSAGE_ACTIONS.DOWNLOAD:
      downloadTheme(msg.payload.modeId);
      break;
    default:
      figma.notify('Unrecognized action', { timeout: 3000 });
  }
};
