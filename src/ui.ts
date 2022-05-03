import { MESSAGE_ACTIONS } from './constants';

window.onmessage = async (event: MessageEvent) => {
  const action = event.data?.pluginMessage?.action;
  const payload = event.data?.pluginMessage?.payload;

  if (action === MESSAGE_ACTIONS.DOWNLOAD) {
    const anchor = document.createElement('a');
    const blob = new Blob([JSON.stringify(payload)]);
    anchor.href = URL.createObjectURL(blob);
    anchor.download = 'theme.json';
    anchor.click();
    parent.postMessage(
      {
        pluginMessage: {
          action: MESSAGE_ACTIONS.CLOSE_PLUGIN,
        },
      },
      '*',
    );
  }
};
