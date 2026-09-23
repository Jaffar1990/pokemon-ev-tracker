import { getTranslations } from '../i18n/translations';
import './AppFooter.css';

export function AppFooter({
  generation,
  setGeneration,
  language,
  setLanguage,
  onExportData,
  onImportData,
  fileInputRef
}) {
  const t = getTranslations(language);

  return (
    <div className="app-footer">
      <div className="rules-row">
        <label className="rules-label">
          {t.app.rules}
        </label>
        <select
          value={generation}
          onChange={(e) => setGeneration(Number(e.target.value))}
          className="rules-select"
        >
          <option value={7}>{t.app.generation7}</option>
          <option value={8}>{t.app.generation8}</option>
        </select>
      </div>

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
