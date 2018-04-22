'use strict';
// This file contains most of the logic controlling the filtering of data
var setName = 'dead';

function changeSet(name) {
	setName = name;
	//update styling
	var buttons = document.querySelectorAll('#datasets1 button');

	for (let i = 0; i < buttons.length; i++) {
		if (buttons[i].innerText == name){
			buttons[i].classList.add('active');
			buttons[i].setAttribute('aria-pressed','true');
		}
		else {
			buttons[i].classList.remove('active');
			buttons[i].setAttribute('aria-pressed','false');
		}
	}
	upDateData();
}
function validateAge() {
	var min = document.querySelector('#min').value;
	var max = document.querySelector('#max').value;

	if (parseInt(min) > parseInt(max)) {
		document.querySelector('#min').value = max;
		document.querySelector('#max').value = min;

	}
	upDateData();

	// // Checks if input is valid
	// if (min >=1 && min <= max && max <= 100){
	// 	console.log('ok!');
	// 	document.querySelector('#error1').hidden = true;
	// 	document.querySelector('#error2').hidden = true;
	// 	document.querySelector('#error3').hidden = true;
	// 	document.querySelector('#error4').hidden = true;
	// 	document.querySelector('#error5').hidden = true;
	//
	// 	upDateData();
	// }
	// // Handle error messages
	// else {
	// 	document.querySelector('#error1').hidden = (min <=0 ?false:true);
	// 	document.querySelector('#error2').hidden = (min >= 100 ?false:true);
	// 	document.querySelector('#error3').hidden = (max <=0 ?false:true);
	// 	document.querySelector('#error4').hidden = (max >= 100 ?false:true);
	// 	document.querySelector('#error5').hidden = (min > max ?false: true);
	// }
}

function upDateData() {
	var d = filterData(data);
	var newData = [];
	// console.log(d);
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
		break;
	case 'embark':
		newData = countEmbark(d);
	}

	update(newData);
}

function filterData(rawData) {
	// check which checkboxes are ticked
	var filterParams = getParameters();
	 console.log(filterParams);
	//filter raw data
	var dataFilter = function(d){
		var test = [
			((d.Survived == 0) ?filterParams[0].status:true),
			((d.Survived == 1) ?filterParams[1].status:true),
			((d.Pclass == 3) ?filterParams[2].status:true),
			((d.Pclass == 2) ?filterParams[3].status:true),
			((d.Pclass == 1) ?filterParams[4].status:true),
			((d.Sex === "male") ?filterParams[5].status:true),
			((d.Sex === "female") ?filterParams[6].status:true),
			((d.Embarked === "C") ?filterParams[7].status:true),
			((d.Embarked === "Q") ?filterParams[8].status:true),
			((d.Embarked === "S") ?filterParams[9].status:true),
			((d.Age==="") ?(filterParams[10].status):true),
			((d.Age!="") ?(d.Age >= filterParams[11].value):true),
			((d.Age!="") ?(d.Age <= filterParams[12].value):true)
		];

		for (let i = 0; i < test.length ; i++){
			if (!test[i]) {
				return false;
			}
		}
		return true;
	};
	var filteredData = rawData.filter(dataFilter);
	return filteredData;
}

function getParameters() {
	var filters = document.querySelectorAll('#filters  input');
	var filterStatus = [];
	for (let i = 0; i < filters.length; i++){
		filterStatus[i] = {'label':filters[i].id,'status':filters[i].checked};
	}
	var minVal = parseInt(document.querySelector('#min').value);
	var maxVal = parseInt(document.querySelector('#max').value);
	console.log(minVal, maxVal);
	 filterStatus[filters.length] = {'label':'min', 'value': minVal};
	 filterStatus[filters.length+1] = {'label':'max', 'value': maxVal};
	return filterStatus;
}

// THIS SECTION CONTAINS HELPER FUNCTIONS FOR COUNTING INSTANCES OF VARIOUS VALUES
function countDead(inData) {
	var deadData = [{'label':'Died', 'value':0},{'label':'Survived', 'value':0}];
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
	var classData = [{'label':'3rd class', 'value':0},{'label':'2nd class', 'value':0},{'label':'1st class', 'value':0}];

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
		{'label': '70+', 'value':0},
		{'label': 'N/A', 'value':0}
	];

	inData.forEach((obj)=> {
		if (obj.Age === ''){
			ageData[6].value ++;
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

function countEmbark(inData) {
	var embarkData = [{'label': 'Cherbourg', 'value':0},
		{'label':'Queenstown', 'value':0},
		{'label':'Southampton', 'value':0},
		{'label': 'N/A', 'value': 0}];

	inData.forEach((obj)=> {
		if (obj.Embarked == 'C') {
			embarkData[0].value ++;
		}
		else if (obj.Embarked == 'Q') {
			embarkData[1].value ++;
		}
		else if (obj.Embarked == "S") {
			embarkData[2].value ++;
		}
		else {
			embarkData[3].value ++;
		}
	});

	return embarkData;
}
// initializes the graph
upDateData();

// redraw graph on window resize
window.addEventListener("resize", upDateData);
