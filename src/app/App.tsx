import React from 'react';
import { MESSAGE_ACTIONS } from '../plugin/constants';
import { SELECT_THEME_MODE_ID, useThemeModes } from './hooks/useThemeModes';
import './styles/ui.css';

export const App = () => {
  const [state, dispatch] = useThemeModes();

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
          payload: { modeId: state.selectedThemeModeId || state.availableThemeModes?.defaultModeId },
        },
      },
      '*'
    );
  };

  const renderInstructions = () => {
    const firstInstruction = state.availableThemeModes
      ? 'Select the theme you want to download'
      : 'Click the “Download file” button.';

    const commonInstructions = [
      'Go to Contentful > Add Content, type: Theme',
      'Click on “Add Theme”',
      'Copy and paste code on JSON Editor',
    ];

    return (
      <ol className="bold">
        <li>{firstInstruction}</li>
        {commonInstructions.map((instruction, index) => (
          <li key={index}>{instruction}</li>
        ))}
      </ol>
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
        {renderInstructions()}
        {state.availableThemeModes && (
          <div className="select-container">
            <label htmlFor="themeModeSelect" className="meta">
              Select your theme
            </label>
            <div className="select-wrapper">
              <select
                className="bold"
                id="themeModeSelect"
                value={state.selectedThemeModeId || state.availableThemeModes.defaultModeId}
                onChange={(e) => dispatch({ type: SELECT_THEME_MODE_ID, payload: e.target.value })}
              >
                {state.availableThemeModes.modes.map(({ name, modeId }) => (
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
