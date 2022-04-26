const Villager = require('../Villager');


// Farmer is a food-producing basic production profession.  Output may
// include produce, grain, fibers
class Farmer extends Villager {
  constructor(obj = {}) {
    super(obj);

    this.job = 'farmer';

    this.name = obj.name? obj.name : 'Alain';
    this.hungry_at = obj.hungry_at? obj.hungry_at : 6;
    this.produce = obj.produce? obj.produce : 0;

    this.fields = { plowed: 0, sown: 0 };
  }

  // hungry() {
  //   return super.hungry();
  // }

  status() {
    let status = this.fields.sown > 0? 'sown/' : this.fields.plowed? 'plowed/' : 'fallow/';
    let produce = this.produce
    return `${status}${this.action}:${produce}p ${this.wealth}c ${this.hunger}h`;
  }

  /// ACTIONS AND PRIORITY ///

  // Farmer-specific actions
  completeAction() {
    let out = `does something inscrutable`;

    switch (this.action) {
      case 'idle':
        this.hunger++;
        out = `does something farmerly`;
        break;
      case 'plow':
        this.fields.plowed = 2;
        this.hunger++;
        out = `plows the fields`;
        break;
      case 'sow':
        this.fields.plowed--;
        this.fields.sown++;
        this.hunger++;
        out = `sows seeds`;
        break;
      case 'harvest':
        this.produce++;
        this.fields.sown--;
        this.hunger++;
        out = `harvests the crop`;
        break;
      case 'market':
        this.hunger++;
        let toSell = this.produce;
        if (toSell > 0) {
          this.produce -= toSell;
          this.wealth += toSell;
          out = `sells ${toSell} bushels of produce on market day`;
        } else {
          out = `enjoys a day at the market`;
        }

        break;
      default: 
        out = super.completeAction();

        return `${out}`;
    }

    this.action = this.priority();

    out += ` (${this.status()})`;

    return `${out}`;
  }

  // These are the default Farmer priorities
  static priority(self) {
    let priorities = {}

    priorities['eat'] = self.hungry()? 10 : 0;
    priorities['rest'] = 3;

    priorities['harvest'] = self.fields.sown? 10 : 0;
    priorities['sow'] = !self.fields.sown && self.fields.plowed? 10 : 0;
    priorities['plow'] = !self.fields.sown && !self.fields.plowed? 10 : 0;

    priorities['market'] = self.produce >= 7? self.produce >= 10? 20 : 3 : 0;
    
    return priorities;
  }

  priority(priorities) {
    // Use default priorities if none are passed in
    if (!priorities) {
      priorities = Farmer.priority(this);
    }
    
    return super.priority(priorities);
  }
}

module.exports = Farmer;
