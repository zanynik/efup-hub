// The Open Store: a small, honest model of one year in a neighbourhood grocery store.
//
// Three levers (the door, who does the work, what happens to the surplus) and a handful of
// assumptions, every one of them adjustable on the page. Nothing here is a forecast: it shows
// what follows IF the assumptions hold, so that people can argue about the assumptions.
//
// Pure functions, no DOM: `node apps/open-store-model.test.js` checks the arithmetic.

(function (root) {
  const DEFAULTS = {
    startShoppers: 400,     // households shopping in month 1
    spend: 220,             // € a household spends per month
    markup: 0.25,           // shelf price over what the store pays for the goods
    fixed: 9000,            // € per month: rent, a small paid core team
    overhead: 0.03,         // share of sales lost to energy, spoilage and breakage
    hoursPerShopper: 0.9,   // hours of shelf, till and cleaning work per household served
    wage: 16,               // € per hour for work nobody volunteers for
    walkIns: 25,            // new households a month that would become regulars at an open door
    doorTurnsAway: 0.35,    // share of them a joining fee and a card check turn away
    churn: 0.05,            // share of households that stop coming each month
    mandatoryChurn: 0.008,  // extra share that leaves when hours are compulsory
    shareFee: 100,          // € joining fee per new member (members-only door)
    helpBase: 0.04,         // share of households that help when helping is voluntary...
    helpWithTrust: 0.30,    // ...plus this much more at full trust
    hoursEach: 3,           // hours a helper gives per month
    mandatoryShowUp: 0.8,   // share of members who do their compulsory hours
    refundTrust: 0.4,       // trust gained per unit of refund rate (5% back -> +0.02 a month)
    repairFund: 1500,       // € of surplus set aside each month before any refund
    startTrust: 0.3,
    startReserve: 6000,
  };

  const MONTHS = 12;
  const EVENTS = {
    3: { title: 'The freezer breaks', cost: 5000 },
    6: { title: 'A shortage: everyone wants flour and oil', choice: true },
    9: { title: 'A discount chain opens two streets away' },
  };

  const clamp = (x, lo, hi) => Math.min(hi, Math.max(lo, x));

  // levers: { door: 'open' | 'members', help: 'voluntary' | 'mandatory' | 'paid', surplus: 'refund' | 'keep' }
  // choices: { 6: 'hold' | 'raise' }
  function simulate(levers, assumptions, choices) {
    const a = Object.assign({}, DEFAULTS, assumptions || {});
    const pick = choices || {};
    let shoppers = a.startShoppers, trust = a.startTrust, reserve = a.startReserve;
    const months = [];
    const totals = { refunded: 0, kept: 0, volunteerHours: 0, paidLabour: 0, interest: 0, lowestReserve: reserve };

    for (let m = 1; m <= MONTHS; m++) {
      const event = EVENTS[m] || null;
      const notes = [];
      let markup = a.markup, trustChange = -0.05 * (trust - a.startTrust);   // trust drifts back to ordinary

      if (m === 6) {
        if (pick[6] === 'raise') { markup += 0.15; trustChange -= 0.12; notes.push('Prices went up 15% while people had no choice.'); }
        else { trustChange += 0.04; notes.push('Prices stayed where they were.'); }
      }
      if (m === 9) {
        const lost = Math.round(shoppers * 0.2 * (1 - trust));
        shoppers -= lost;
        notes.push(lost + ' households switched to the chain.');
      }

      const sales = shoppers * a.spend * (1 + markup) / (1 + a.markup);
      const goods = shoppers * a.spend / (1 + a.markup);
      const hoursNeeded = shoppers * a.hoursPerShopper;
      let volunteerHours = 0;
      if (levers.help === 'mandatory') volunteerHours = shoppers * a.mandatoryShowUp * a.hoursEach;
      if (levers.help === 'voluntary') volunteerHours = shoppers * (a.helpBase + a.helpWithTrust * trust) * a.hoursEach;
      volunteerHours = Math.min(volunteerHours, hoursNeeded);
      const paidLabour = (hoursNeeded - volunteerHours) * a.wage;
      const interest = reserve < 0 ? -reserve * 0.01 : 0;   // borrowing to cover a hole costs 1% a month
      const repair = event && event.cost ? event.cost : 0;
      if (repair) notes.push('Repair bill: €' + repair.toLocaleString('en') + '.');

      const overhead = sales * a.overhead;
      const surplus = sales - goods - overhead - a.fixed - paidLabour - interest;
      let refund = 0, kept = surplus;
      if (levers.surplus === 'refund' && surplus > 0) {
        kept = Math.min(surplus, a.repairFund);
        refund = surplus - kept;
      }
      const refundRate = sales > 0 ? refund / sales : 0;
      trustChange += a.refundTrust * refundRate;

      // People arrive after the month's shopping, and some leave.
      let arrivals = a.walkIns * (0.7 + trust);
      if (levers.door === 'members') arrivals *= 1 - a.doorTurnsAway;
      arrivals = Math.round(arrivals);
      const leaveRate = a.churn * (1 - 0.6 * trust) + (levers.help === 'mandatory' ? a.mandatoryChurn : 0);
      const leavers = Math.round(shoppers * leaveRate);
      const fees = levers.door === 'members' ? arrivals * a.shareFee : 0;

      reserve += kept + fees - repair;
      totals.refunded += refund; totals.kept += kept; totals.volunteerHours += volunteerHours;
      totals.paidLabour += paidLabour; totals.interest += interest;
      totals.lowestReserve = Math.min(totals.lowestReserve, reserve);

      months.push({
        month: m, event: event ? event.title : null, notes, shoppers, sales, goods, overhead, fixed: a.fixed, paidLabour,
        volunteerHours, hoursNeeded, interest, surplus, refund, refundRate, kept, reserve, trust,
        arrivals, leavers,
      });

      shoppers = Math.max(0, shoppers + arrivals - leavers);
      trust = clamp(trust + trustChange, 0, 1);
    }
    return { months, totals, end: { shoppers, trust, reserve }, assumptions: a };
  }

  const PRESETS = {
    supermarket: { name: 'Supermarket', levers: { door: 'open', help: 'paid', surplus: 'keep' }, choices: { 6: 'raise' } },
    coop: { name: 'Member co-op', levers: { door: 'members', help: 'mandatory', surplus: 'keep' }, choices: { 6: 'hold' } },
    open: { name: 'Open store', levers: { door: 'open', help: 'voluntary', surplus: 'refund' }, choices: { 6: 'hold' } },
  };

  // A doubter's version of the two assumptions the open store leans on.
  const SKEPTIC = { refundTrust: 0.1, helpWithTrust: 0.05 };

  const api = { DEFAULTS, MONTHS, EVENTS, PRESETS, SKEPTIC, simulate };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.OpenStore = api;
})(typeof window !== 'undefined' ? window : globalThis);
