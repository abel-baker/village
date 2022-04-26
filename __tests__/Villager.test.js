const Villager = require('../lib/Villager');
const Farmer = require('../lib/professions/Farmer')
const Item = require('../lib/Item');
const { DateTime, Interval, Duration } = require('../js/luxon.min.js');


// Has name, creation date
test ('creates a villager object', () => {
  let villager = new Villager({ name: 'Alain' });

  expect(villager.name).toBe('Alain');
  expect(DateTime.fromISO(villager.hatched).isValid).toBeTruthy();

  villager = new Villager({});
  expect(villager.name).toBe('Guy');
});

// Has hunger level, food consumption
test ('has hunger level, eats food at 8, recovers hunger', () => {
  const villager = new Villager({ name: 'Antonio', hunger: 8 });

  expect(villager.hunger).toBe(8);
  expect(villager.hungry_at).toBe(8);
  expect(villager.eats).toBe(6);

  expect(villager.hungry()).toBeTruthy();
  expect(villager.hungry(9)).toBeTruthy();
  expect(villager.hungry(5)).toBeFalsy();

  let regained = villager.eat(1);
  expect(villager.hunger).toBe(7);
  expect(regained).toBe(1);

  expect(villager.hungry()).toBeFalsy();

  regained = villager.eat();
  expect(villager.hunger).toBe(1);
  expect(regained).toBe(6);

  regained = villager.eat();
  expect(villager.hunger).toBe(0);
  expect(regained).toBe(1);
});

// Has wealth(, can spend it?)
test ('has wealth, can afford items & can spend money', () => {
  const villager = new Villager({ name: 'Galford' });
  const cart = { name: 'cart', price: 800 };
  const coin = { name: 'coin', price: 100 };

  expect(villager.wealth).toBe(0);
  expect(villager.afford(cart)).toBeFalsy();
  expect(villager.afford(coin)).toBeFalsy();
  expect(villager.afford(800)).toBeFalsy();
  expect(villager.spend(cart.price)).toBeFalsy();
  expect(villager.spend(coin.price)).toBeFalsy();

  let wealth = villager.earn(900);

  expect(villager.wealth).toBe(900);
  expect(villager.afford(cart)).toBeTruthy();
  expect(villager.afford(coin)).toBeTruthy();
  expect(villager.afford(800)).toBeTruthy();
  expect(villager.afford(1200)).toBeFalsy();

  wealth = villager.spend(cart.price);
  
  expect(wealth).toBe(100);
  expect(villager.wealth).toBe(100);
  expect(villager.afford(cart)).toBeFalsy();
  expect(villager.afford(coin)).toBeTruthy();
  expect(villager.spend(cart.price)).toBeFalsy();
});

// Has inventory, can gain items
test ('has an inventory, can receive items', () => {
  const galford = new Villager({ name: 'Galford' });
  const coin = new Item({ name: 'coin', value: 100 });
  const key = new Item({ name: 'key', value: 100 });
  const candle = new Item({ name: 'candle', value: 100 });

  expect(galford.inventory).toEqual([]);
  expect(galford.holds(coin)).toBeFalsy();

  const aragon = new Villager({ name: 'Aragon', inventory: [coin, key] });
  expect(aragon.inventory).toEqual([coin, key]);
  expect(aragon.holds(coin)).toBeTruthy();
  expect(coin.foundWithin(aragon.inventory)).toEqual([0]);
  expect(aragon.holds(key)).toBeTruthy();
  expect(key.foundWithin(aragon.inventory)).toEqual([1]);
  expect(aragon.holds(candle)).toBeFalsy();

  aragon.gain(candle);
  expect(candle.foundWithin(aragon.inventory)).toEqual([2]);
  expect(aragon.holds(candle)).toBeTruthy();
});

// Can lose items
test ('can lose items', () => {
  const coin = new Item({ name: 'coin', value: 100 });
  const key = new Item({ name: 'key', value: 100 });
  const candle = new Item({ name: 'candle', value: 100 });
  const galford = new Villager({ name: 'Galford',
    inventory: [coin, coin, key] });

  // Does not carry item
  expect(galford.drop(candle)).toBeFalsy();

  // Drops only like item
  expect(galford.holds(key)).toBeTruthy();
  expect(galford.drop(key)).toBeTruthy();
  expect(galford.holds(key)).toBeFalsy();
  
  // Drops one of several like items
  expect(galford.holds(coin)).toBeTruthy();
  expect(galford.drop(coin)).toBeTruthy();
  expect(galford.holds(coin)).toBeTruthy();

  expect(galford.drop(coin)).toBeTruthy();
  expect(galford.holds(coin)).toBeFalsy();
});

// Has a present action; can complete it
test (`has an action and can execute it,
  set another action according to priority`, () => {

  let villager = new Villager({ name: 'Galford' });
  
  // No action specified on creation should fallback to idle
  expect(villager.action).toBe('idle');
  // idle in particular returns a certain string; sets action to idle or rest
  expect(villager.completeAction()).toBe('does nothing in particular');
  expect(['idle','rest','eat']).toContain(villager.action);

  // these three possible actions also only lead to these three
  expect(
    ['does nothing in particular',
    'rests and recovers',
    'eats']
  ).toContain(villager.completeAction());
  expect(['idle','rest','eat']).toContain(villager.action);

  villager = new Villager({ name: 'Galford', action: 'lute' });
  expect(villager.completeAction()).toBe('does something inscrutable');

});

// Can form a priority action from passed object
test ('can form priorities from passed object', () => {
  const villager = new Villager({ name: 'Galford' });

  villager.action = villager.priority({ 'rest': 1 });
  expect(villager.action).toBe('rest');
  expect(villager.completeAction()).toBe('rests and recovers');


  expect(villager.action = villager.priority({ 'rest': 1, 'eat': 1 }));
  expect(['rest', 'eat']).toContain(villager.action);
  let completedAction = villager.completeAction();
  expect(
    ['rests and recovers',
    'eats']
  ).toContain(completedAction);
  expect(
    ['does something inscrutable',
    'does nothing in particular',
    'does something farmerly']
  ).not.toContain(completedAction);
});


/// PROFESSION AND INHERITANCE ///

// Has profession, can access its values
test ('can inherit default values from child constructor', () => {
  const farmer = new Farmer();

  expect(farmer.name).toBe('Alain');
  expect(farmer.hungry_at).toBe(6);

  const aragon = new Farmer({ name: 'Aragon' });
  expect(aragon.name).toBe('Aragon');
  expect(aragon.produce).toBe(0);

  const galford = new Farmer({ name: 'Galford' });
  expect(galford.action).toBe('idle');
  expect(galford.completeAction()).toBe('does something farmerly');
});

// Has profession, can complete profession actions
test ('can complete profession actions', () => {
  const farmer = new Farmer();

  expect(farmer.completeAction()).toBe('does something farmerly');

  farmer.action = 'sow';
  expect(farmer.completeAction()).toBe('plows and sows seeds');
});

// Has profession, can form a priority action
test ('can form profession priorities', () => {
  const farmer = new Farmer();

  farmer.action = farmer.priority({ 'sow': 1 });
  expect(farmer.action).toBe('sow');

  farmer.action = farmer.priority({ 'sow': 1, 'eat': 1});
  expect(['sow', 'eat']).toContain(farmer.action);

  let completedAction = farmer.completeAction();
  expect(
    ['plows and sows seeds',
    'eats']
  ).toContain(completedAction);

  expect(
    ['does something inscrutable',
    'does nothing in particular',
    'does something farmerly',
    'rests and recovers']
  ).not.toContain(completedAction);
});


// Has experience value