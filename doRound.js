const roundTo = require('round-to');
exports.doRound = (fee) => { return roundTo.up(fee, 2).toFixed(2); };
