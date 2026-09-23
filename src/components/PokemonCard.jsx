import { memo, useState, useEffect, useRef } from 'react';
import { calculateTotalEvs, sanitizeManualEvs, EV_LIMITS, POWER_ITEMS, VITAMINS, applyVitamin, BERRIES, applyBerry } from '../utils/evCalculations';
import { getTranslations } from '../i18n/translations';
import './PokemonCard.css';

export const PokemonCard = memo(function PokemonCard({ pokemon, onUpdate, onDelete, onSaveStateForUndo, generation = 8, language = 'it' }) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempEvs, setTempEvs] = useState({ ...pokemon.evs });
  const [isEvolving, setIsEvolving] = useState(false);
  const [toolMode, setToolMode] = useState('vitamin');

  // Cap vitamine: 100 EV per Gen <= 7, nessuno (null) per Gen >= 8
  const maxVitaminCap = generation <= 7 ? 100 : null;
  const totalEvs = calculateTotalEvs(pokemon.evs);
  const tempTotalEvs = calculateTotalEvs(tempEvs);
  const t = getTranslations(language);
  const isVitaminMode = toolMode === 'vitamin';
  const activeTools = isVitaminMode ? VITAMINS : BERRIES;

  // Trova la posizione attuale nella catena evolutiva
  const chain = pokemon.evolutionChain || [pokemon.name];
  const currentEvoIndex = chain.indexOf(pokemon.name);
  // Condizioni per mostrare i tasti
  const canEvolve = chain.length > 1 && currentEvoIndex < chain.length - 1 && currentEvoIndex !== -1;
  const canDevolve = chain.length > 1 && currentEvoIndex > 0;

  // Mappa per tracciare il cambio per ciascuna statistica: { hp: 'increase' | 'decrease' }
  const [changedStatsMap, setChangedStatsMap] = useState({});
  const prevEvsRef = useRef(pokemon.evs);
  const timeoutRef = useRef(null);

  // Rileva qualsiasi variazione di EV (sia in aumento che in diminuzione)
  useEffect(() => {
    const prevEvs = prevEvsRef.current;
    const newChanges = {};

    Object.keys(pokemon.evs).forEach((stat) => {
      const currentVal = pokemon.evs[stat] || 0;
      const prevVal = prevEvs[stat] || 0;

      if (currentVal > prevVal) {
        newChanges[stat] = 'increase'; // Aumento (Vitamine, Lotte)
      } else if (currentVal < prevVal) {
        newChanges[stat] = 'decrease'; // Diminuzione (Bacche)
      }
    });

    if (Object.keys(newChanges).length > 0) {
      setChangedStatsMap(newChanges);

      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      // Rimuove l'evidenziatore dopo 1.5 secondi
      timeoutRef.current = setTimeout(() => {
        setChangedStatsMap({});
      }, 1500);
    }

    prevEvsRef.current = pokemon.evs;
  }, [pokemon.evs]);

  // Clean up del timer alla smontaggio del componente
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // Gestione cambio forma/evoluzione mantenendo gli EV correnti
  const handleEvolutionChange = async (targetName) => {
    setIsEvolving(true);
    try {
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${targetName}`);
      const data = await res.json();

      onUpdate({
        ...pokemon,
        id: data.id,
        name: data.name,
        sprite: data.sprites.front_default
      });
    } catch (err) {
      console.error('Failed to evolve Pokemon:', err);
    } finally {
      setIsEvolving(false);
    }
  };

  const handleSaveEdit = () => {
    const enteredValues = Object.values(tempEvs).map(value => Number(value));
    const totalEnteredEvs = enteredValues.reduce((sum, value) => sum + value, 0);
    const exceedsSingleLimit = enteredValues.some(value => value > EV_LIMITS.MAX_SINGLE);
    const exceedsTotalLimit = totalEnteredEvs > EV_LIMITS.MAX_TOTAL;

    if (exceedsSingleLimit || exceedsTotalLimit) {
      window.alert(t.card.invalidEvs({
        maxSingle: EV_LIMITS.MAX_SINGLE,
        maxTotal: EV_LIMITS.MAX_TOTAL
      }));
      return;
    }

    const cleanEvs = sanitizeManualEvs(tempEvs);
    onUpdate({ ...pokemon, evs: cleanEvs });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setTempEvs({ ...pokemon.evs });
    setIsEditing(false);
  };

  // Usa una Vitamina (+10 EV)
  const handleUseVitamin = (stat) => {
    if (onSaveStateForUndo) onSaveStateForUndo(); // Salva per l'Undo prima di modificare
    const updatedEvs = applyVitamin(pokemon.evs, stat, maxVitaminCap);
    onUpdate({ ...pokemon, evs: updatedEvs });
  };

  // Usa una Bacca (-10 EV)
  const handleUseBerry = (stat) => {
    if (onSaveStateForUndo) onSaveStateForUndo(); // Salva per l'Undo prima di modificare
    const updatedEvs = applyBerry(pokemon.evs, stat);
    onUpdate({ ...pokemon, evs: updatedEvs });
  };

  // Stili dinamici in base al tipo di modifica (Aumento / Diminuzione)
  const getStatClass = (stat) => {
    const changeType = changedStatsMap[stat];

    if (changeType === 'increase') {
      return 'pokemon-card-stat changed-increase';
    }

    if (changeType === 'decrease') {
      return 'pokemon-card-stat changed-decrease';
    }

    return 'pokemon-card-stat';
  };

  return (
      <div className={`pokemon-card ${pokemon.isActive ? 'is-active' : 'is-inactive'}`}>
        {/* Intestazione */}
        <div className="pokemon-card-header">
          <div className="pokemon-card-identity">
            <input
              type="checkbox"
              checked={pokemon.isActive}
              onChange={(e) => onUpdate({ ...pokemon, isActive: e.target.checked })}
              className="pokemon-card-active-toggle"
              title={t.card.participatesInBattle()}
            />
            <img className="pokemon-card-sprite" src={pokemon.sprite} alt={pokemon.name} />
            <div>
              <h4 className="pokemon-card-name">{pokemon.name}</h4>
              <span className="pokemon-card-total">
                {isEditing ? tempTotalEvs : totalEvs}/{EV_LIMITS.MAX_TOTAL} EV
              </span>
            </div>
          </div>

          <div className="pokemon-card-actions">
            {canDevolve && (
              <button className="pokemon-card-evolution pokemon-card-evolution-previous" disabled={isEvolving} onClick={() => handleEvolutionChange(chain[currentEvoIndex - 1])}>◀</button>
            )}
            {canEvolve && (
              <button className="pokemon-card-evolution pokemon-card-evolution-next" disabled={isEvolving} onClick={() => handleEvolutionChange(chain[currentEvoIndex + 1])}>▶</button>
            )}
            <button className="pokemon-card-delete" onClick={() => onDelete(pokemon.instanceId)}>🗑️</button>
          </div>
        </div>

        {/* Griglia EV (3x2) */}
        {!isEditing ? (
          <div className="pokemon-card-stat-grid">
            {Object.entries(pokemon.evs).map(([stat, val]) => {
              const changeType = changedStatsMap[stat];
              return (
              <div
                key={stat}
                className={getStatClass(stat)}
              >
                <span className="pokemon-card-stat-label">{t.stats[stat] || stat}:</span>
                <span className={`pokemon-card-stat-value ${changeType ? 'is-changed' : ''}`}>
                  {val}
                  {changeType === 'increase' && ' ▲'}
                  {changeType === 'decrease' && ' ▼'}
                </span>
              </div>
            )})}
          </div>
        ) : (
          <div className="pokemon-card-edit-grid">
            {Object.entries(tempEvs).map(([stat, val]) => (
              <div key={stat} className="pokemon-card-edit-stat">
                <span className="pokemon-card-edit-label">{t.stats[stat] || stat}:</span>
                <input
                  type="number" min="0" max="252" value={val}
                  onChange={(e) => setTempEvs(prev => ({ ...prev, [stat]: e.target.value }))}
                  className="pokemon-card-edit-input"
                />
              </div>
            ))}
          </div>
        )}

        <div className="pokemon-card-tools-section">
          <div className="pokemon-card-tools-header">
            <div className="pokemon-card-tools-toggle" role="group" aria-label={t.card.toolsMode()}>
              <button
                type="button"
                className={`pokemon-card-tools-toggle-button ${isVitaminMode ? 'is-active' : ''}`}
                aria-pressed={isVitaminMode}
                onClick={() => setToolMode('vitamin')}
              >
                {t.card.vitaminMode()}
              </button>
              <button
                type="button"
                className={`pokemon-card-tools-toggle-button ${!isVitaminMode ? 'is-active is-berry' : ''}`}
                aria-pressed={!isVitaminMode}
                onClick={() => setToolMode('berry')}
              >
                {t.card.berryMode()}
              </button>
            </div>
          </div>

          <div className="pokemon-card-item-grid">
            {activeTools.map(tool => {
              const currentStatEvs = pokemon.evs[tool.stat] || 0;
              const isCapReached = isVitaminMode && maxVitaminCap !== null && currentStatEvs >= maxVitaminCap;
              const isDisabled = isVitaminMode
                ? isCapReached || currentStatEvs >= EV_LIMITS.MAX_SINGLE || totalEvs >= EV_LIMITS.MAX_TOTAL
                : currentStatEvs <= 0;
              const toolName = isVitaminMode ? t.vitamins[tool.stat] : t.berries[tool.stat];

              return (
                <button
                  key={tool.name}
                  type="button"
                  onClick={() => isVitaminMode ? handleUseVitamin(tool.stat) : handleUseBerry(tool.stat)}
                  disabled={isDisabled}
                  className={`pokemon-card-item-button ${isVitaminMode ? 'pokemon-card-vitamin-button' : 'pokemon-card-berry-button'} ${isDisabled ? 'is-disabled' : ''}`}
                  title={isCapReached
                    ? t.card.vitaminLimitTitle({ generation })
                    : isVitaminMode
                      ? t.card.useVitaminTitle({ name: toolName, stat: t.stats[tool.stat] })
                      : t.card.useBerryTitle({ name: toolName, stat: t.stats[tool.stat] })}
                >
                  {t.stats[tool.stat]}
                </button>
              );
            })}
          </div>
        </div>

        {/* Footer Strumenti */}
        <div className="pokemon-card-footer">
          <div className="pokemon-card-held-items">
            <label className="pokemon-card-held-item" title={t.card.machoBrace()}>
              <input type="checkbox" checked={pokemon.hasMachoBrace} onChange={(e) => onUpdate({ ...pokemon, hasMachoBrace: e.target.checked })} /> 🏋️
            </label>
            <label className="pokemon-card-held-item" title={t.card.pokerus()}>
              <input type="checkbox" checked={pokemon.hasPokerus} onChange={(e) => onUpdate({ ...pokemon, hasPokerus: e.target.checked })} /> 🦠
            </label>
          </div>

          <select
            value={pokemon.powerItemKey || 'none'}
            onChange={(e) => onUpdate({ ...pokemon, powerItemKey: e.target.value })}
            className="pokemon-card-power-select"
          >
            {Object.entries(POWER_ITEMS).map(([key]) => (
              <option key={key} value={key}>{key === 'none' ? t.card.nonePowerItem() : t.powerItems[key]}</option>
            ))}
          </select>

          {!isEditing ? (
            <button className="pokemon-card-edit-button" title={t.card.edit()} onClick={() => { setTempEvs({...pokemon.evs}); setIsEditing(true); }}>✏️</button>
          ) : (
            <div className="pokemon-card-edit-actions">
              <button className="pokemon-card-cancel-button" title={t.card.cancel()} onClick={handleCancelEdit}>✕</button>
              <button className="pokemon-card-save-button" title={t.card.save()} onClick={handleSaveEdit}>✓</button>
            </div>
          )}
        </div>
      </div>
    );
});