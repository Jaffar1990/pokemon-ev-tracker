const translations = {
  it: {
    app: {
      emptyTeam: 'La tua squadra è vuota. Aggiungi dei Pokémon per cominciare!',
      rules: 'Regole:',
      generation7: 'Gen 3–7 (Cap Vitamine a 100 EV)',
      generation8: 'Gen 8+ (Vitamine senza Cap / fino a 252 EV)',
      language: 'Lingua:',
      italian: 'Italiano',
      english: 'English',
      languageAriaLabel: 'Seleziona lingua',
      importSuccess: 'Progressi importati con successo!',
      invalidFile: 'Formato file non valido.',
      importError: 'Errore nella lettura del file JSON.'
    },
    header: {
      title: '⚡ EV Tracker',
      export: 'Export',
      import: 'Import',
      exportTitle: 'Esporta salvataggio JSON',
      importTitle: 'Importa salvataggio JSON',
      addToTeamPlaceholder: '+ Aggiungi alla squadra...',
      opponent: 'AVVERSARIO',
      wildPlaceholder: 'Cerca selvatico...',
      loading: 'Caricamento...',
      searchError: 'Pokémon non trovato o errore di rete.',
      defeat: 'Sconfiggi',
      undo: 'Annulla',
      undoTitle: "Annulla l'ultima aggiunta EV",
      noUndoTitle: 'Nessuna azione da annullare',
      recent: 'RECENTI:'
    },
    card: {
      participatesInBattle: 'Partecipa alla lotta',
      toolsMode: 'Seleziona strumento EV',
      vitaminMode: '🧪 Vitamine +10',
      berryMode: '🫐 Bacche -10',
      vitaminTitle: '🧪 VITAMINE (+10 EV)',
      berryTitle: '🫐 BACCHE (-10 EV)',
      machoBrace: 'Crescicappa (x2)',
      pokerus: 'Pokérus (x2)',
      resetConfirm: 'Vuoi davvero azzerare gli EV di {name}?',
      invalidEvs: 'Impossibile salvare: ogni statistica deve essere al massimo di {maxSingle} EV e il totale non può superare {maxTotal} EV.',
      vitaminLimitTitle: 'Raggiunto il limite di 100 EV per la Gen {generation}',
      useVitaminTitle: 'Usa {name} (+10 a {stat})',
      useBerryTitle: 'Usa {name} (-10 {stat})',
      nonePowerItem: 'Nessuno',
      edit: 'Modifica EV',
      cancel: 'Annulla modifiche',
      save: 'Salva EV',
      drag: 'Trascina per riordinare'
    },
    powerItems: {
      weight: 'Vigorpeso (HP)',
      bracer: 'Vigorcerchio (Atk)',
      belt: 'Vigorfascia (Def)',
      lens: 'Vigorlente (Sp.Atk)',
      band: 'Vigorbanda (Sp.Def)',
      anklet: 'Vigorgliera (Speed)'
    },
    vitamins: {
      hp: 'PS-su',
      attack: 'Proteina',
      defense: 'Ferro',
      'special-attack': 'Calcio',
      'special-defense': 'Zinco',
      speed: 'Carburante'
    },
    berries: {
      hp: 'Baccagrana',
      attack: 'Baccalga',
      defense: 'Baccaloquat',
      'special-attack': 'Baccauva',
      'special-defense': 'Baccamelon',
      speed: 'Baccamodoro'
    },
    stats: {
      hp: 'PS',
      attack: 'Atk',
      defense: 'Def',
      'special-attack': 'Sp.Atk',
      'special-defense': 'Sp.Def',
      speed: 'Vel'
    }
  },
  en: {
    app: {
      emptyTeam: 'Your team is empty. Add some Pokemon to get started!',
      rules: 'Rules:',
      generation7: 'Gen 3–7 (Vitamin cap at 100 EV)',
      generation8: 'Gen 8+ (No vitamin cap / up to 252 EV)',
      language: 'Language:',
      italian: 'Italian',
      english: 'English',
      languageAriaLabel: 'Select language',
      importSuccess: 'Progress imported successfully!',
      invalidFile: 'Invalid file format.',
      importError: 'Error reading the JSON file.'
    },
    header: {
      title: '⚡ EV Tracker',
      export: 'Export',
      import: 'Import',
      exportTitle: 'Export JSON save',
      importTitle: 'Import JSON save',
      addToTeamPlaceholder: '+ Add to team...',
      opponent: 'OPPONENT',
      wildPlaceholder: 'Search wild Pokemon...',
      loading: 'Loading...',
      searchError: 'Pokemon not found or network error.',
      defeat: 'Defeat',
      undo: 'Undo',
      undoTitle: 'Undo the last EV increase',
      noUndoTitle: 'No action to undo',
      recent: 'RECENT:'
    },
    card: {
      participatesInBattle: 'Participates in battle',
      toolsMode: 'Select EV item',
      vitaminMode: '🧪 Vitamins +10',
      berryMode: '🫐 Berries -10',
      vitaminTitle: '🧪 VITAMINS (+10 EV)',
      berryTitle: '🫐 BERRIES (-10 EV)',
      machoBrace: 'Macho Brace (x2)',
      pokerus: 'Pokérus (x2)',
      resetConfirm: 'Are you sure you want to reset {name} EVs?',
      invalidEvs: 'Cannot save: each stat must be at most {maxSingle} EV and the total cannot exceed {maxTotal} EV.',
      vitaminLimitTitle: 'Reached the 100 EV limit for Gen {generation}',
      useVitaminTitle: 'Use {name} (+10 to {stat})',
      useBerryTitle: 'Use {name} (-10 {stat})',
      nonePowerItem: 'None',
      edit: 'Edit EVs',
      cancel: 'Cancel changes',
      save: 'Save EVs',
      drag: 'Drag to reorder'
    },
    powerItems: {
      weight: 'Power Weight (HP)',
      bracer: 'Power Bracer (Atk)',
      belt: 'Power Belt (Def)',
      lens: 'Power Lens (Sp.Atk)',
      band: 'Power Band (Sp.Def)',
      anklet: 'Power Anklet (Speed)'
    },
    vitamins: {
      hp: 'HP Up',
      attack: 'Protein',
      defense: 'Iron',
      'special-attack': 'Calcium',
      'special-defense': 'Zinc',
      speed: 'Carbos'
    },
    berries: {
      hp: 'Pomeg Berry',
      attack: 'Kelpsy Berry',
      defense: 'Qualot Berry',
      'special-attack': 'Hondew Berry',
      'special-defense': 'Grepa Berry',
      speed: 'Tamato Berry'
    },
    stats: {
      hp: 'HP',
      attack: 'Atk',
      defense: 'Def',
      'special-attack': 'Sp.Atk',
      'special-defense': 'Sp.Def',
      speed: 'Spe'
    }
  }
};

const interpolate = (text, values = {}) => text.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');

export function getTranslations(language = 'it') {
  const selected = translations[language] || translations.it;

  return {
    ...selected,
    card: Object.fromEntries(
      Object.entries(selected.card).map(([key, value]) => [key, (values) => interpolate(value, values)])
    )
  };
}
