const axios = require('axios');
const { getComFeeNaturalPerson } = require('./getComFeeNaturalPerson');

test('Calculate Cash Out Commission Fee for Natural Person', async () => {
  const response = await axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural');
  const defaultCommission = 1000;
  const userInfo = [];
  const cashOut = {
    person_type: {
      natural: {
      },
      juridical: {},
    },
  };
  let percents = 0;
  const defaultFee = 0;
  cashOut.person_type.natural = response.data;
  const cashOutNaturalPersonObj = {
    date: '2016-01-06', user_id: 1, user_type: 'natural', type: 'cash_out', operation: { amount: 30000, currency: 'EUR' },
  };
  percents = cashOut.person_type[cashOutNaturalPersonObj.user_type].percents;
  expect(getComFeeNaturalPerson(cashOutNaturalPersonObj, userInfo, percents, defaultCommission, defaultFee)).toBe('87.00');
});
