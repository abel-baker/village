const Item = require('../lib/Item');
const luxon = require('../js/luxon.min.js');


// Has name, value
test ('creates an item object', () => {
  let item = new Item({ name: 'cart', value: 800 });

  expect(item.name).toBe('cart');
  expect(item.value).toEqual(800);
  expect(item.price()).toEqual(800);
  expect(item.price(true)).toEqual(400);
  // expect(Number(item.value)).toBe(800);
});

// Comparison of separate equivalent items
test ('test generic items are equivalent', () => {
  let itemOne = new Item({ name: 'coin', value: 100 });
  let itemTwo = new Item({ name: 'coin', value: 100 });
  let itemThree = new Item({ name: 'candle', value: 100 });

  expect(itemOne.equals(itemTwo)).toBeTruthy();
  expect(itemTwo.equals(itemOne)).toBeTruthy();
  expect(itemOne.equals(itemThree)).toBeFalsy();
  expect(itemTwo.equals(itemThree)).toBeFalsy();
});

// Comparison of separate unique items
test ('test unique items are or are not equivalent', () => {
  let coin = new Item({ id: 'tc', unique: false, name: 'coin', value: 100 });
  let fakeCoin = new Item({ id: 'fc', unique: true, name: 'coin', value: 100 });
  let forgedCoin = new Item({ id: 'fc', unique: true, name: 'coin', value: 100 });

  expect(coin.equals(coin)).toBeTruthy();

  // Cannot match a common item with a unique item
  expect(coin.equals(fakeCoin)).toBeFalsy();
  expect(coin.equals(forgedCoin)).toBeFalsy();
  
  expect(fakeCoin.equals(forgedCoin)).toBeTruthy();
  expect(forgedCoin.equals(fakeCoin)).toBeTruthy();
})

// Find indices for equivalent items in an array
test ('finds items in array by equivalency', () => {
  let coin = new Item({ name: 'coin', value: 100 });
  let candle = new Item({ name: 'candle', value: 100 });
  let pocket = [];
  let inventory = [new Item({ name: 'coin', value: 100 })];

  expect(coin.foundWithin(pocket)).toBeFalsy();

  expect(coin.foundWithin(inventory)).toEqual([0]);
  expect(candle.foundWithin(inventory)).toEqual([]);

  inventory.push(coin,candle);
  expect(coin.foundWithin(inventory)).toEqual([0,1]);
  expect(candle.foundWithin(inventory)).toEqual([2]);
  
  let fakeCoin = new Item({ id: 'fc', unique: true, name: 'coin', value: 100 });
  let forgedCoin = new Item({ id: 'fc', unique: true, name: 'coin', value: 100 });

  pocket.push(fakeCoin);
  // Finding unique items
  expect(fakeCoin.foundWithin(pocket)).toEqual([0]);
  pocket.push(forgedCoin);
  expect(fakeCoin.foundWithin(pocket)).toEqual([0,1]);
  
});

