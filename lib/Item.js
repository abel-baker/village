const luxon = require('../js/luxon.min.js');


class Item {
  constructor({
    id = -1, created = luxon.DateTime.now().toISO(), unique = false,
    name, value = 0, resale_factor = 0.5 }) {

    this.id = id;
    this.created = created;
    this.unique = unique;

    this.name = name;
    this.value = value;
    this.resale_factor = resale_factor;
  }

  // Define equivalence of Items (for purposes of being contained in an array, etc.)
  // Non-unique items (e.g. store-bought lantern) compare only name and value
  // try lodash?
  equals(otherItem, unique = false) {
    if (!unique) {
      return this.name === otherItem.name && this.value === otherItem.value;

    } else {
      return this.id !== -1 && otherItem.id !== -1 &&
        this.unique && otherItem.unique &&
        this.id === otherItem.id &&
        this.name === otherItem.name &&
        this.value === otherItem.value;
    }
  }

  price() {
    return value * this.resale_factor;
  }

}

module.exports = Item;