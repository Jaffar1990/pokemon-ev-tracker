const translations = {
  it: {
    app: {
      emptyTeam: 'La tua squadra è vuota. Aggiungi dei Pokémon per cominciare!',
      rules: 'Regole:',
      game: 'Gioco:',
      generation: (value) => `Generazione ${value}`,
      language: 'Lingua:',
      italian: 'Italiano',
      english: 'English',
      languageAriaLabel: 'Seleziona lingua',
      importSuccess: 'Progressi importati con successo!',
      invalidFile: 'Formato file non valido.',
      importError: 'Errore nella lettura del file JSON.'
    },
    header: {
      title: 'Pokémon EV Tracker',
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
    manager: {
      kicker: 'Pokémon EV Tracker',
      title: 'I tuoi tracking',
      subtitle: 'Ogni tracking conserva squadra e progressi separatamente.',
      newTracking: 'Nuovo tracking',
      namePlaceholder: 'Es. Avventura su Pokémon Violetto',
      create: 'Crea tracking',
      savedTrackings: 'Tracking salvati',
      empty: 'Ancora nessun tracking. Creane uno per iniziare.',
      rename: 'Rinomina',
      renameLabel: 'Nome del tracking',
      saveName: 'Salva nome',
      cancel: 'Annulla',
      delete: 'Elimina',
      deleteConfirm: (name) => `Eliminare il tracking "${name}" e tutti i suoi progressi?`,
      back: '← Tutti i tracking'
    },
    card: {
      participatesInBattle: 'Partecipa alla lotta',
      toolsMode: 'Seleziona strumento EV',
      vitaminMode: '🧪 Vitamine +10',
      featherMode: '🪶 Piume +1',
      berryMode: '🫐 Bacche -10',
      vitaminTitle: '🧪 VITAMINE (+10 EV)',
      berryTitle: '🫐 BACCHE (-10 EV)',
      machoBrace: 'Crescicappa (x2)',
      pokerus: 'Pokérus (x2)',
      resetConfirm: 'Vuoi davvero azzerare gli EV di {name}?',
      invalidEvs: 'Impossibile salvare: ogni statistica deve essere al massimo di {maxSingle} EV e il totale non può superare {maxTotal} EV.',
      vitaminLimitTitle: 'Raggiunto il limite di 100 EV per la Gen {generation}',
      useVitaminTitle: 'Usa {name} (+10 a {stat})',
      useFeatherTitle: 'Usa {name} (+1 a {stat})',
      useBerryTitle: 'Usa {name} (-10 {stat})',
      nonePowerItem: 'Nessuno',
      edit: 'Modifica EV',
      cancel: 'Annulla modifiche',
      save: 'Salva EV',
      drag: 'Trascina per riordinare'
    },
    feathers: {
      hp: 'Piumasalute',
      attack: 'Piumamuscolo',
      defense: 'Piumaresistenza',
      'special-attack': 'Piumagenio',
      'special-defense': 'Piumaintuito',
      speed: 'Piumavelocità'
    },
    powerItems: {
      weight: 'Vigorpeso (PS)',
      bracer: 'Vigorcerchio (Att)',
      belt: 'Vigorfascia (Dif)',
      lens: 'Vigorlente (AttSp)',
      band: 'Vigorbanda (DifSp)',
      anklet: 'Vigorgliera (Vel)'
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
      attack: 'Att',
      defense: 'Dif',
      'special-attack': 'AttSp',
      'special-defense': 'DifSp',
      speed: 'Vel'
    }
  },
  en: {
    app: {
      emptyTeam: 'Your team is empty. Add some Pokemon to get started!',
      rules: 'Rules:',
      game: 'Game:',
      generation: (value) => `Generation ${value}`,
      language: 'Language:',
      italian: 'Italian',
      english: 'English',
      languageAriaLabel: 'Select language',
      importSuccess: 'Progress imported successfully!',
      invalidFile: 'Invalid file format.',
      importError: 'Error reading the JSON file.'
    },
    header: {
      title: 'Pokémon EV Tracker',
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
    manager: {
      kicker: 'Pokémon EV Tracker',
      title: 'Your trackings',
      subtitle: 'Each tracking keeps its team and progress separate.',
      newTracking: 'New tracking',
      namePlaceholder: 'E.g. Pokémon Violet adventure',
      create: 'Create tracking',
      savedTrackings: 'Saved trackings',
      empty: 'No trackings yet. Create one to get started.',
      rename: 'Rename',
      renameLabel: 'Tracking name',
      saveName: 'Save name',
      cancel: 'Cancel',
      delete: 'Delete',
      deleteConfirm: (name) => `Delete tracking "${name}" and all its progress?`,
      back: '← All trackings'
    },
    card: {
      participatesInBattle: 'Participates in battle',
      toolsMode: 'Select EV item',
      vitaminMode: '🧪 Vitamins +10',
      featherMode: '🪶 Feathers +1',
      berryMode: '🫐 Berries -10',
      vitaminTitle: '🧪 VITAMINS (+10 EV)',
      berryTitle: '🫐 BERRIES (-10 EV)',
      machoBrace: 'Macho Brace (x2)',
      pokerus: 'Pokérus (x2)',
      resetConfirm: 'Are you sure you want to reset {name} EVs?',
      invalidEvs: 'Cannot save: each stat must be at most {maxSingle} EV and the total cannot exceed {maxTotal} EV.',
      vitaminLimitTitle: 'Reached the 100 EV limit for Gen {generation}',
      useVitaminTitle: 'Use {name} (+10 to {stat})',
      useFeatherTitle: 'Use {name} (+1 to {stat})',
      useBerryTitle: 'Use {name} (-10 {stat})',
      nonePowerItem: 'None',
      edit: 'Edit EVs',
      cancel: 'Cancel changes',
      save: 'Save EVs',
      drag: 'Drag to reorder'
    },
    feathers: {
      hp: 'Health Feather',
      attack: 'Muscle Feather',
      defense: 'Resist Feather',
      'special-attack': 'Genius Feather',
      'special-defense': 'Clever Feather',
      speed: 'Swift Feather'
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
