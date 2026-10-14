import { getTranslations } from '../i18n/translations';
import { GAME_VERSIONS, normalizeVersionGroup } from '../utils/gameVersions';
import './AppFooter.css';

export function AppFooter({
  versionGroup,
  setVersionGroup,
  language,
  setLanguage,
  onExportData,
  onImportData,
  fileInputRef
}) {
  const t = getTranslations(language);

  return (
    <div className="app-footer">
      {versionGroup !== undefined && (
        <div className="rules-row">
          <label className="rules-label">
            {t.app.game}
          </label>
          <select
            value={normalizeVersionGroup(versionGroup)}
            onChange={(e) => setVersionGroup(e.target.value)}
            className="rules-select"
            aria-label={t.app.game}
          >
            {GAME_VERSIONS.map(game => (
              <option key={game.id} value={game.id}>{game.name[language] || game.name.it}</option>
            ))}
          </select>
        </div>
      )}

      {onExportData && (
        <div className="footer-data-actions">
          <button
            onClick={onExportData}
            title={t.header.exportTitle}
            className="footer-data-button"
          >
            💾 {t.header.export}
          </button>
          <button
            onClick={() => fileInputRef.current?.click()}
            title={t.header.importTitle}
            className="footer-data-button"
          >
            📂 {t.header.import}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={onImportData}
            accept=".json"
            className="import-file-input"
          />
        </div>
      )}

      <div className="language-row">
        <label className="language-label" htmlFor="language-select">
          {t.app.language}
        </label>
        <select
          id="language-select"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="language-select"
          aria-label={t.app.languageAriaLabel}
        >
          <option value="it">{t.app.italian}</option>
          <option value="en">{t.app.english}</option>
        </select>
      </div>
    </div>
  );
}
