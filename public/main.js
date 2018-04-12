'use strict';
// This file contains most of the logic controlling the filtering of data
var setName = 'dead';

function changeSet(name) {
	setName = name;
	upDateData();
}
function upDateData() {
	var d = filterData(data);
	var newData = [];

	switch(setName) {
	case 'dead':
		newData = countDead(d);
		break;
	case 'class':
		newData = countClass(d);
		break;
	case 'age':
		newData = countAge(d);
		break;
	case 'sex':
		newData = countSex(d);
	}
	update(newData);
}
function filterData(rawData) {
	// check which checkboxes are ticked
	var filterParams = getParameters();
	//filter raw data
	var dataFilter = function(d){
		var test1 = ((d.Survived == 0) ?filterParams[0]:true);
		var test2 = ((d.Survived == 1) ?filterParams[1]:true);
		return (test1 && test2);
	};
	var filteredData = rawData.filter(dataFilter);
	return filteredData;
}

function getParameters() {
	var filters = document.querySelectorAll('#filters  input');
	var filterStatus = [];
	for (let i = 0; i < filters.length; i++){
		filterStatus[i] = filters[i].checked;
	}
	return filterStatus;
}

// THIS SECTION CONTAINS HELPER FUNCTIONS FOR COUNTING INSTANCES OF VARIOUS VALUES
function countDead(inData) {
	var deadData = [{'label':'Dead', 'value':0},{'label':'Alive', 'value':0}];
	// counting no of survivors
	inData.forEach((obj)=> {
		if (obj.Survived == 0) {
			deadData[0]['value'] ++;
		}
		else deadData[1]['value'] ++;
	});

	return deadData;
}

function countClass(inData) {
	var classData = [{'label':'Third', 'value':0},{'label':'Second', 'value':0},{'label':'First', 'value':0}];

	// counting passangers by class
	inData.forEach((obj)=> {
		switch(obj.Pclass) {
		case 1:
			classData[2]['value'] ++;
			break;
		case 2:
			classData[1]['value'] ++;
			break;
		case 3:
			classData[0]['value'] ++;
		}
	});

	return classData;
}

function countAge(inData) {
	var ageData = [{'label': '0-10', 'value':0},
		{'label': '11-18', 'value':0},
		{'label': '19-30', 'value':0},
		{'label': '31-50', 'value':0},
		{'label': '51-70', 'value':0},
		{'label': '70+', 'value':0}
	];

	inData.forEach((obj)=> {
		if (obj.Age === ''){
			return;
		}

		if (obj.Age <=10){
			ageData[0].value ++;
		}
		else if (obj.Age <=18) {
			ageData[1].value ++;
		}
		else if (obj.Age <=30) {
			ageData[2].value ++;
		}
		else if (obj.Age <=50) {
			ageData[3].value ++;
		}
		else if (obj.Age <=70) {
			ageData[4].value ++;
		}
		else {
			ageData[5].value ++;
		}
	});

	return ageData;
}

function countSex(inData) {
	var sexData = [{'label': 'Male', 'value':0},
		{'label':'Female', 'value':0}];
	inData.forEach((obj)=> {
		if (obj.Sex == 'male') {
			sexData[0].value ++;
		}
		else if (obj.Sex == 'female') {
			sexData[1].value ++;
		}
	});

	return sexData;
}
// initializes the graph
upDateData();
