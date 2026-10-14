import { ArrowLeft } from 'lucide-react';
import pokeballImage from '../assets/pokeball.svg';
import { getTranslations } from '../i18n/translations';
import './AppHeader.css';

export function AppHeader({
  trackingName,
  onBack,
  team,
  language,
  teamSearchInput,
  setTeamSearchInput,
  teamSuggestions,
  onAddTeamMember,
  searchInput,
  setSearchInput,
  wildSuggestions,
  setTargetQuery,
  wildLoading,
  wildError,
  wildPokemon,
  onDefeatWildPokemon,
  previousTeam,
  onUndo,
  recentWilds
}) {
  const t = getTranslations(language);

  return (
    <div className="header-section">
      <img className="header-pokeball" src={pokeballImage} alt="" aria-hidden="true" />
      <div className="tracking-toolbar">
        <button
          className="tracking-back-button"
          onClick={onBack}
          title={t.manager.back}
          aria-label={t.manager.back}
        >
          <ArrowLeft size={17} aria-hidden="true" />
        </button>
        <h1 className="tracking-title">{trackingName}</h1>
      </div>
      <div className="add-team-box">
        <div className="add-team-header">
          <h2 className="add-team-title">
            <span className="pokemon-wordmark add-team-brand">{t.header.title}</span>
            <span className="add-team-count">{team.length}/6</span>
          </h2>

        </div>

        <input
          type="text"
          value={teamSearchInput}
          placeholder={t.header.addToTeamPlaceholder}
          onChange={(e) => setTeamSearchInput(e.target.value)}
          className="add-team-input"
        />
        {teamSuggestions.length > 0 && (
          <ul className="add-team-suggestions">
            {teamSuggestions.map(name => (
              <li key={name} onClick={() => onAddTeamMember(name)} className="add-team-suggestion">
                + {name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="wild-section">
        <div className="wild-search-box">
          <span className="wild-search-label">{t.header.opponent}</span>
          <input
            type="text"
            value={searchInput}
            placeholder={t.header.wildPlaceholder}
            onChange={(e) => setSearchInput(e.target.value)}
            className="wild-search-input"
          />
          {wildSuggestions.length > 0 && (
            <ul className="wild-suggestions">
              {wildSuggestions.map(name => (
                <li
                  key={name}
                  onClick={() => {
                    setTargetQuery(name);
                    setSearchInput('');
                  }}
                  className="wild-suggestion"
                >
                  {name}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="wild-result-slot">
          {(wildLoading || wildError) && (
            <div className={`wild-status${wildError ? ' is-error' : ''}`} role="status" aria-live="polite">
              {wildError ? t.header.searchError : t.header.loading}
            </div>
          )}

          {wildPokemon && (
            <div className="wild-info">
              <img src={wildPokemon.sprite} alt={wildPokemon.name} className="wild-info-img" />
              <div className="wild-info-content">
                <strong className="wild-info-name">{wildPokemon.name}</strong>
                <div className="wild-info-yields">
                  {wildPokemon.yields.map((y, i) => (
                    <span key={i} className="wild-info-yield">
                      {t.stats[y.stat]} +{y.amount}
                    </span>
                  ))}
                </div>
              </div>

              <div className="wild-info-actions">
                <button
                  onClick={onDefeatWildPokemon}
                  disabled={team.length === 0}
                  className={`wild-action-btn${team.length === 0 ? ' disabled' : ''}`}
                >
                  ⚔️ {t.header.defeat}
                </button>

                <button
                  onClick={onUndo}
                  disabled={!previousTeam}
                  className={`wild-action-btn undo${!previousTeam ? ' disabled' : ''}`}
                  title={previousTeam ? t.header.undoTitle : t.header.noUndoTitle}
                >
                  ↩️ {t.header.undo}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="recent-wilds">
        <span className="recent-wilds-label">{t.header.recent}</span>
        <div className="recent-wilds-list">
          {recentWilds.map(p => (
            <button
              key={p.name}
              onClick={() => setTargetQuery(p.name)}
              className="recent-wild-btn"
              title={p.name}
            >
              <img src={p.sprite} alt={p.name} className="recent-wild-img" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
