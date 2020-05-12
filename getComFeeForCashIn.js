const { doRound } = require('./doRound');

exports.getComFeeForCashIn = (cashInData, cashInCommissionFee) => {
  let cf = (cashInData.operation.amount * cashInCommissionFee.percents) / 100;
  if (cf > cashInCommissionFee.max.amount) {
    cf = cashInCommissionFee.max.amount;
  }
  return (doRound(cf));
};
