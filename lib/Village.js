const Villager = require('./Villager');
const { DateTime, Interval, Duration } = require('../js/luxon.min.js');

class Village {
  constructor({
    name = 'Sibon', founded = DateTime.now().toISO(),
    wealth = 0, goods = {},
    villagers = [] } = {}) {

    this.name = name;
    this.founded = founded;

    this.wealth = wealth;
    this.goods = goods;

    this.villagers = villagers;

    this.ticker;
  }

  earn(amount) {
    this.wealth += amount;
    return this.wealth;
  }
  spend(amount) {
    if (amount > this.wealth) return false;

    this.wealth -= amount;
    return this.wealth;
  }

  // count(...goods) {
  //   goods = [goods].flat();

  //   let out = {};
  //   console.log(goods);
  //   goods.every(item => {
  //     console.log(item);
  //     out[item] = this.goods[item];
  //   });
  //   return out;
  // }

  count(item) {
    return this.goods[item]? this.goods[item] : 0;
  }

  receive(goods) {
    let out = {};

    Object.entries(goods).forEach( ([item, qty]) => {
      this.goods[item] = this.goods[item]? this.goods[item] + qty : qty;
      out[item] = this.goods[item];
    });

    return out;
  }
  reduce(goods) {
    let out = {};
    let reject = false;

    Object.entries(goods).forEach( ([item, qty]) => {
      if (!this.goods[item]) reject = true;
      if (qty > this.goods[item]) reject = true;

      this.goods[item] -= qty;
      out[item] = this.goods[item];
    });

    return reject? false : out;
  }



  /// VILLAGERS ///

  addVillager(villager) {
    this.villagers.push(villager);

    if (this.ticker) villager.listenTo(ticker);
  }

  provide(villager, goods) {
    let success = this.reduce(goods);
    if (success) {
      Object.entries(goods).forEach( ([item, qty]) => {
        villager.goods[item] = villager.goods[item]? villager.goods[item] + qty : qty;
      });
    } else {
      return false;
    }
  }
}

module.exports = Village;