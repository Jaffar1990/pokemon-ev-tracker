import assert from 'node:assert/strict';
import test from 'node:test';
import { getGenerationForVersionGroup, getVersionGroupForGeneration, getGameVersionName, migrateStoredTrackings } from '../src/utils/gameVersions.js';
import { getEffortYields } from '../src/utils/evYields.js';

test('version groups map to generations and localized game names', () => {
  for (let generation = 3; generation <= 9; generation++) {
    assert.equal(getGenerationForVersionGroup(getVersionGroupForGeneration(generation)), generation);
  }

  assert.equal(getGenerationForVersionGroup('black-white'), 5);
  assert.equal(getGameVersionName('scarlet-violet', 'it'), 'Scarlatto e Violetto');
  assert.equal(getGameVersionName('scarlet-violet', 'en'), 'Scarlet & Violet');
});

test('stored tracking generations migrate to version groups', () => {
  const migrated = migrateStoredTrackings([
    { id: 'old-save', name: 'Old save', generation: 5, team: [] },
    { id: 'new-save', versionGroup: 'platinum', team: [] }
  ]);

  assert.deepEqual(migrated, [
    { id: 'old-save', name: 'Old save', team: [], versionGroup: 'black-2-white-2' },
    { id: 'new-save', team: [], versionGroup: 'platinum' }
  ]);
});

test('local EV overrides distinguish BW from B2W2 and replace the complete yield', () => {
  const apiYield = [{ stat: 'attack', amount: 2 }];
  assert.deepEqual(getEffortYields('watchog', 'black-white', apiYield), [
    { stat: 'attack', amount: 1 }
  ]);
  assert.deepEqual(getEffortYields('watchog', 'black-2-white-2', apiYield), apiYield);
});

test('Gen III historical yields include all awarded stats', () => {
  assert.deepEqual(getEffortYields('misdreavus', 'ruby-sapphire', []), [
    { stat: 'special-attack', amount: 1 },
    { stat: 'special-defense', amount: 1 }
  ]);
  assert.deepEqual(getEffortYields('duskull', 'emerald', []), [
    { stat: 'defense', amount: 1 },
    { stat: 'special-defense', amount: 1 }
  ]);
  assert.deepEqual(getEffortYields('raichu', 'ruby-sapphire', [{ stat: 'speed', amount: 3 }]), [
    { stat: 'speed', amount: 3 }
  ]);
});

test('Slowking yield changes after Generation VII', () => {
  assert.deepEqual(getEffortYields('slowking', 'ultra-sun-ultra-moon', []), [
    { stat: 'special-defense', amount: 3 }
  ]);
  assert.deepEqual(getEffortYields('slowking', 'sword-shield', [
    { stat: 'special-defense', amount: 2 }
  ]), [{ stat: 'special-defense', amount: 2 }]);
});