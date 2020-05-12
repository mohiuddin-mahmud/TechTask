const { doRound } = require('./doRound');
const { getWeek } = require('./getWeek');
const { processCommissionFee } = require('./processCommissionFee');

exports.newUserCommission = (user, userInfo, percents, defaultCommission, defaultFee) => {
  const dt = new Date(user.date);
  const week = [];
  const weekInfo = {
    week_number: getWeek(dt),
    total: user.operation.amount,
  };
  let roundedValue;
  week.push(weekInfo);
  userInfo.push(
    {
      user_id: user.user_id,
      week,
    },
  );
  if (user.operation.amount > defaultCommission) {
    roundedValue = processCommissionFee(user, percents, defaultCommission);
  }
  else {
    roundedValue = doRound(defaultFee);
  }
  return roundedValue;
};
