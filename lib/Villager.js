const Item = require('../lib/Item');
const { DateTime, Interval, Duration } = require('../js/luxon.min.js');
const EventEmitter = require('events');


class Villager extends EventEmitter {
  constructor({
    name = 'Guy', hatched = DateTime.now().toISO(),
    hunger = 0, hungry_at = 8, eats = 6,
    wealth = 0, inventory = [],
    action = 'idle' }) {
      super();
      
    this.name = name;
    this.hatched = hatched;
    this.job = 'vagabond';
    this.hungry_at = hungry_at;
    this.eats = eats;

    this.wealth = wealth;
    this.inventory = inventory;

    this.hunger = hunger;

    this.action = action;
    this.ticker;

    // Ticker
  }

  /// TICKER ///

  listenTo(ticker) {
    this.ticker = ticker;

    let self = this;
    this.ticker.on('tick', function(tick) {
      console.log(`------------------------------`);
      console.log(`${self.name}: I heard that it's ${tick.toLocaleString(DateTime.TIME_WITH_SECONDS)} (${self.action}/${self.priority()})`);
      console.log(`${self.name} ${self.completeAction()}`);
    });
  }



  /// HUNGER ///

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


  /// WEALTH AND INVENTORY ///

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


  /// ACTIONS AND PRIORITY ///

  // These are the villager default actions; when one is completed,
  // run the results and pick a new action based on priority
  completeAction() {
    let out = 'does something inscrutable';

    switch (this.action) {
      case 'idle':
        this.hunger++;
        out = 'does nothing in particular';
        break;
      case 'rest':
        this.hunger++;
        out = 'rests and recovers';
        break;
      case 'eat':
        this.eat();
        out = 'eats a meal';
        break;
    }

    this.action = this.priority();

    return out;
  }

  // Default priorities
  static priority(self) {
    let priorities = {};
    
    priorities['idle'] = 10;
    priorities['rest'] = 3;
    priorities['eat'] = self.hungry() ? 10 : 1;

    return priorities;
  }

  priority(priorities) {
    // Thanks to bob12121212058 on StackOverflow for this
    // "shortest solution in modern JavaScript" for weighted random
    // tables; modified somewhat to fit this priority

    // Default priorities if none are passed in
    if (!priorities) {
      priorities = Villager.priority(this);
    }
    console.log(priorities);

    let table = Object.entries(priorities)
      .flatMap(([item, weight]) => Array(weight).fill(item));

    let priority = table[Math.floor(Math.random() * table.length)];

    return priority;
  }

}

module.exports = Villager;