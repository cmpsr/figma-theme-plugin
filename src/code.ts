import { MESSAGE_ACTIONS } from './constants';
import { Theme } from './theme';

figma.showUI(__html__, {
  visible: true,
  title: 'Composer Themes',
  width: 352,
  height: 533,
});

figma.ui.onmessage = async (msg) => {
  if (msg.action === MESSAGE_ACTIONS.CLOSE_PLUGIN) {
    figma.closePlugin();
  }
  if (msg.action === MESSAGE_ACTIONS.DOWNLOAD) {
    let theme;
    try {
      theme = new Theme().get();
      figma.ui.postMessage({
        action: MESSAGE_ACTIONS.DOWNLOAD,
        payload: theme,
      });
    } catch (error) {
      figma.notify(error?.message ?? 'Something went wrong', {
        timeout: 10000,
        error: true,
      });
    }
  }
};
