# Pokemon EV Tracker

Pokemon EV Tracker is a small React application for tracking Effort Values (EVs) while training a Pokemon team. It uses the [PokeAPI](https://pokeapi.co/) to load Pokemon data, including the EVs awarded by wild Pokemon and their evolution chains.

## English

### Requirements

- Node.js 22
- npm

The project includes an `.nvmrc` file and requires Node 22 through `package.json`.

### Installation and development

```bash
nvm use
npm install
npm run dev
```

Vite starts the development server and prints the local URL in the terminal.

### Production build

```bash
npm run lint
npm run build
npm run preview
```

### Basic workflow

1. Use **Add to team** to search for a Pokemon and add it to the team.
2. Use the **Opponent** search to find a wild Pokemon.
3. Select a result to display its sprite, name and the EVs it awards.
4. Press **Defeat** to apply those EVs to every active team member.
5. Use the **Undo** button to restore the team to the state before the last EV increase.
6. Use the recent Pokemon strip to select one of the last wild Pokemon again.
7. Drag a team card by its handle to change the team order. The order is saved automatically.

Only active team members receive EVs. The checkbox in each card controls whether that Pokemon participates in battles.

### EV rules and tools

- A Pokemon can have at most `252 EV` in one statistic.
- A team member can have at most `510 EV` in total.
- The **Vitamins +10** mode increases one statistic by up to 10 EV.
- The **Berries -10** mode decreases one statistic by up to 10 EV.
- Buttons are disabled when an operation would have no effect or would exceed a limit.
- In generations 3-7, vitamins are capped at `100 EV` per statistic.
- In generation 8 and later, vitamins can be used up to the normal `252 EV` statistic limit.
- **Macho Brace** and **Pokerus** each double the EV multiplier when enabled.
- A selected Power item adds `8 EV` to its associated statistic before multipliers are applied.

The card toggle changes the available tool and its tooltip. In vitamin mode it shows the vitamin that raises each statistic; in berry mode it shows the berry that lowers it.

### Editing EVs manually

Press the edit button on a card to change the six statistics directly. The total is updated while typing. Press **Save** to apply the values or **Cancel** to discard the changes.

Saving is blocked when a statistic is above `252 EV` or the total is above `510 EV`. Values are not silently clamped during manual editing.

### Import and export

- **Export** downloads the current team and recent wild Pokemon as a JSON backup.
- **Import** restores a previously exported backup.
- The import file must contain a `team` array. Recent Pokemon are restored when a `recentWilds` array is present.
- Team data, recent Pokemon, generation and language are persisted in `localStorage`.

### Language

Use the language selector in the footer to switch between Italian and English. The selected language is persisted locally and applies to labels, buttons, tooltips, alerts and EV item names.

### Responsive layout

The interface adapts to desktop, tablet and mobile screens:

- The header changes from a multi-column layout to a vertical layout on narrow screens.
- The team grid uses three columns on desktop, two on tablet and one on mobile.
- Card controls have larger touch targets on mobile.
- The footer reorganizes its controls on small screens.
- Search fields use a mobile-safe font size to avoid automatic zoom on iOS Safari.

### Project structure

```text
src/
  components/
    AppFooter.jsx / AppFooter.css
    AppHeader.jsx / AppHeader.css
    PokemonCard.jsx / PokemonCard.css
  hooks/
    useLocalStorage.js
    usePokemon.js
    usePokemonList.js
    usePokemonSuggestions.js
  i18n/
    translations.js
  utils/
    evCalculations.js
    pokemonApi.js
```

Pokemon details are cached in memory and in `localStorage`. In-flight searches are cancelled when a newer search starts, preventing stale results from replacing the current one.

## Italiano

### Requisiti

- Node.js 22
- npm

Il progetto include il file `.nvmrc` e dichiara Node 22 nel `package.json`.

### Installazione e sviluppo

```bash
nvm use
npm install
npm run dev
```

Vite avvia il server di sviluppo e mostra nel terminale l'URL locale dell'applicazione.

### Build di produzione

```bash
npm run lint
npm run build
npm run preview
```

### Flusso di utilizzo

1. Usa **Aggiungi alla squadra** per cercare e aggiungere un Pokemon.
2. Usa la ricerca **Avversario** per trovare un Pokemon selvatico.
3. Seleziona un risultato per visualizzare sprite, nome ed EV erogati.
4. Premi **Sconfiggi** per assegnare quegli EV a ogni membro attivo della squadra.
5. Usa **Annulla** per ripristinare la squadra allo stato precedente all'ultimo incremento.
6. Usa la lista dei Pokemon recenti per selezionare nuovamente uno degli ultimi avversari.
7. Trascina una card dalla maniglia per cambiare l’ordine della squadra. Il nuovo ordine viene salvato automaticamente.

Ricevono EV solo i membri attivi. La checkbox presente in ogni card stabilisce se il Pokemon partecipa alle lotte.

### Regole EV e strumenti

- Un Pokemon puo avere al massimo `252 EV` in una singola statistica.
- Ogni membro puo avere al massimo `510 EV` totali.
- La modalita **Vitamine +10** aumenta una statistica fino a 10 EV.
- La modalita **Bacche -10** diminuisce una statistica fino a 10 EV.
- I pulsanti vengono disabilitati quando l'operazione non avrebbe effetto o supererebbe un limite.
- Nelle generazioni 3-7 le vitamine hanno un limite di `100 EV` per statistica.
- Dalla generazione 8 il limite delle vitamine coincide con il limite normale di `252 EV`.
- **Crescicappa** e **Pokerus** raddoppiano ciascuno il moltiplicatore degli EV quando sono attivi.
- Un Vigorstrumento selezionato aggiunge `8 EV` alla statistica associata prima dei moltiplicatori.

Il toggle della card cambia lo strumento disponibile e il relativo tooltip. In modalita vitamine mostra la vitamina che aumenta ogni statistica; in modalita bacche mostra la bacca che la diminuisce.

### Modifica manuale degli EV

Premi il pulsante di modifica della card per cambiare direttamente le sei statistiche. Il totale si aggiorna mentre scrivi. Premi **Salva** per applicare i valori oppure **Annulla** per scartare le modifiche.

Il salvataggio viene bloccato se una statistica supera `252 EV` oppure se il totale supera `510 EV`. Durante la modifica manuale i valori non vengono corretti silenziosamente.

### Importazione ed esportazione

- **Export** scarica squadra e Pokemon selvatici recenti in un backup JSON.
- **Import** ripristina un backup precedentemente esportato.
- Il file importato deve contenere un array `team`. L'array `recentWilds` viene ripristinato quando presente.
- Squadra, Pokemon recenti, generazione e lingua vengono salvati in `localStorage`.

### Lingua

Usa il selettore nel footer per passare tra italiano e inglese. La lingua selezionata viene salvata localmente e applicata a etichette, pulsanti, tooltip, messaggi e nomi degli strumenti EV.

### Layout responsive

L'interfaccia si adatta a desktop, tablet e smartphone:

- L'header passa da piu colonne a una disposizione verticale sugli schermi stretti.
- La squadra usa tre colonne su desktop, due su tablet e una su mobile.
- I controlli delle card hanno aree di tocco piu grandi su mobile.
- Il footer riorganizza i controlli sugli schermi piccoli.
- I campi di ricerca usano una dimensione del testo compatibile con Safari iOS, evitando lo zoom automatico.
