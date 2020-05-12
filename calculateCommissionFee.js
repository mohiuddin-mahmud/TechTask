const fs = require('fs');
const { getComFeeForCashIn } = require('./getComFeeForCashIn');
const { getComFeeNaturalPerson } = require('./getComFeeNaturalPerson');
const { getComFeeLegalPerson } = require('./getComFeeLegalPerson');

exports.calculateCommissionFee = (cashInData, cashOutNaturalData, cashOutJuridicaData) => {
  let inputData;
  let percents = 0;
  let cashInCommissionFee;
  const cashInOutData = [];
  const defaultCommission = 1000;
  const userInfo = [];
  const cashOut = {
    person_type: {
      natural: {
      },
      juridical: {},
    },
  };
  const defaultFee = 0;

  fs.readFile('input.json', 'utf8', (error, data) => {
    inputData = JSON.parse(data);
    inputData.forEach((value) => {
      let result;
      //  Cash_In
      if (value.type === 'cash_in') {
        cashInCommissionFee = cashInData;
        result = getComFeeForCashIn(value, cashInCommissionFee);
        cashInOutData.push(result);
      }
      //  cashOut
      if (value.type === 'cash_out') {
        // Natural Persons Commission Fee
        if (value.user_type === 'natural') {
          cashOut.person_type.natural = cashOutNaturalData;
          percents = cashOut.person_type[value.user_type].percents;
          result = getComFeeNaturalPerson(value, userInfo, percents, defaultCommission, defaultFee);
          cashInOutData.push(result);
        }
        // Legal Persons Commission Fee
        else if (value.user_type === 'juridical') {
          cashOut.person_type.juridical = cashOutJuridicaData;
          percents = cashOut.person_type[value.user_type].percents;
          const minAmount = cashOut.person_type[value.user_type].min.amount;
          result = getComFeeLegalPerson(value, percents, minAmount);
          cashInOutData.push(result);
        }
      }
    });
    console.log('Output');
    console.log('-----------------');
    cashInOutData.forEach((value) => {
      console.log(value);
    });
  });
};
