const moment = require('moment');

exports.getWeek = (date) => {
  const weeknumber = moment(date).isoWeek();
  return weeknumber;
};
