const { doRound } = require('./doRound');

exports.getComFeeLegalPerson = (cashOutJuridicalData, percents, minAmount) => {
  const totalCommissionFee = (cashOutJuridicalData.operation.amount * percents) / 100;
  let roundedValue;
  if (totalCommissionFee < minAmount) {
    roundedValue = doRound(minAmount);
  }
  else {
    roundedValue = doRound(totalCommissionFee);
  }
  return roundedValue;
};
