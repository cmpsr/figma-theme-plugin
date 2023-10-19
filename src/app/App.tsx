import React, { useEffect, useState } from 'react';
import { MESSAGE_ACTIONS } from '../plugin/constants';
import './styles/ui.css';

export const App = () => {
  const [availableThemeModes, setAvailableThemeModes] = useState(undefined);
  const [selectedThemeModeId, selectThemeModeId] = useState(undefined);

  useEffect(() => {
    getThemeModes();

    const handleMessage = (event) => {
      const action = event.data?.pluginMessage?.action;
      const payload = event.data?.pluginMessage?.payload;

      if (action === MESSAGE_ACTIONS.DOWNLOAD) {
        const anchor = document.createElement('a');
        const blob = new Blob([JSON.stringify(payload)]);
        anchor.href = URL.createObjectURL(blob);
        anchor.download = 'theme.json';
        anchor.click();
      }

      if (action === MESSAGE_ACTIONS.GET_THEME_MODES) {
        setAvailableThemeModes(payload);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  const closePlugin = () => {
    window.parent.postMessage(
      {
        pluginMessage: {
          action: MESSAGE_ACTIONS.CLOSE_PLUGIN,
        },
      },
      '*'
    );
  };

  const downloadTheme = () => {
    window.parent.postMessage(
      {
        pluginMessage: {
          action: MESSAGE_ACTIONS.DOWNLOAD,
          payload: { modeId: selectedThemeModeId || availableThemeModes?.defaultModeId },
        },
      },
      '*'
    );
  };

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

  return (
    <div>
      <img
        src="https://storage.googleapis.com/ace-vial-240422.appspot.com/plugin-asset.png"
        alt="figma plugin illustration"
        width="100%"
      />
      <div className="column content" style={{ gap: '16px' }}>
        <p className="regular">
          Customize your Composer theme with your brand's colors, fonts, and identity. Here’s how to import your theme
          to Contentful:
        </p>
        <ol className="bold">
          <li>Select the theme you want to download</li>
          <li>Go to Contentful {'>'} Add Content, type: Theme</li>
          <li>Click on “Add Theme”</li>
          <li>Copy and paste code on JSON Editor</li>
        </ol>
        {availableThemeModes && (
          <div className="select-container">
            <label htmlFor="themeModeSelect" className="meta">
              Select your theme
            </label>
            <div className="select-wrapper">
              <select
                className="bold"
                id="themeModeSelect"
                value={selectedThemeModeId || availableThemeModes.defaultModeId}
                onChange={(e) => selectThemeModeId(e.target.value)}
              >
                {availableThemeModes.modes.map(({ name, modeId }) => (
                  <option key={modeId} value={modeId}>
                    {name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <p className="meta">
          Note: Composer Themes is a plugin for{' '}
          <a target="_blank" className="link meta" href="https://www.figma.com/community/file/1117071742977134044">
            Composer Design System
          </a>
        </p>
        <div className="row" style={{ justifyContent: 'end', gap: '12px' }}>
          <button onClick={closePlugin} className="btn secondary-btn">
            Cancel
          </button>
          <button onClick={downloadTheme} className="btn primary-btn">
            Download file
          </button>
        </div>
      </div>
    </div>
  );
};
