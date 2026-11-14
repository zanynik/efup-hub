// node apps/open-store-model.test.js
const assert = require('node:assert');
const { simulate, PRESETS, SKEPTIC, DEFAULTS } = require('./open-store-model.js');

for (const key of Object.keys(PRESETS)) {
  const run = simulate(PRESETS[key].levers, {}, PRESETS[key].choices);
  assert.strictEqual(run.months.length, 12);
  for (const m of run.months) {
    // Every euro of sales goes somewhere: goods, fixed costs, wages, interest, refunds or the store.
    assert.ok(Math.abs(m.sales - (m.goods + m.overhead + m.fixed + m.paidLabour + m.interest + m.refund + m.kept)) < 1e-6, key + ' month ' + m.month);
    assert.ok(m.refund >= 0 && m.volunteerHours <= m.hoursNeeded + 1e-9 && m.trust >= 0 && m.trust <= 1);
  }
}
const first = simulate(PRESETS.supermarket.levers, {}, {}).months[0];
assert.strictEqual(first.sales, 88000);
assert.strictEqual(Math.round(first.surplus), 200);           // 88,000 − 70,400 − 2,640 − 9,000 − 360 h × €16
assert.strictEqual(simulate(PRESETS.supermarket.levers).totals.refunded, 0);
const open = simulate(PRESETS.open.levers, {}, { 6: 'hold' });
assert.ok(open.totals.refunded > 0);
// Raising prices in the shortage brings in money that month and costs trust.
const hold = simulate(PRESETS.open.levers, {}, { 6: 'hold' }), raise = simulate(PRESETS.open.levers, {}, { 6: 'raise' });
assert.ok(raise.months[5].surplus > hold.months[5].surplus && raise.months[6].trust < hold.months[6].trust);
// The freezer bill comes out of the reserve.
const s = simulate(PRESETS.supermarket.levers).months;
assert.ok(Math.abs(s[2].reserve - (s[1].reserve + s[2].kept - 5000)) < 1e-6);

const fmt = n => Math.round(n).toLocaleString('en');
for (const [label, assumptions] of [['defaults', {}], ['skeptic', SKEPTIC]]) {
  console.log('\n' + label);
  for (const key of Object.keys(PRESETS)) {
    const r = simulate(PRESETS[key].levers, assumptions, PRESETS[key].choices);
    console.log(`  ${PRESETS[key].name.padEnd(13)} households ${DEFAULTS.startShoppers} -> ${r.end.shoppers}  refunded €${fmt(r.totals.refunded)}  reserve €${fmt(r.end.reserve)} (low €${fmt(r.totals.lowestReserve)})  volunteer h ${fmt(r.totals.volunteerHours)}  trust ${r.end.trust.toFixed(2)}`);
  }
}
console.log('\nok');
