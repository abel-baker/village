const Villager = require('../Villager');

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
    let out = 'does something farmerly';

    switch (this.action) {
      case 'sow':
        this.produce++;
        out = 'plows and sows seeds';
        break;
      default: 
        this.action = super.priority();
        return out;
    }

    this.action = this.priority();

    return out;
  }

  static priority(self) {
    let priorities = {}

    priorities['sow'] = 10;
    priorities['rest'] = 3;
    priorities['eat'] = self.hungry()? 10 : 1;
    
    return this.priorities;
  }

  priority(priorities) {
    // Default priorities if none are passed in
    if (!priorities) {
      priorities = Farmer.priority(this);
    }
    
    return super.priority(priorities);
  }
}

module.exports = Farmer;
