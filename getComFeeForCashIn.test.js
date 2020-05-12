const axios = require('axios');
const { getComFeeForCashIn } = require('./getComFeeForCashIn');

test('Calculate Cash In Commission Fee', async () => {
  const response = await axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in');
  const cashInCommissionFee = response.data;
  const cashInObj = {
    date: '2016-01-05', user_id: 1, user_type: 'natural', type: 'cash_in', operation: { amount: 200.00, currency: 'EUR' }
  };
  expect(getComFeeForCashIn(cashInObj, cashInCommissionFee)).toBe('0.06');
});
