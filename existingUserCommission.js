const { doRound } = require('./doRound');
const { getWeek } = require('./getWeek');
const { processCommissionFee } = require('./processCommissionFee');

exports.existingUserCommission = (user, userInfo, percents, defaultCommission, defaultFee) => {
  let roundedValue;
  const dt = new Date(user.date);
  const week = [];
  const userObj = userInfo.find((x) => x.user_id === user.user_id);
  const weekObj = userObj.week.filter((x) => x.week_number === getWeek(user.date));
  //  Cash Out for Same Week
  if (weekObj.length) {
    weekObj[0].total += user.operation.amount;
    let total = 0;
    total = weekObj[0].total;
    weekObj.total += total;
    if (user.operation.amount > defaultCommission) {
      roundedValue = processCommissionFee(user, percents, defaultCommission);
    }
    else if (total > defaultCommission) {
      const totalCommissionFee = (user.operation.amount * percents) / 100;
      roundedValue = doRound(totalCommissionFee);
    }
    else {
      roundedValue = doRound(defaultFee);
    }
  }

  //  Cash Out for New Week
  else if (weekObj.length === 0) {
    const weekInfo = {
      week_number: getWeek(dt),
      total: user.operation.amount,
    };
    week.push(weekInfo);
    userInfo.push({ user_id: user.user_id, week });

    if (user.operation.amount > defaultCommission) {
      roundedValue = processCommissionFee(user, percents, defaultCommission);
    }
    else {
      roundedValue = doRound(defaultFee);
    }
  }
  return roundedValue;
};
