import { MESSAGE_ACTIONS } from './constants';
import { Theme } from './theme';

let theme;
try {
  theme = new Theme().get();
  figma.showUI(__html__, {
    visible: true,
    title: 'Composer Themes',
    width: 352,
    height: 533,
  });
} catch (error) {
  figma.notify('Something went wrong', { timeout: 3000, error: true });
}

figma.ui.onmessage = async (msg) => {
  if (msg.action === MESSAGE_ACTIONS.CLOSE_PLUGIN) {
    figma.closePlugin();
  }
  if (msg.action === MESSAGE_ACTIONS.DOWNLOAD) {
    figma.ui.postMessage({
      action: MESSAGE_ACTIONS.DOWNLOAD,
      payload: theme,
    });
  }
};
