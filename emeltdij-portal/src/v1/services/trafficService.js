const { numbers } = require('../data/mockData');

// RAW → havi aggregátum (ugyfel + ceg + honap)
function aggregateMonthly(rawRows, monthFilter = null) {
  const aggregates = {};

  rawRows.forEach((t) => {
    if (monthFilter && t.month !== monthFilter) {
      return;
    }

    const num = numbers.find((n) => n.number === t.number);
    if (!num) {
      return;
    }

    const key = `${t.month}-${num.clientId}-${t.companyId}`;

    if (!aggregates[key]) {
      aggregates[key] = {
        id: Object.keys(aggregates).length + 1,
        month: t.month,
        clientId: num.clientId,
        companyId: t.companyId,
        totalCalls: 0,
        totalMinutes: 0,
        totalNetRevenue: 0,
        totalGrossRevenue: 0
      };
    }

    aggregates[key].totalCalls += t.calls;
    aggregates[key].totalMinutes += t.minutes;
    aggregates[key].totalNetRevenue += t.netRevenue;
    aggregates[key].totalGrossRevenue += t.grossRevenue;
  });

  return Object.values(aggregates);
}

module.exports = {
  aggregateMonthly
};
