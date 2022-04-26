const { DateTime, Duration, Interval } = require('./js/luxon.min.js');
const Villager = require('./lib/Villager');
const Farmer = require('./lib/professions/Farmer');
const { Ticker } = require('./js/Ticker.js');
const EventEmitter = require('events');

console.log(`START: ${DateTime.now().toLocaleString(DateTime.TIME_WITH_SECONDS)}`);

const ticker = new Ticker({ tick: Duration.fromObject({ seconds: 5 }) });
let latest = ticker.latestTick();

console.log(`LATEST: ${latest.toLocaleString(DateTime.TIME_WITH_SECONDS)} ${ticker.tickGroup()}:${ticker.tickPosition()}`);

const james = new Farmer({ name: 'James' });
const galford = new Farmer({ name: 'Galford' });
// james.listenTo(ticker);
galford.listenTo(ticker);

ticker.start();