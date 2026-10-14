# Pokémon EV Tracker

Pokémon EV Tracker is a React application for tracking Effort Values (EVs) while training Pokémon teams. It uses the [PokeAPI](https://pokeapi.co/) for Pokémon data, sprites, evolution chains and current EV yields, with local overrides for selected historical game differences.

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

1. Create a named tracking from the tracking manager and open it. Trackings keep their teams, game selection and recent opponents separate.
2. Use **Add to team** to search for a Pokémon and add it to the team.
3. Select the game group in the footer. Its generation is derived automatically and used for the EV rules.
4. Use the **Opponent** search to find a wild Pokémon. Select a result to see its sprite and EV yield.
5. Press **Defeat** to apply the yield to every active team member.
6. Use **Undo** to restore the team to the state before the last EV increase.
7. Select a Pokémon from the recent list or drag a team card by its handle to change the team order. Changes are saved automatically.

Only active team members receive EVs. The checkbox in each card controls whether that Pokemon participates in battles.

### Tracking management

- Create, open, rename and delete named trackings from the tracking manager.
- Each tracking stores its own team, selected game group and recent wild Pokémon.
- New trackings default to **Sword & Shield**.
- Existing single-team data and tracking saves that stored a generation are migrated to a representative game group.

### Supported games

The game selector covers these core-series groups:

- Generation III: Ruby & Sapphire, Emerald, FireRed & LeafGreen.
- Generation IV: Diamond & Pearl, Platinum, HeartGold & SoulSilver.
- Generation V: Black & White, Black 2 & White 2.
- Generation VI: X & Y, Omega Ruby & Alpha Sapphire.
- Generation VII: Sun & Moon, Ultra Sun & Ultra Moon.
- Generation VIII: Sword & Shield, Brilliant Diamond & Shining Pearl.
- Generation IX: Scarlet & Violet.

Let's Go Pikachu/Eevee and Pokémon Legends: Arceus are not included because their training systems do not use the standard EV rules covered by this tracker.

### EV rules and tools

- The per-stat limit is `255 EV` in Generations III-V and `252 EV` from Generation VI onward.
- A team member can have at most `510 EV` in total.
- The **Vitamins +10** mode increases one statistic by up to 10 EV.
- The **Berries -10** mode decreases one statistic by up to 10 EV.
- Buttons are disabled when an operation would have no effect or would exceed a limit.
- In generations 3-7, vitamins are capped at `100 EV` per statistic.
- In generation 8 and later, vitamins can be used up to the normal `252 EV` statistic limit.
- In Generation IV, a berry reduces a stat by 10 EV, or resets it to `100 EV` when it is above 110; in other supported generations it removes up to 10 EV.
- Feathers are available in Generation V and add `1 EV`.
- **Macho Brace** and **Pokerus** each double the EV multiplier when enabled.
- Power items are available from Generation IV. They add `4 EV` in Generations IV-V and `8 EV` from Generation VI onward, before multipliers are applied.

Wild Pokémon use the PokeAPI yield unless a local override exists for that Pokémon and selected game group. Overrides replace the full yield vector. This covers verified historical differences such as Roselia, Misdreavus, Duskull, Dusclops, Blissey, Yanma, Slowking and Watchog in Black & White versus Black 2 & White 2. The card tools show the items available for the selected generation.

### Editing EVs manually

Press the edit button on a card to change the six statistics directly. The total is updated while typing. Press **Save** to apply the values or **Cancel** to discard the changes.

Saving is blocked when a statistic is above that generation's limit or the total is above `510 EV`. Values are not silently clamped during manual editing.

### Import and export

- **Export** downloads the active tracking's team, recent wild Pokémon and game group as a JSON backup.
- **Import** restores a backup into the currently open tracking; the file must contain a `team` array. Recent Pokémon are restored when a `recentWilds` array is present.
- Current backups store the selected `versionGroup`. Older backups with a `generation` field are still accepted and mapped to a representative game group.
- Tracking data and the active tracking are persisted in `localStorage`; language is stored separately.

### Language

Use the language selector in the footer to switch between Italian and English. The selected language is persisted locally and applies to labels, buttons, tooltips, alerts and EV item names.

### Responsive layout

The interface adapts to desktop, tablet and mobile screens:

- The header changes from a multi-column layout to a vertical layout on narrow screens.
- The team grid uses three columns on desktop, two on tablet and one on mobile.
- Card controls have larger touch targets on mobile.
- The footer reorganizes its controls on small screens.
- Search fields use a mobile-safe font size to avoid automatic zoom on iOS Safari.
- The Pokémon title uses a locally bundled display font and a Poké Ball accent.

### Project structure

```text
src/
  assets/
    pokeball.svg
  components/
    AppFooter.jsx / AppFooter.css
    AppHeader.jsx / AppHeader.css
    PokemonCard.jsx / PokemonCard.css
    TrackerManager.jsx / TrackerManager.css
  hooks/
    useLocalStorage.js
    usePokemon.js
    usePokemonSuggestions.js
  i18n/
    translations.js
  utils/
    evCalculations.js
    evYields.js
    gameVersions.js
    pokemonApi.js
tests/
  evData.test.js
```

Pokémon details are cached in memory and in `localStorage`. In-flight searches are cancelled when a newer search starts, preventing stale results from replacing the current one. Local EV yield overrides and the game-version catalog are in `src/utils/evYields.js` and `src/utils/gameVersions.js`.

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

1. Crea un tracking con nome dalla schermata dedicata e aprilo. Ogni tracking conserva separatamente squadra, gioco selezionato e avversari recenti.
2. Usa **Aggiungi alla squadra** per cercare e aggiungere un Pokémon.
3. Seleziona il gruppo di giochi nel footer. La generazione viene ricavata automaticamente e determina le regole EV.
4. Cerca un Pokémon selvatico in **Avversario** e seleziona un risultato per vederne sprite e resa EV.
5. Premi **Sconfiggi** per assegnare gli EV a ogni membro attivo.
6. Usa **Annulla** per ripristinare la squadra allo stato precedente all'ultimo incremento.
7. Seleziona un Pokémon dalla lista dei recenti oppure trascina una card dalla maniglia per cambiare l’ordine. Le modifiche vengono salvate automaticamente.

Ricevono EV solo i membri attivi. La checkbox presente in ogni card stabilisce se il Pokémon partecipa alle lotte.

### Gestione dei tracking

- Dalla schermata dei tracking puoi crearli, aprirli, rinominarli ed eliminarli.
- Ogni tracking salva la propria squadra, il gruppo di giochi selezionato e i Pokémon selvatici recenti.
- I nuovi tracking usano **Spada e Scudo** come gioco predefinito.
- I vecchi dati con una sola squadra e i tracking che salvavano la generazione vengono migrati a un gruppo di giochi rappresentativo.

### Giochi supportati

Il selettore include questi gruppi della serie principale:

- Generazione III: Rubino e Zaffiro, Smeraldo, Rosso Fuoco e Verde Foglia.
- Generazione IV: Diamante e Perla, Platino, Oro HeartGold e Argento SoulSilver.
- Generazione V: Nero e Bianco, Nero 2 e Bianco 2.
- Generazione VI: X e Y, Rubino Omega e Zaffiro Alpha.
- Generazione VII: Sole e Luna, Ultrasole e Ultraluna.
- Generazione VIII: Spada e Scudo, Diamante Lucente e Perla Splendente.
- Generazione IX: Scarlatto e Violetto.

Let's Go Pikachu/Eevee e Leggende Pokémon: Arceus non sono inclusi perché i loro sistemi di allenamento non usano le regole EV standard gestite dal tracker.

### Regole EV e strumenti

- Il limite per statistica è `255 EV` nelle generazioni III-V e `252 EV` dalla generazione VI.
- Ogni membro puo avere al massimo `510 EV` totali.
- La modalita **Vitamine +10** aumenta una statistica fino a 10 EV.
- La modalita **Bacche -10** diminuisce una statistica fino a 10 EV.
- I pulsanti vengono disabilitati quando l'operazione non avrebbe effetto o supererebbe un limite.
- Nelle generazioni 3-7 le vitamine hanno un limite di `100 EV` per statistica.
- Dalla generazione 8 il limite delle vitamine coincide con il limite normale di `252 EV`.
- In generazione IV una bacca rimuove 10 EV oppure riporta la statistica a `100 EV` se supera 110; nelle altre generazioni supportate rimuove fino a 10 EV.
- Le piume sono disponibili in generazione V e aggiungono `1 EV`.
- **Crescicappa** e **Pokerus** raddoppiano ciascuno il moltiplicatore degli EV quando sono attivi.
- I vigorstrumenti sono disponibili dalla generazione IV: aggiungono `4 EV` nelle generazioni IV-V e `8 EV` dalla VI, prima dei moltiplicatori.

Per i Pokémon selvatici si usa la resa PokeAPI, salvo un override locale per il Pokémon e il gruppo di giochi selezionato. Un override sostituisce l'intero vettore EV. Sono coperti cambi storici verificati, tra cui Roselia, Misdreavus, Duskull, Dusclops, Blissey, Yanma, Slowking e Watchog tra Nero/Bianco e Nero 2/Bianco 2. Gli strumenti mostrati nelle card dipendono dalla generazione selezionata.

### Modifica manuale degli EV

Premi il pulsante di modifica della card per cambiare direttamente le sei statistiche. Il totale si aggiorna mentre scrivi. Premi **Salva** per applicare i valori oppure **Annulla** per scartare le modifiche.

Il salvataggio viene bloccato se una statistica supera il limite della generazione oppure se il totale supera `510 EV`. Durante la modifica manuale i valori non vengono corretti silenziosamente.

### Importazione ed esportazione

- **Export** scarica squadra, Pokémon recenti e gruppo di giochi del tracking attivo in un backup JSON.
- **Import** ripristina un backup nel tracking aperto; il file deve contenere un array `team`. I Pokémon recenti vengono ripristinati se è presente `recentWilds`.
- I nuovi backup salvano `versionGroup`. Sono accettati anche i backup precedenti con `generation`, convertita in un gruppo di giochi rappresentativo.
- I tracking e quello attivo vengono salvati in `localStorage`; la lingua è salvata separatamente.

### Lingua

Usa il selettore nel footer per passare tra italiano e inglese. La lingua selezionata viene salvata localmente e applicata a etichette, pulsanti, tooltip, messaggi e nomi degli strumenti EV.

### Layout responsive

L'interfaccia si adatta a desktop, tablet e smartphone:

- L'header passa da piu colonne a una disposizione verticale sugli schermi stretti.
- La squadra usa tre colonne su desktop, due su tablet e una su mobile.
- I controlli delle card hanno aree di tocco piu grandi su mobile.
- Il footer riorganizza i controlli sugli schermi piccoli.
- I campi di ricerca usano una dimensione del testo compatibile con Safari iOS, evitando lo zoom automatico.
- Il titolo Pokémon usa un font display incluso localmente e un dettaglio Poké Ball.

### Struttura del progetto

```text
src/
  assets/pokeball.svg
  components/
    AppFooter.jsx / AppFooter.css
    AppHeader.jsx / AppHeader.css
    PokemonCard.jsx / PokemonCard.css
    TrackerManager.jsx / TrackerManager.css
  hooks/
    useLocalStorage.js
    usePokemon.js
    usePokemonSuggestions.js
  i18n/translations.js
  utils/
    evCalculations.js
    evYields.js
    gameVersions.js
    pokemonApi.js
tests/
  evData.test.js
```

I dettagli dei Pokémon sono memorizzati in cache in memoria e in `localStorage`. Le ricerche in corso vengono annullate quando ne inizia una nuova, evitando che risultati superati sostituiscano quelli correnti. Gli override locali delle rese EV e il catalogo dei giochi si trovano in `src/utils/evYields.js` e `src/utils/gameVersions.js`.
