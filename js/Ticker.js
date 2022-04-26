const { DateTime, Duration, Interval } = require('./luxon.min.js');
const EventEmitter = require('events');

class Ticker extends EventEmitter {
  constructor(obj = {}) {
    super();
    this.tick = obj.tick? obj.tick : Duration.fromObject({ seconds: 5 });

    // DateTime representing the beginning of measurement; usually midnight
    this.base = obj.base? obj.base : DateTime.now().startOf('day');

    this.interval;
    this.latest = this.latestTick();
  }

  latestTick() {
    let duration = Interval.fromDateTimes(this.base, DateTime.now()).toDuration();
    let offset = Duration.fromObject({ milliseconds: duration.toMillis() - Math.floor(duration.toMillis() % this.tick.toMillis() )});
    return this.base.plus(offset);
  }

  ticksSince(then) {
    return Interval.fromDateTimes(then, DateTime.now()).splitBy(this.tick).length - 1;
  }

  ticked(then) {
    return this.ticksSince(then) >= 1;
  }

  start() {
    let self = this;

    this.interval = setInterval( function() {
      if (self.ticked(self.latest)) {
        self.latest = self.latestTick();

        console.log(``);
        console.log(`Tick!: ${self.latest.toLocaleString(DateTime.TIME_WITH_SECONDS)}`);
        self.emit('tick', self.latest);
      }
    }, 1000)
  }
}

class TickListener extends EventEmitter {}

module.exports = { Ticker, TickListener };