const axios = require('axios');
const fs = require('fs');
// Returns the ISO week of the date.
Date.prototype.getWeek = function () {
	let date = new Date(this.getTime());
	date.setHours(0, 0, 0, 0);
	// Thursday in current week decides the year.
	date.setDate(date.getDate() + 3 - (date.getDay() + 6) % 7);
	// January 4 is always in week 1.
	let week1 = new Date(date.getFullYear(), 0, 4);
	// Adjust to Thursday in week 1 and count number of weeks from date to week1.
	return 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
		- 3 + (week1.getDay() + 6) % 7) / 7);
};

const getWeek = function (date) {
	let dt = new Date(date);
	return dt.getWeek()
};

let defaultFee = 0;
let percents = 0;
let userInfo = [];
let cashInData = [];
let cashOutData = [];
let week = [];
let week_info = {};
let exceededAmount = 0;
let totalCommissionFee = 0;
let cashInCommissionFee = {
	"percents": 0.03,
	"max": {
		"amount": 5,
		"currency": "EUR"
	}
};
let default_Commission = 1000;


const cash_out = {
	person_type: {
		natural: {
			"percents": 0.3,
			"week_limit": {
				"amount": 1000,
				"currency": "EUR"
			}
		},
		juridical: {
			"percents": 0.3,
			"min": {
				"amount": 0.5,
				"currency": "EUR"
			}
		}
	}
};

const doRound = function (fee) {
	return Number(Math.ceil(fee + 'e2') + 'e-2').toFixed(2);
};

const processCommissionFee = function (value, percents) {
	exceededAmount = value.operation.amount - default_Commission;
	totalCommissionFee = (exceededAmount * percents) / 100;	
	cashOutData.push(totalCommissionFee.toFixed(2));
	
};

exports.prepareCommissionFeeForNaturalPerson = (value) => {

	// new user		
	if (userInfo.findIndex(x => x.user_id === value.user_id) === -1) {
		prepareCommissionFeeForNewPerson(value);
	}

	// Existing User
	else {
		prepareCommissionFeeForExistingPerson(value);
	}
	return cashOutData[0];
};

const prepareCommissionFeeForNewPerson = function (value) {

	percents = cash_out.person_type[value.user_type].percents;
	let dt = new Date(value.date);
	let week_info = {
		week_number: getWeek(dt),
		total: value.operation.amount
	};
	week.push(week_info);
	userInfo.push(
		{
			"user_id": value.user_id,
			week
		});
	if (value.operation.amount > default_Commission) {
		processCommissionFee(value, percents);
	}
	else {
		cashOutData.push(doRound(defaultFee));
	}
};

const prepareCommissionFeeForExistingPerson = function (value) {

	let dt = new Date(value.date);
	percents = cash_out.person_type[value.user_type].percents;
	let user = userInfo.find(x => x.user_id === value.user_id);
	let weekObj = user.week.filter(x => x.week_number == getWeek(value.date));

	//Cash Out for Same Week
	if (weekObj.length) {
		let total = weekObj[0].total = weekObj[0].total + value.operation.amount;

		if (value.operation.amount > default_Commission) {
			processCommissionFee(value, percents);
		}
		else if (total > default_Commission) {
			totalCommissionFee = (value.operation.amount * percents) / 100;
			cashOutData.push(doRound(totalCommissionFee));
		}
		else {
			cashOutData.push(doRound(defaultFee));
		}
		weekObj.total = weekObj.total + total;
	}

	//Cash Out for New Week
	else if (weekObj.length == 0) {
		if (value.operation.amount > default_Commission) {
			processCommissionFee(value, percents);
		}
		else {
			cashOutData.push(doRound(defaultFee));
		}
		week_info = {
			week_number: getWeek(dt),
			total: value.operation.amount
		};
		week.push(week_info);
		userInfo.push({ "user_id": value.user_id, week });
	}
};

exports.calculateCommissionFeeForCashIn = (value) => {
	let cf = (value.operation.amount * cashInCommissionFee.percents) / 100;
	if (cf > cashInCommissionFee.max.amount) {
		cf = cashInCommissionFee.max.amount;
	}
	cashInData.push(doRound(cf));
	return cashInData[0];
};

exports.prepareCommissionFeeForLegalPerson = (value) => {
	totalCommissionFee = (value.operation.amount * percents) / 100;
	let legalPersonCommission;
	if (totalCommissionFee < cash_out.person_type[value.user_type].min.amount) {
		legalPersonCommission = doRound(cash_out.person_type[value.user_type].min.amount);
		cashOutData.push(doRound(cash_out.person_type[value.user_type].min.amount));
	}
	else {
		cashOutData.push(doRound(totalCommissionFee));
		legalPersonCommission = doRound(totalCommissionFee);
	}
	return legalPersonCommission;
};






//module.exports = prepareCommissionFeeForNewPerson;