const Village = require('../lib/Village');
const Villager = require('../lib/Villager');
const Farmer = require('../lib/professions/Farmer');
const luxon = require('../js/luxon.min.js');

// Has name, creation date
test ('creates a village object', () => {
  let village = new Village({ name: 'Zarma' });

  expect(village.name).toBe('Zarma');
  expect(luxon.DateTime.fromISO(village.founded).isValid).toBeTruthy();

  village = new Village();
  expect(village.name).toBe('Sibon');
});

// Wealth is earned by resource transactions (sales) and reflects overall
// financial prosperity of the village.  May be used to purchase construction
test ('has wealth, earns and spends', () => {
  let village = new Village({ wealth: 80 });

  expect(village.wealth).toBe(80);

  village.earn(100);
  expect(village.wealth).toBe(180);

  // Return false if unable to make transaction
  expect(village.spend(200)).toBeFalsy();
});

// Resources include basic food, basic materials, crafted materials and
// components, crafted novelties and luxuries, composite items 
test ('has basic resources, receives and spends them', () => {
  let sibon = new Village();

  expect(sibon.resources['food']).toBe(0);
  expect(sibon.receive({ 'food': 20 })).toBe({ 'food': 20 });
  expect(sibon.reduce({ 'food': 5 })).toBe({ 'food': 15 });

  expect(sibon.receive({ 'wood': 10, 'stone': 12 }));
  expect(sibon.resources['wood']).toBe(10);
  expect(sibon.count('wood')).toBe(10);
  expect(sibon.resources['stone']).toBe(12);
  expect(sibon.count('stone')).toBe(12);
});

// Experiences weather