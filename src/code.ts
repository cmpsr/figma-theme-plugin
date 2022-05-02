import { MESSAGE_ACTIONS } from './constants';
import { Theme } from './theme';

try {
  const theme = new Theme().get();
  figma.notify('Theme has been extracted successfully ✅', { timeout: 3000 });
  figma.showUI(__html__, { visible: false });
  figma.ui.postMessage({
    action: MESSAGE_ACTIONS.DOWNLOAD,
    payload: theme,
  });
} catch (error) {
  figma.notify('Something went wrong', { timeout: 3000, error: true });
}

figma.ui.onmessage = async (msg) => {
  if (msg.action === MESSAGE_ACTIONS.CLOSE_PLUGIN) {
    figma.closePlugin();
  }
};
