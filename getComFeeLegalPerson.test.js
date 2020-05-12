const axios = require('axios');
const { getComFeeLegalPerson } = require('./getComFeeLegalPerson');

test('Calculate Cash Out Commission Fee for Legal Person', async () => {
  const response = await axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical');
  const cashOut = {
    person_type: {
      natural: {
      },
      juridical: {},
    },
  };
  let percents = 0;
  cashOut.person_type.juridical = response.data;
  const cashOutJuridicalData = {
    date: '2016-01-06', user_id: 2, user_type: 'juridical', type: 'cash_out', operation: { amount: 300.00, currency: 'EUR' },
  };
  percents = cashOut.person_type[cashOutJuridicalData.user_type].percents;
  const minAmount = cashOut.person_type[cashOutJuridicalData.user_type].min.amount;
  expect(getComFeeLegalPerson(cashOutJuridicalData, percents, minAmount)).toBe('0.90');
});
