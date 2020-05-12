const axios = require('axios');
const { calculateCommissionFee } = require('./calculateCommissionFee');

async function cashInOutDetails() {
  try {
    const response = await axios.all([
      // Cash In Api
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in'),
      // Cash Out Natural Persons Api
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural'),
      // Cash Out Legal Persons Api
      axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical'),
    ]);
    const cashInData = response[0].data;
    const cashOutNaturalData = response[1].data;
    const cashOutJuridicalData = response[2].data;
    calculateCommissionFee(cashInData, cashOutNaturalData, cashOutJuridicalData);
  }
  catch (error) {
    console.error(error);
  }
}
cashInOutDetails();
