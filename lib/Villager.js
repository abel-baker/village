const Item = require('../lib/Item');
const luxon = require('../js/luxon.min.js');


class Villager {
  constructor(obj) {
    // deconstruct properties from parameter object
    ({
      name: this.name = 'Noisome',
      hatched: this.hatched = luxon.DateTime.now().toISO(),
      job: this.job = 'farmer',
      hunger: this.hunger = 0,
      hungry_at: this.hungry_at = 8,
      eats: this.eats = 6,
      wealth: this.wealth = 0,
      inventory: this.inventory = []

    } = obj);
  }

  // Returns whether the villager would eat at this hunger level
  hungry(hunger = this.hunger) {
    return hunger >= this.hungry_at;
  }

  // Lowers hunger and returns the actual number of hunger reduced
  eat(qty = this.eats) {
    let startingHunger = this.hunger;
    this.hunger -= qty;

    if (this.hunger <= 0) this.hunger = 0;
    return startingHunger - this.hunger;
  }

  // Increases wealth by the amount passed and returns new total
  earn(amount) {
    this.wealth += amount;
    return this.wealth;
  }

  // Returns whether the villager can afford the passed item or the
  // padded cost
  afford(item) {
    if (typeof item === 'number') return this.wealth >= item;

    return this.wealth >= item.price;
  }

  // Lowers wealth by the cost; returns false if cost exceeds wealth,
  // otherwise returns new wealth
  spend(price) {
    if (!this.afford(price)) return false;

    this.wealth -= price;
    return this.wealth;
  }

  // Add item to inventory
  gain(item) {
    this.inventory.push(item);
  }

  // Returns true if the item is found in this.inventory
  holds(item) {
    let found = item.foundWithin(this.inventory);

    return found && found.length > 0;
  }

  // Remove the item from this.inventory; returns success
  drop(item) {
    if (!this.holds(item)) return false;

    let found = item.foundWithin(this.inventory);
    this.inventory.splice(found[0], 1);

    return true;
  }

  

}

module.exports = Villager;