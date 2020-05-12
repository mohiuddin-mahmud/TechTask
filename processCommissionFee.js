const { doRound } = require('./doRound');

exports.processCommissionFee = (user, percents, defaultCommission) => {
  const exceededAmount = user.operation.amount - defaultCommission;
  const totalCommissionFee = (exceededAmount * percents) / 100;
  return doRound(totalCommissionFee);
};
