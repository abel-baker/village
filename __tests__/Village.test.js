const Village = require('../lib/Village');
const Villager = require('../lib/Villager');
const Farmer = require('../lib/professions/Farmer');
const luxon = require('../js/luxon.min.js');


test ('creates a village object', () => {
  let village = new Village({ name: 'Zarma' });

  expect(village.name).toBe('Zarma');
  expect(luxon.DateTime.fromISO(village.founded).isValid).toBeTruthy();

  village = new Village();
  expect(village.name).toBe('Sibon');
});

// Resources include basic food, basic materials, crafted materials and
// components, crafted novelties and luxuries, composite items 
test ('has basic resources, receives and spends them', () => {
  let sibon = new Village();

  expect(sibon.resources['food']).toBe(0);
  expect(sibon.receive({ 'food': 20 })).toBe(20);
  expect(sibon.reduce({'food': 5 })).toBe(15);
});

// Experiences weather