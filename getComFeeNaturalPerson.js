const { newUserCommission } = require('./newUserCommission');
const { existingUserCommission } = require('./existingUserCommission');

exports.getComFeeNaturalPerson = (user, userInfo, percents, defaultCommission, defaultFee) => {
  let roundedValue;
  // new user
  if (userInfo.findIndex((x) => x.user_id === user.user_id) === -1) {
    roundedValue = newUserCommission(user, userInfo, percents, defaultCommission, defaultFee);
  }
  // Existing User
  else {
    roundedValue = existingUserCommission(user, userInfo, percents, defaultCommission, defaultFee);
  }
  return roundedValue;
};
