const { DateTime, Duration, Interval } = require('./js/luxon.min.js');
const Villager = require('./lib/Villager');
const Farmer = require('./lib/professions/Farmer');
const { Ticker, TickListener } = require('./js/Ticker.js');
const EventEmitter = require('events');

console.log(`START: ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}`);

const ticker = new Ticker();
let latest = ticker.latestTick();

console.log(`LATEST: ${latest.toLocaleString(DateTime.TIME_WITH_SECONDS)}`);

const james = new Villager({ name: 'James' });
const galford = new Farmer({ name: 'Galford' });
james.listenTo(ticker);
galford.listenTo(ticker);

ticker.start();