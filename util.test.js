const {calculateCommissionFeeForCashIn, prepareCommissionFeeForNaturalPerson, prepareCommissionFeeForLegalPerson } = require("./util");

// Calculate Cash In Commission Fee
let cashInObj = { "date": "2016-01-05", "user_id": 1, "user_type": "natural", "type": "cash_in", "operation": { "amount": 200.00, "currency": "EUR" } };
test("Cash In Commission Fee", () => {
    expect(calculateCommissionFeeForCashIn(cashInObj)).toBe("0.06");
});


// Calculate Cash Out Commission Fee for Natural Person
let cashOutNaturalPersonObj  = { "date": "2016-01-06", "user_id": 1, "user_type": "natural", "type": "cash_out", "operation": { "amount": 30000, "currency": "EUR" } };

test("Cash Out Commission Fee for Natural Person ", () => {
    expect(prepareCommissionFeeForNaturalPerson(cashOutNaturalPersonObj)).toBe("87.00");
});

// Calculate Cash Out Commission Fee for Legal Person
let cashOutLegalPersonObj = { "date": "2016-01-06", "user_id": 2, "user_type": "juridical", "type": "cash_out", "operation": { "amount": 300.00, "currency": "EUR" } };

test("Cash Out Commission Fee for Legal Person ", () => {   
    expect(prepareCommissionFeeForLegalPerson(cashOutLegalPersonObj)).toBe("0.90");
});
