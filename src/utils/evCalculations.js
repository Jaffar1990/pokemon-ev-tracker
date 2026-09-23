export const EV_LIMITS = {
  MAX_TOTAL: 510,
  MAX_SINGLE: 252
};

// Vigorstrumenti (Power Items) e le stat corrispondenti (+8 EV in Gen 6+)
export const POWER_ITEMS = {
  none: { stat: null, bonus: 0 },
  weight: { stat: 'hp', bonus: 8 },
  bracer: { stat: 'attack', bonus: 8 },
  belt: { stat: 'defense', bonus: 8 },
  lens: { stat: 'special-attack', bonus: 8 },
  band: { stat: 'special-defense', bonus: 8 },
  anklet: { stat: 'speed', bonus: 8 }
};

export const VITAMINS = [
  { name: 'hp', stat: 'hp' },
  { name: 'attack', stat: 'attack' },
  { name: 'defense', stat: 'defense' },
  { name: 'special-attack', stat: 'special-attack' },
  { name: 'special-defense', stat: 'special-defense' },
  { name: 'speed', stat: 'speed' }
];

export const BERRIES = [
  { name: 'hp', stat: 'hp' },
  { name: 'attack', stat: 'attack' },
  { name: 'defense', stat: 'defense' },
  { name: 'special-attack', stat: 'special-attack' },
  { name: 'special-defense', stat: 'special-defense' },
  { name: 'speed', stat: 'speed' }
];

export function calculateTotalEvs(currentEvs) {
  return Object.values(currentEvs).reduce((sum, val) => sum + (Number(val) || 0), 0);
}

export function addEvs(currentEvs, yieldsToAdd, options = {}) {
  const { multiplier = 1, powerItemKey = 'none' } = options;
  const newEvs = { ...currentEvs };
  let currentTotal = calculateTotalEvs(currentEvs);

  // Prepara la mappa di guadagno base dagli EV resi dal selvatico
  const evsGained = {};
  yieldsToAdd.forEach(({ stat, amount }) => {
    evsGained[stat] = (evsGained[stat] || 0) + amount;
  });

  // Aggiungi il bonus fisso del Vigorstrumento (+8 alla stat specifica)
  const powerItem = POWER_ITEMS[powerItemKey];
  if (powerItem && powerItem.stat) {
    evsGained[powerItem.stat] = (evsGained[powerItem.stat] || 0) + powerItem.bonus;
  }

  // Applica i moltiplicatori (Crescicappa / Pokérus) e rispetta i limiti (252 e 510)
  Object.entries(evsGained).forEach(([stat, rawAmount]) => {
    const totalPointsToAdd = rawAmount * multiplier;
    const currentStatVal = Number(newEvs[stat]) || 0;

    const allowedForStat = Math.min(totalPointsToAdd, EV_LIMITS.MAX_SINGLE - currentStatVal);
    const allowedForTotal = Math.min(allowedForStat, EV_LIMITS.MAX_TOTAL - currentTotal);

    if (allowedForTotal > 0) {
      newEvs[stat] = currentStatVal + allowedForTotal;
      currentTotal += allowedForTotal;
    }
  });

  return newEvs;
}

// Funzione per sanificare le modifiche manuali
export function sanitizeManualEvs(newEvs) {
  const sanitized = {};
  let total = 0;

  Object.entries(newEvs).forEach(([stat, rawVal]) => {
    let val = parseInt(rawVal, 10) || 0;
    if (val < 0) val = 0;
    if (val > EV_LIMITS.MAX_SINGLE) val = EV_LIMITS.MAX_SINGLE;

    // Se aggiungendo questo valore si supera il cap totale di 510, riducilo
    if (total + val > EV_LIMITS.MAX_TOTAL) {
      val = EV_LIMITS.MAX_TOTAL - total;
    }

    sanitized[stat] = val;
    total += val;
  });

  return sanitized;
}

export function applyVitamin(currentEvs, stat, maxVitaminCap = null) {
  const currentStatEvs = Number(currentEvs[stat]) || 0;
  const currentTotal = calculateTotalEvs(currentEvs);

  // Se siamo in Gen 3-7 e la stat ha già 100+ EV, la vitamina non ha effetto
  if (maxVitaminCap !== null && currentStatEvs >= maxVitaminCap) {
    return currentEvs;
  }

  // Limite massimo per la stat
  const maxStatLimit = maxVitaminCap !== null
    ? Math.min(maxVitaminCap, EV_LIMITS.MAX_SINGLE)
    : EV_LIMITS.MAX_SINGLE;

  const maxAddByCap = maxStatLimit - currentStatEvs;
  const maxAddByTotal = EV_LIMITS.MAX_TOTAL - currentTotal;
  const maxAddByStat = EV_LIMITS.MAX_SINGLE - currentStatEvs;

  // Calcola la quantità effettiva da aggiungere (max 10)
  const amountToAdd = Math.min(10, maxAddByCap, maxAddByTotal, maxAddByStat);

  if (amountToAdd <= 0) return currentEvs;

  return {
    ...currentEvs,
    [stat]: currentStatEvs + amountToAdd
  };
}

export function applyBerry(currentEvs, stat) {
  const currentStatEvs = Number(currentEvs[stat]) || 0;

  if (currentStatEvs <= 0) return currentEvs;

  // Sottrae 10 EV, portando la statistica al massimo a 0
  const newEvs = Math.max(0, currentStatEvs - 10);

  return {
    ...currentEvs,
    [stat]: newEvs
  };
}