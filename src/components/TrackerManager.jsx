import { useState } from 'react';
import { ArrowRight, Check, CircleDot, Pencil, Plus, Trash2, X } from 'lucide-react';
import pokeballImage from '../assets/pokeball.svg';
import { getTranslations } from '../i18n/translations';
import './TrackerManager.css';

export function TrackerManager({ trackings, setTrackings, language, onCreate, onOpen }) {
  const t = getTranslations(language);
  const [newName, setNewName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  const createTracking = (event) => {
    event.preventDefault();
    const name = newName.trim();
    if (!name) return;
    onCreate(name);
    setNewName('');
  };

  const saveName = (id) => {
    const name = editingName.trim();
    if (name) {
      setTrackings(current => current.map(tracking =>
        tracking.id === id ? { ...tracking, name } : tracking
      ));
    }
    setEditingId(null);
  };

  const deleteTracking = (tracking) => {
    if (!window.confirm(t.manager.deleteConfirm(tracking.name))) return;
    setTrackings(current => current.filter(item => item.id !== tracking.id));
  };

  return (
    <main className="tracking-manager">
      <header className="manager-heading">
        <img className="manager-pokeball" src={pokeballImage} alt="" aria-hidden="true" />
        <span className="manager-kicker">
          <CircleDot size={16} aria-hidden="true" />
          <span className="pokemon-wordmark manager-brand">{t.manager.kicker}</span>
        </span>
        <h1>{t.manager.title}</h1>
        <p>{t.manager.subtitle}</p>
      </header>

      <form className="tracking-create-form" onSubmit={createTracking}>
        <label htmlFor="new-tracking-name">{t.manager.newTracking}</label>
        <div className="tracking-create-row">
          <input
            id="new-tracking-name"
            value={newName}
            onChange={event => setNewName(event.target.value)}
            placeholder={t.manager.namePlaceholder}
            maxLength={60}
          />
          <button type="submit" disabled={!newName.trim()}>
            <Plus size={17} aria-hidden="true" />
            {t.manager.create}
          </button>
        </div>
      </form>

      <section className="tracking-list-section" aria-labelledby="tracking-list-title">
        <div className="tracking-list-heading">
          <h2 id="tracking-list-title">{t.manager.savedTrackings}</h2>
          <span>{trackings.length}</span>
        </div>
        {trackings.length === 0 ? (
          <p className="tracking-empty">{t.manager.empty}</p>
        ) : (
          <ul className="tracking-list">
            {trackings.map(tracking => (
              <li className="tracking-row" key={tracking.id}>
                {editingId === tracking.id ? (
                  <form className="tracking-rename-form" onSubmit={event => { event.preventDefault(); saveName(tracking.id); }}>
                    <input
                      autoFocus
                      value={editingName}
                      onChange={event => setEditingName(event.target.value)}
                      maxLength={60}
                      aria-label={t.manager.renameLabel}
                    />
                    <button type="submit" title={t.manager.saveName} aria-label={t.manager.saveName}>
                      <Check size={17} />
                    </button>
                    <button type="button" title={t.manager.cancel} aria-label={t.manager.cancel} onClick={() => setEditingId(null)}>
                      <X size={17} />
                    </button>
                  </form>
                ) : (
                  <button className="tracking-open" onClick={() => onOpen(tracking.id)}>
                    <span className="tracking-open-copy">
                      <strong>{tracking.name}</strong>
                      <small>{t.app.generation(Math.max(3, tracking.generation || 8))} · {tracking.team.length}/6</small>
                    </span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </button>
                )}
                {editingId !== tracking.id && (
                  <div className="tracking-row-actions">
                    <button
                      type="button"
                      title={t.manager.rename}
                      aria-label={`${t.manager.rename}: ${tracking.name}`}
                      onClick={() => { setEditingId(tracking.id); setEditingName(tracking.name); }}
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      type="button"
                      title={t.manager.delete}
                      aria-label={`${t.manager.delete}: ${tracking.name}`}
                      onClick={() => deleteTracking(tracking)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}