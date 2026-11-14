// node apps/town-model.test.js            checks the bookkeeping
// node apps/town-model.test.js --playtest  plays the open store many times under different levers
const assert = require('node:assert');
const T = require('./town-model.js');

// 1. Same seed, same town.
const a = T.summary(T.run({ seed: 7 })), b = T.summary(T.run({ seed: 7 }));
assert.deepStrictEqual(a, b);

// 2. Every household shops somewhere, every month, and every euro of sales is accounted for.
for (const open of [{}, { surplus: 'keep', work: 'paid' }, { door: 'members', work: 'mandatory', surplus: 'till' }, { thanks: 'token', shortage: 'raise', costRise: 'absorb' }]) {
  const town = T.createTown({ seed: 3, open });
  for (let m = 0; m < town.world.months; m++) {
    const report = T.step(town);
    const total = Object.values(report.stores).reduce((n, e) => n + e.shoppers, 0);
    assert.strictEqual(total, town.world.households, 'month ' + report.month);
    for (const [k, e] of Object.entries(report.stores)) {
      assert.ok(Math.abs(e.sales - (e.goods + e.shrink + e.fixed + e.labour + e.interest + e.surplus)) < 1e-6, k + ' month ' + report.month);
      assert.ok(e.hours <= e.hoursNeeded * town.world.volunteerCap + 1e-9 && e.claimed <= e.refund + 1e-9 && e.refund >= 0);
    }
  }
}

// 3. The research-based levers move things the way the papers say.
const mean = (open, world, pick, seeds = 12) => { let t = 0; for (let s = 1; s <= seeds; s++) t += pick(T.summary(T.run({ seed: s, open, world }))); return t / seeds; };
const shoppers = s => s.open.shoppers, coverage = s => s.open.coverage;
assert.ok(mean({ shortage: 'raise' }, {}, shoppers) < mean({ shortage: 'hold' }, {}, shoppers), 'raising prices in a shortage costs shoppers');
assert.ok(mean({ thanks: 'token' }, {}, coverage) < mean({ thanks: 'none' }, {}, coverage), 'a token payment crowds out helpers');
assert.ok(mean({ books: true }, {}, shoppers) > mean({ books: false }, {}, shoppers), 'open books attract shoppers');
assert.ok(mean({}, { freeRiderShare: 0.6, conditionalShare: 0.3 }, coverage) < mean({}, {}, coverage), 'more free riders, less help');
console.log('ok');

if (process.argv.includes('--playtest')) {
  const SEEDS = 40, fmt = n => Math.round(n).toLocaleString('en');
  const play = (label, open, world) => {
    const runs = []; for (let s = 1; s <= SEEDS; s++) runs.push(T.summary(T.run({ seed: s, open, world })));
    const avg = f => runs.reduce((t, r) => t + f(r), 0) / SEEDS;
    console.log(label.padEnd(44) + ` open ${fmt(avg(r => r.open.shoppers)).padStart(3)}  super ${fmt(avg(r => r.super.shoppers)).padStart(3)}  coop ${fmt(avg(r => r.coop.shoppers)).padStart(3)}` +
      `  returned €${fmt(avg(r => r.open.returned)).padStart(7)}  basket €${fmt(avg(r => r.open.netBasket || 0))}/${fmt(avg(r => r.super.netBasket))}/${fmt(avg(r => r.coop.netBasket))}  help ${Math.round(100 * avg(r => r.open.coverage)).toString().padStart(2)}%` +
      `  lowest reserve €${fmt(avg(r => r.open.lowest)).padStart(7)}  closed ${runs.filter(r => r.open.closed).length}/${SEEDS}`);
  };
  console.log(`\nHouseholds after two years (of 400), money returned, what a month of groceries ends up costing at open/super/co-op, share of work done by volunteers; ${SEEDS} towns each\n`);
  play('The open store as designed', {});
  console.log('\n-- its own levers, one at a time');
  play('surplus kept instead of returned', { surplus: 'keep' });
  play('refund automatic at the till', { surplus: 'till' });
  play('paid staff only', { work: 'paid' });
  play('compulsory hours', { work: 'mandatory' });
  play('members only', { door: 'members' });
  play('a small voucher for volunteers', { thanks: 'token' });
  play('books published', { books: true });
  play('prices raised in the shortage', { shortage: 'raise' });
  play('wholesale rise absorbed', { costRise: 'absorb' });
  play('markup 15%', { markup: 0.15 });
  play('markup 35%', { markup: 0.35 });
  console.log('\n-- the world, one belief at a time');
  play('more free riders (60%, 30% conditional)', {}, { freeRiderShare: 0.6, conditionalShare: 0.3 });
  play('nobody is a pure giver (50% free riders)', {}, { freeRiderShare: 0.5, conditionalShare: 0.5 });
  play('price-insensitive town (0.27)', {}, { priceSensitivity: 0.27 });
  play('price-sensitive town (0.81)', {}, { priceSensitivity: 0.81 });
  play('few refunds claimed (40%)', {}, { redemption: 0.4 });
  play('chain buys 12% cheaper', {}, { chainAdvantage: 0.12 });
  play('chain does not fight back', {}, { chainFightsBack: false });
  play('very convenient supermarket', {}, { convenience: 1.0 });
  play('people shrug at price gouging (20%)', { shortage: 'raise' }, { fairnessShare: 0.2 });
  console.log('\n-- the hard case: doubters are right about people and the chain is strong');
  play('free riders + strong chain', {}, { freeRiderShare: 0.6, conditionalShare: 0.3, chainAdvantage: 0.12, convenience: 1.0 });
  play('  ... and paid staff only', { work: 'paid' }, { freeRiderShare: 0.6, conditionalShare: 0.3, chainAdvantage: 0.12, convenience: 1.0 });
  play('  ... and compulsory hours', { work: 'mandatory' }, { freeRiderShare: 0.6, conditionalShare: 0.3, chainAdvantage: 0.12, convenience: 1.0 });
}
