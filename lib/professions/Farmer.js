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
  }

  hungry() {
    return super.hungry();
  }

  /// ACTIONS AND PRIORITY ///

  // Farmer-specific actions
  completeAction() {
    let out = 'does something inscrutable';

    switch (this.action) {
      case 'idle':
        this.hunger++;
        out = 'does something farmerly';
        break;
      case 'sow':
        this.produce++;
        out = 'plows and sows seeds';
        break;
      default: 
        out = super.completeAction();
        break;
    }

    this.action = this.priority();

    return out;
  }

  // These are the default Farmer priorities
  static priority(self) {
    let priorities = {}

    priorities['sow'] = 10;
    priorities['rest'] = 3;
    priorities['eat'] = self.hungry()? 10 : 1;
    
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
