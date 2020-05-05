const axios = require('axios');
const fs = require('fs');

const cash_out = {
	person_type: {
		natural: {
		},
		juridical: {}
	}
};

let defaultFee = 0;
let percents = 0;
let userInfo = [];
let cashInOutData = [];
let week = [];
let week_info = {};
let exceededAmount = 0;
let totalCommissionFee = 0;
let cashInCommissionFee;
let default_Commission = 1000;


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

let getWeek = function (date) {
	let dt = new Date(date);
	return dt.getWeek()
};

// Cash In Api
const cashInApi = new Promise(function (resolve, reject) {
	resolve(axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-in')
		.then(response => {
			cashInCommissionFee = response.data;			
		})
		.catch(error => {
			//console.log(error);			
		}));
});

// Cash Out Natural Persons Api Call
const naturalPersonsApi = function () {
	return new Promise(function (resolve, reject) {
		resolve(axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/natural')
			.then(response => {
				cashOutData = response.data;
				cash_out.person_type.natural = response.data;
			}).catch(error => {
				//console.log(error);				
			})
		);
	});
};

// Cash Out Legal Persons Api Call
const legalPersonsApi = function () {
	return new Promise(function (resolve, reject) {
		resolve(axios.get('http://private-38e18c-uzduotis.apiary-mock.com/config/cash-out/juridical')
			.then(response => {
				cashOutData = response.data;
				cash_out.person_type.juridical = response.data;
			}).catch(error => {
				//console.log(error);				
			}))
	});
};

const processCommissionFee = function (value, percents) {
	exceededAmount = value.operation.amount - default_Commission;
	totalCommissionFee = (exceededAmount * percents) / 100;
	cashInOutData.push(doRound(totalCommissionFee));
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
		cashInOutData.push(doRound(defaultFee));
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
			cashInOutData.push(doRound(totalCommissionFee));
		}
		else {
			cashInOutData.push(doRound(defaultFee));
		}
		weekObj.total = weekObj.total + total;
	}

	//Cash Out for New Week
	else if (weekObj.length == 0) {
		if (value.operation.amount > default_Commission) {			
			processCommissionFee(value, percents);
		}
		else {
			cashInOutData.push(doRound(defaultFee));
		}
		week_info = {
			week_number: getWeek(dt),
			total: value.operation.amount
		};
		week.push(week_info);
		userInfo.push({ "user_id": value.user_id, week });
	}
};

const prepareCommissionFeeForNaturalPerson = function (value) {

	// new user		
	if (userInfo.findIndex(x => x.user_id === value.user_id) === -1) {		
		prepareCommissionFeeForNewPerson(value);
	}

	// Existing User
	else {
		prepareCommissionFeeForExistingPerson(value);		
	}
};

const prepareCommissionFeeForLegalPerson = function (value) {
	totalCommissionFee = (value.operation.amount * percents) / 100;
	if (totalCommissionFee < cash_out.person_type[value.user_type].min.amount) {
		cashInOutData.push(doRound(cash_out.person_type[value.user_type].min.amount));
	}
	else {
		cashInOutData.push(doRound(totalCommissionFee));
	}
};

const doRound = function (fee) {	
	return Number(Math.ceil(fee + 'e2') + 'e-2').toFixed(2); 
};

const calculateCommissionFeeForCashIn = function (value) {
	let cf = (value.operation.amount * cashInCommissionFee.percents) / 100;
	if (cf > cashInCommissionFee.max.amount) {
		cf = cashInCommissionFee.max.amount;
	}
	cashInOutData.push(doRound(cf));
};



const calculateCommissionFee = function () {
	let inputData;
	let cashOutTotal = 0;
	fs.readFile('input.json', 'utf8', function (error, data) {
		inputData = JSON.parse(data);		
		inputData.forEach(function (value) {			
			// Cash_In	
			if (value.type == "cash_in") { 					
				calculateCommissionFeeForCashIn(value);
			}
			// Cash_Out
			else if (value.type == "cash_out") {				
				percents = cash_out.person_type[value.user_type].percents;			

				// Natural Persons Commission Fee
				if (value.user_type == "natural") {
					prepareCommissionFeeForNaturalPerson(value);
				}

				// Legal Persons Commission Fee
				else if (value.user_type == "juridical") { 
					prepareCommissionFeeForLegalPerson(value);
				}
			}
		});

		console.log("Output");	
		console.log("-----------------");			

		cashInOutData.forEach(function (value) {
			console.log(value);			
		});
		
	});
};

const cashInOutDetails = function () {
	cashInApi
		.then(naturalPersonsApi)
		.then(legalPersonsApi)
		.then(calculateCommissionFee)
		.catch(function (error) {
			console.log(error.message)
		})
}
cashInOutDetails();
