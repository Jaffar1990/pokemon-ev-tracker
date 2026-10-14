export const EV_LIMITS = {
  MAX_TOTAL: 510,
  MAX_SINGLE: 252
};

export function getEvRules(generation = 8) {
  return {
    maxTotal: EV_LIMITS.MAX_TOTAL,
    maxSingle: generation <= 5 ? 255 : EV_LIMITS.MAX_SINGLE,
    maxVitaminCap: generation <= 7 ? 100 : null,
    hasFeathers: generation === 5,
    hasPowerItems: generation >= 4,
    powerItemBonus: generation <= 3 ? 0 : generation <= 5 ? 4 : 8
  };
}

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

export const FEATHERS = VITAMINS;

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
  const { multiplier = 1, powerItemKey = 'none', generation = 8 } = options;
  const { maxSingle, maxTotal, powerItemBonus } = getEvRules(generation);
  const newEvs = { ...currentEvs };
  let currentTotal = calculateTotalEvs(currentEvs);

  // Prepara la mappa di guadagno base dagli EV resi dal selvatico
  const evsGained = {};
  yieldsToAdd.forEach(({ stat, amount }) => {
    evsGained[stat] = (evsGained[stat] || 0) + amount;
  });

  // Applica il bonus del Vigorstrumento, se disponibile in questa generazione.
  const powerItem = POWER_ITEMS[powerItemKey];
  if (powerItem && powerItem.stat && powerItemBonus > 0) {
    evsGained[powerItem.stat] = (evsGained[powerItem.stat] || 0) + powerItemBonus;
  }

  // Applica i moltiplicatori e i limiti della generazione selezionata.
  Object.entries(evsGained).forEach(([stat, rawAmount]) => {
    const totalPointsToAdd = rawAmount * multiplier;
    const currentStatVal = Number(newEvs[stat]) || 0;

    const allowedForStat = Math.min(totalPointsToAdd, maxSingle - currentStatVal);
    const allowedForTotal = Math.min(allowedForStat, maxTotal - currentTotal);

    if (allowedForTotal > 0) {
      newEvs[stat] = currentStatVal + allowedForTotal;
      currentTotal += allowedForTotal;
    }
  });

  return newEvs;
}

// Funzione per sanificare le modifiche manuali
export function sanitizeManualEvs(newEvs, generation = 8) {
  const { maxSingle, maxTotal } = getEvRules(generation);
  const sanitized = {};
  let total = 0;

  Object.entries(newEvs).forEach(([stat, rawVal]) => {
    let val = parseInt(rawVal, 10) || 0;
    if (val < 0) val = 0;
    if (val > maxSingle) val = maxSingle;

    if (total + val > maxTotal) {
      val = maxTotal - total;
    }

    sanitized[stat] = val;
    total += val;
  });

  return sanitized;
}

export function applyVitamin(currentEvs, stat, maxVitaminCap = null, generation = 8) {
  const { maxSingle, maxTotal } = getEvRules(generation);
  const currentStatEvs = Number(currentEvs[stat]) || 0;
  const currentTotal = calculateTotalEvs(currentEvs);

  // Se siamo in Gen 3-7 e la stat ha già 100+ EV, la vitamina non ha effetto
  if (maxVitaminCap !== null && currentStatEvs >= maxVitaminCap) {
    return currentEvs;
  }

  // Limite massimo per la stat
  const maxStatLimit = maxVitaminCap !== null
    ? Math.min(maxVitaminCap, maxSingle)
    : maxSingle;

  const maxAddByCap = maxStatLimit - currentStatEvs;
  const maxAddByTotal = maxTotal - currentTotal;
  const maxAddByStat = maxSingle - currentStatEvs;

  // Calcola la quantità effettiva da aggiungere (max 10)
  const amountToAdd = Math.min(10, maxAddByCap, maxAddByTotal, maxAddByStat);

  if (amountToAdd <= 0) return currentEvs;

  return {
    ...currentEvs,
    [stat]: currentStatEvs + amountToAdd
  };
}

export function applyFeather(currentEvs, stat, generation = 5) {
  const { maxSingle, maxTotal, hasFeathers } = getEvRules(generation);
  const currentStatEvs = Number(currentEvs[stat]) || 0;
  const currentTotal = calculateTotalEvs(currentEvs);

  if (!hasFeathers || currentStatEvs >= maxSingle || currentTotal >= maxTotal) {
    return currentEvs;
  }

  return {
    ...currentEvs,
    [stat]: currentStatEvs + 1
  };
}

export function applyBerry(currentEvs, stat, generation = 8) {
  const currentStatEvs = Number(currentEvs[stat]) || 0;

  if (currentStatEvs <= 0) return currentEvs;

  const newEvs = generation === 4 && currentStatEvs > 110
    ? 100
    : Math.max(0, currentStatEvs - 10);

  return {
    ...currentEvs,
    [stat]: newEvs
  };
}