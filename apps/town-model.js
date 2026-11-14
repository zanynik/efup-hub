// The Open Store, v2: a town of 400 households and three grocery stores competing for them.
//
// Every household is simulated: where it lives, how much it minds prices, whether it punishes
// unfair pricing, and whether it helps when helping is voluntary. Each month households may
// switch store; stores pay their bills, and the open store's volunteers react to what they see.
//
// Numbers marked [source] come from published research (listed in SOURCES and on the page);
// numbers marked [assumption] are mine and are exposed as "world" sliders where they matter.
// Pure functions, seeded randomness, no DOM: `node apps/town-model.test.js`.

(function (root) {
  const SOURCES = [
    { id: 'kkt', text: 'Kahneman, Knetsch & Thaler (1986), "Fairness as a Constraint on Profit Seeking", American Economic Review 76(4)', finding: '82% of people called it unfair for a shop to raise the price of snow shovels after a storm; passing on a cost increase was seen as acceptable.', url: 'https://ideas.repec.org/a/aea/aecrev/v76y1986i4p728-41.html' },
    { id: 'fgf', text: 'Fischbacher, Gächter & Fehr (2001), "Are people conditionally cooperative?", Economics Letters 71(3)', finding: 'About 50% of people give to a common project only as much as they see others give; about a third give nothing whatever others do.', url: 'https://econpapers.repec.org/RePEc:zur:iewwpx:016' },
    { id: 'gr', text: 'Gneezy & Rustichini (2000), "Pay Enough or Don\'t Pay at All", Quarterly Journal of Economics 115(3)', finding: 'Students collecting for charity raised less when paid a small commission (about 154) than when unpaid (about 239).', url: 'https://econpapers.repec.org/RePEc:oup:qjecon:v:115:y:2000:i:3:p:791-810.' },
    { id: 'falk', text: 'Falk (2007), "Gift Exchange in the Field", Econometrica 75(5)', finding: 'A small gift in a charity letter raised the share of people donating by 17%, a large gift by 75%.', url: 'https://www.econometricsociety.org/publications/econometrica/2007/09/01/gift-exchange-field' },
    { id: 'andreyeva', text: 'Andreyeva, Long & Brownell (2010), "The Impact of Food Prices on Consumption", American Journal of Public Health 100(2)', finding: 'Across 160 studies, a 10% rise in food prices cut purchases by 2.7% to 8.1% depending on the food.', url: 'https://pubmed.ncbi.nlm.nih.gov/20019319/' },
    { id: 'silk', text: 'Silk (2004), University of Florida rebate study', finding: 'Only 58% to 77% of buyers claimed a rebate they had chosen; the longer the deadline, the fewer claimed.', url: 'https://archive.news.ufl.edu/articles/2004/06/redemption-of-mail-in-rebates-declines-with-increased-time-allowance.html' },
    { id: 'mbj', text: 'Mohan, Buell & John (2020), "Lifting the Veil: The Benefits of Cost Transparency", Marketing Science', finding: 'Showing customers what a product costs to make raised the chance of buying it by 21%.', url: 'https://www.informs.org/News-Room/INFORMS-Releases/News-Releases/New-Research-Finds-Cost-Transparency-Can-Increase-Sales-20' },
    { id: 'rb', text: 'Rhee & Bell (2002), "The Inter-Store Mobility of Supermarket Shoppers", Journal of Retailing 78(4)', finding: 'About three quarters of shoppers grow attached to their main store and rarely move.', url: 'https://repository.upenn.edu/marketing_papers/270' },
    { id: 'fmi', text: 'FMI, "The Food Retailing Industry Speaks 2024"', finding: 'US grocers kept 1.6% of sales as profit in 2023 (2.3% in 2022).', url: 'https://www.fmi.org/newsroom/latest-news/view/2024/06/27/new-fmi-research--the-food-industry-increases-strategic-investments-while-tackling-financial-challenges' },
    { id: 'nrf', text: 'National Retail Federation, National Retail Security Survey 2023', finding: 'Shops lost 1.6% of sales to theft, spoilage and error in 2022.', url: 'https://nrf.com/research-insights/national-retail-security-survey' },
    { id: 'psfc', text: 'Park Slope Food Coop, membership rules', finding: 'Prices are cost plus 25%; every member works 2.75 hours every six weeks; member labour covers about 75% of the work.', url: 'https://www.foodcoop.com/?p=61662' },
  ];

  const WORLD = {
    households: 400,
    basketCost: 170,        // € wholesale cost of a household's monthly groceries [assumption]
    priceSensitivity: 0.54, // middle of the 0.27-0.81 range [andreyeva]; scales how hard prices pull
    fairnessShare: 0.82,    // share of households that punish unfair price rises [kkt]
    conditionalShare: 0.50, // help only as much as they see others help [fgf]
    freeRiderShare: 0.33,   // never help [fgf]; the rest always help
    loyalShare: 0.75,       // share that does not even reconsider its store in a given month [rb]
    chainAdvantage: 0.05,   // how much cheaper the supermarket chain buys [assumption]
    convenience: 0.4,       // pull of the supermarket's longer hours and wider range [assumption]
    chainFightsBack: true,  // the chain cuts prices when it loses shoppers [assumption]
    redemption: 0.65,       // share of receipt refunds actually claimed, 58-77% [silk]
    shrink: 0.016,          // share of sales lost [nrf]
    hoursPerHousehold: 1.3, // store work per household served, a month (about €170 of sales per hour) [assumption]
    wage: 16,               // € per paid hour [assumption]
    volunteerCap: 0.75,     // most of the work volunteers can cover [psfc]
    valueOfTime: 6,         // € the average household puts on an hour of compulsory work; varies 0-2x [assumption]
    months: 24,
  };

  // What the player sets for the open store. The two rivals are fixed (see makeStores).
  const OPEN_DEFAULTS = {
    markup: 0.25,           // shelf price over cost
    door: 'open',           // 'open' | 'members'
    work: 'voluntary',      // 'voluntary' | 'mandatory' | 'paid'
    thanks: 'none',         // 'none' | 'token': a small voucher for volunteers [gr]
    surplus: 'receipt',     // 'keep' | 'receipt' (bring it back next month) | 'till' (automatic)
    books: false,           // publish what everything costs [mbj]
    shortage: 'hold',       // 'hold' | 'raise' prices 15% in the shortage month [kkt]
    costRise: 'pass',       // 'pass' | 'absorb' the wholesale rise
  };

  function rng(seed) {      // mulberry32: the same seed always gives the same town
    let a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  const STORE_KEYS = ['open', 'super', 'coop'];
  const PLACES = { open: { x: 50, y: 14 }, super: { x: 22, y: 54 }, coop: { x: 78, y: 54 } };

  function makeStores(open, world) {
    return {
      open: Object.assign({ key: 'open', name: 'Open store', fixed: 3400, costFactor: 1, fee: 100, hours: 2 }, OPEN_DEFAULTS, open || {}),
      // A chain supermarket: buys cheaper, pays all its staff, keeps what is left, raises prices when it can.
      super: { key: 'super', name: 'Supermarket', fixed: 3900, costFactor: 1 - world.chainAdvantage, markup: 0.36, door: 'open', work: 'paid', thanks: 'none', surplus: 'keep', books: false, shortage: 'raise', costRise: 'pass', fee: 0, hours: 0 },
      // A member co-op on Park Slope's terms [psfc].
      coop: { key: 'coop', name: 'Member co-op', fixed: 3400, costFactor: 1, markup: 0.25, door: 'members', work: 'mandatory', thanks: 'none', surplus: 'keep', books: true, shortage: 'hold', costRise: 'pass', fee: 100, hours: 2 },
    };
  }

  function createTown(options) {
    const world = Object.assign({}, WORLD, (options && options.world) || {});
    const random = rng((options && options.seed) || 1);
    const stores = makeStores(options && options.open, world);
    const households = [];
    for (let i = 0; i < world.households; i++) {
      const x = 4 + random() * 92, y = 6 + random() * 62;
      const r = random();
      const type = r < world.freeRiderShare ? 'free' : r < world.freeRiderShare + world.conditionalShare ? 'conditional' : 'giver';
      const h = { id: i, x, y, type, fair: random() < world.fairnessShare, price: 0.6 + random() * 0.8, time: random() * 2, store: null, member: {}, grudge: { open: 0, super: 0, coop: 0 }, helped: false };
      // A settled town: everyone starts at their nearest store, and the co-op's shoppers are members.
      const d = k => Math.hypot(x - PLACES[k].x, y - PLACES[k].y);
      h.store = STORE_KEYS.reduce((a, b) => (d(a) <= d(b) ? a : b));
      if (h.store === 'coop') h.member.coop = true;
      households.push(h);
    }
    const state = {
      world, stores, households, random, month: 0, log: [], closed: {},
      books: { open: fresh(), super: fresh(), coop: fresh() },
      helpBelief: 0.5,      // what conditional cooperators expect others to do
      costIndex: 1,         // wholesale price level
    };
    return state;
  }
  const fresh = () => ({ reserve: 6000, refundRate: 0, returned: 0, unclaimed: 0, carry: 0, profit: 0, history: [] });

  const EVENTS = {
    3: { key: 'freezer', title: 'Freezers fail in the heatwave', text: 'Every store faces a €4,000 repair.' },
    6: { key: 'shortage', title: 'A shortage: everyone wants flour and oil', text: 'Stores can raise prices 15% this month. Most people will call that unfair.' },
    9: { key: 'costRise', title: 'Wholesale prices rise 6%', text: 'For good. Passing a cost on is seen as fair; absorbing it costs the store.' },
  };

  // The price a household actually faces at a store, relative to cost: shelf price, minus the
  // refund it expects to get back, plus what compulsory hours and a joining fee are worth to it.
  function effectivePrice(state, store, h, extraMarkup) {
    const w = state.world, book = state.books[store.key];
    const shelf = store.costFactor * state.costIndex * (1 + store.markup + (extraMarkup || 0));
    const claim = store.surplus === 'till' ? 1 : store.surplus === 'receipt' ? w.redemption : 0;
    let price = shelf * (1 - book.refundRate * claim);
    const basket = w.basketCost;
    if (store.work === 'mandatory') price += store.hours * w.valueOfTime * h.time / basket;
    if (store.door === 'members' && !h.member[store.key]) price += store.fee / 24 / basket;   // fee spread over two years
    return price;
  }

  function utility(state, store, h, extraMarkup) {
    const w = state.world, place = PLACES[store.key];
    let u = -13 * w.priceSensitivity * h.price * (effectivePrice(state, store, h, extraMarkup) - 1.3);
    u -= 0.035 * Math.hypot(h.x - place.x, h.y - place.y);       // nearer is better [assumption]
    if (h.store === store.key) u += 1.2;                          // habit [rb]
    if (store.door === 'members') u += h.member[store.key] ? 0.5 : -0.5;   // their store / the bother of joining before you can even look [assumption]
    if (store.books) u += Math.log(1.21);                         // open books [mbj]
    if (store.key === 'super') u += w.convenience;                // longer hours, wider range [assumption]
    u -= h.grudge[store.key];                                     // remembered unfairness [kkt]
    return u;
  }

  function step(state) {
    const w = state.world, random = state.random;
    state.month++;
    const m = state.month, event = EVENTS[m] || null;
    const open = STORE_KEYS.filter(k => !state.closed[k]);
    const extra = {};
    for (const k of open) extra[k] = (m === 6 && state.stores[k].shortage === 'raise') ? 0.15 : 0;
    if (m === 9) state.costIndex = 1.06;
    const absorbing = k => m >= 9 && state.stores[k].costRise === 'absorb';

    // 1. Households choose where to shop. Most do not even look around [rb].
    for (const h of state.households) {
      if (state.closed[h.store]) h.store = null;
      if (h.store && random() < w.loyalShare) continue;
      let best = null, total = 0;
      const weights = open.map(k => {
        const store = state.stores[k];
        let u = utility(state, store, h, 0);
        if (absorbing(k)) u += 13 * w.priceSensitivity * h.price * 0.06 * store.costFactor * (1 + store.markup);
        const weight = Math.exp(u); total += weight; return weight;
      });
      let pick = random() * total;
      for (let i = 0; i < open.length; i++) { pick -= weights[i]; if (pick <= 0) { best = open[i]; break; } }
      best = best || open[open.length - 1];
      if (best !== h.store) {
        h.store = best;
        const store = state.stores[best];
        if (store.door === 'members' && !h.member[best]) { h.member[best] = true; state.books[best].reserve += store.fee; }
      }
    }

    // 2. Each store's month.
    const report = { month: m, event: event ? event.key : null, stores: {} };
    for (const k of open) {
      const store = state.stores[k], book = state.books[k];
      const shoppers = state.households.filter(h => h.store === k);
      const n = shoppers.length;
      const costLevel = store.costFactor * (absorbing(k) ? 1 : state.costIndex);
      const goods = n * w.basketCost * store.costFactor * state.costIndex;
      const sales = n * w.basketCost * costLevel * (1 + store.markup + extra[k]);
      const hoursNeeded = n * w.hoursPerHousehold;

      // Who helps. Compulsory hours: most members show up. Voluntary: givers always, free riders
      // never, and conditional cooperators as much as they believe others do [fgf], more after a
      // gift [falk], less when helping is paid a token [gr].
      let helpers = 0, hours = 0;
      if (store.work === 'mandatory') { helpers = Math.round(n * 0.85); hours = helpers * store.hours; }
      if (store.work === 'voluntary') {
        const gift = 1 + Math.min(0.75, book.refundRate * 10);     // 2% back ~ a small gift, 7.5% a large one [falk]
        const crowd = store.thanks === 'token' ? 154 / 239 : 1;    // [gr]
        for (const h of shoppers) {
          const p = h.type === 'giver' ? crowd : h.type === 'conditional' ? Math.min(1, state.helpBelief * gift * crowd) : 0;
          h.helped = random() < p;
          if (h.helped) helpers++;
        }
        hours = helpers * store.hours;
        const share = n ? helpers / n : 0;
        state.helpBelief = 0.5 * state.helpBelief + 0.5 * 0.9 * share;   // people match what they see, a little short [fgf]
      }
      hours = Math.min(hours, hoursNeeded * w.volunteerCap);
      const tokens = store.work === 'voluntary' && store.thanks === 'token' ? helpers * 5 : 0;   // a €5 voucher each
      const labour = (hoursNeeded - hours) * w.wage + tokens;
      const shrink = sales * w.shrink;
      const repair = m === 3 ? 4000 : 0;
      const interest = book.reserve < 0 ? -book.reserve * 0.01 : 0;
      const surplus = sales - goods - shrink - store.fixed - labour - interest;

      let refund = 0, claimed = 0;
      if (store.surplus !== 'keep' && surplus + book.carry > 0) {
        const keep = Math.max(0, Math.min(surplus, book.reserve < 8000 ? 800 : 0));   // top up the repair fund first
        refund = surplus - keep + book.carry;          // unclaimed refunds from before go back into the pot
        claimed = store.surplus === 'till' ? refund : refund * w.redemption;
        book.reserve += keep; book.carry = refund - claimed;
        book.unclaimed += refund - claimed;
      } else {
        book.reserve += surplus;
      }
      const kept = surplus - claimed;
      book.reserve -= repair;
      book.returned += claimed;
      if (store.surplus === 'keep') book.profit += Math.max(0, surplus);
      // What shoppers come to expect: a moving average of what really came back.
      book.refundRate = 0.6 * book.refundRate + 0.4 * (sales > 0 ? refund / sales : 0);

      // The chain answers a shrinking branch by cutting prices, two points at a time.
      if (k === 'super' && w.chainFightsBack && m > 3 && n < 105 && store.markup > 0.28) store.markup = Math.round((store.markup - 0.02) * 100) / 100;
      if (extra[k] > 0) for (const h of state.households) if (h.fair) h.grudge[k] += h.store === k ? 1.0 : 0.5;
      const entry = { shoppers: n, sales, goods, shrink, fixed: store.fixed, labour, hoursNeeded, hours, helpers, repair, interest, surplus, refund, claimed, kept, reserve: book.reserve,
        price: w.basketCost * costLevel * (1 + store.markup + extra[k]), refundRate: sales > 0 ? refund / sales : 0 };
      book.history.push(entry); report.stores[k] = entry;
      // A chain can carry a losing branch for longer than a small store can.
      if (book.reserve < (k === 'super' ? -40000 : -12000)) { state.closed[k] = m; state.log.push({ month: m, text: store.name + ' ran out of money and closed.' }); }
    }
    for (const h of state.households) for (const k of STORE_KEYS) h.grudge[k] *= 0.85;   // grudges fade
    if (event) state.log.push({ month: m, text: event.title + '. ' + event.text });
    state.last = report;
    return report;
  }

  function run(options) {
    const state = createTown(options);
    for (let i = 0; i < state.world.months; i++) step(state);
    return state;
  }

  function summary(state) {
    const out = {};
    for (const k of STORE_KEYS) {
      const b = state.books[k], last = b.history[b.history.length - 1];
      out[k] = { shoppers: state.closed[k] ? 0 : last.shoppers, reserve: b.reserve, returned: b.returned, unclaimed: b.unclaimed, profit: b.profit,
        closed: state.closed[k] || 0, lowest: Math.min(...b.history.map(e => e.reserve)),
        netBasket: (() => { const h = b.history.slice(-6), n = h.reduce((t, e) => t + e.shoppers, 0); return n ? h.reduce((t, e) => t + e.sales - e.claimed, 0) / n : 0; })(),
        coverage: last.hoursNeeded ? last.hours / last.hoursNeeded : 0, price: last.price };
    }
    return out;
  }

  const api = { SOURCES, WORLD, OPEN_DEFAULTS, EVENTS, PLACES, STORE_KEYS, createTown, step, run, summary, effectivePrice };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.Town = api;
})(typeof window !== 'undefined' ? window : globalThis);
