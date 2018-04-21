'use strict';

// Setting up the graph
const margin = {
	top: 50,
	right: 10,
	bottom: 40,
	left: 50
};

const animateDuration = 1000;
const animateDelay = 30;
// var barWidth = 35;
// var barOffset = 5;

// creates svg

var chartDiv = document.getElementById('chart');
var svg = d3.select(chartDiv).append('svg')

// creates axis
d3.select('svg')
	.append('g')
	.attr('id', 'vAxis');

	// creates label
var vAxisLabel = d3.select('svg').append('text')
// creates group which holds the bars
var myChart = d3.select('svg').append('g');

var total = d3.select('svg')
	.append('text')
	.attr('id','total')

function update(myData) {
// var tooltip = d3.select('body').append('div')
//     .style('position', 'absolute')
//     .style('background', '#f4f4f4')
//     .style('padding', '5 15px')
//     .style('border', '1px #333 solid')
//     .style('border-radius', '5px')
//     .style('opacity', '0')
// Draws/Redraws graph
var width = chartDiv.clientWidth - margin.right - margin.left;
var height = chartDiv.clientHeight - margin.top - margin.bottom;

svg
		.attr('width', width + margin.right + margin.left)
		.attr('height', height + margin.top + margin.bottom)

	myChart.attr('transform', 'translate( '+ (margin.left + 1) +', '+ margin.top +')')
		.style('background', '#f4f4f4')
		.attr('class','bars');



	vAxisLabel.attr('transform','rotate(-90)')
		.attr('y', 45 - margin.left)
		.attr('x', 1 - (height/2))
		.attr('dy', '1em')
		.style('text-anchor', 'middle')
		.text('# of People as percentage');


	total.attr('x', width/2 + margin.left)
		.attr('y', -10 + margin.top)
		.style('text-anchor', 'middle')
		.attr('class','text-label')
		.text('Total sample size: ' + 0);

	var top = myData.reduce(function(acc,current){
		return acc + current.value;
	},0);

	var yScale = d3.scaleLinear()
		.domain([0, top])
		.range([0, height]);

	var xScale = d3.scaleBand()
		.domain(d3.range(0, myData.length),.03)
		.range([0, width]);

	var colors = d3.scaleLinear()
		.domain([0, myData.length])
		.range(['#90ee90','#30c230']);

	var bars = d3.select('.bars').selectAll('g')
		.data(myData);
	//creates a group to contain each bar
	var bar = bars.enter().append('g').attr('class','bar');
	// fills each g with a rect
	bar.append('rect')
		.style('fill', function(d, i){
			return colors(i);
		})
		.attr('width', xScale.bandwidth())
		.attr('height', function(d){
			return yScale(d.value);
		})
		.attr('x', function(d,i){
			return xScale(i);
		})
		.attr('y', function(d){
			return height - yScale(d.value);
		});
	// creates a label for each bar
	bar.append('text')
		.attr('class', 'nameLabel')
		.attr('x', function(d,i){
			return xScale(i) + xScale.bandwidth()/2;
		})
		.attr('y', function(){
			return height;
		})
		.attr('dy', '.75em')
		.style('text-anchor', 'middle')
		.text(function(d){
			return d.label;
		});
	// creates a label showing the value
	bar.append('text')
		.attr('class', 'dLabel')
		.attr('x', function(d,i){
			return xScale(i) + xScale.bandwidth()/2;
		})
		.attr('y', function(d){
			return height - yScale(d.value) - 20;
		})
		.attr('dy', '.75em')
		.style('text-anchor', 'middle')
		.text(function(d){
			return d.value;
		});

	// Update existing bars

	// Remove empty bars
	bars.exit().remove();

	// create the axis labels
	var vScale = d3.scaleLinear()
		.domain([0, 1])
		.range([height, 0]);

	// V axis
	var vAxis = d3.axisLeft(vScale)
		.tickFormat(d3.format('.0%'));
	// update V guide
	var vGuide = d3.select('svg')
		.select('#vAxis');
	vAxis(vGuide);
	vGuide.attr('transform','translate( '+ margin.left +', '+ margin.top +')');
	vGuide.selectAll('path')
		.style('fill', 'none')
		.style('stroke', '#000');
	vGuide.selectAll('line')
		.style('stroke', '#000');

	// animations to update values
	d3.selectAll('rect').data(myData)
		.transition()
		.attr('width', xScale.bandwidth())
		.attr('height', function(d){
			return yScale(d.value);
		})
		.attr('x', function(d,i){
			return xScale(i);
		})
		.attr('y', function(d){
			return height - yScale(d.value);
		})
		.duration(animateDuration)
		.delay(function(d,i){
			return i*animateDelay;
		})
		.ease(d3.easeExp);

	d3.selectAll('.dLabel').data(myData)
		.transition()
		.attr('x', function(d,i){
			return xScale(i) + xScale.bandwidth()/2;
		})
		.attr('y', function(d){
			return height - yScale(d.value) - 20;
		})
		.text(function(d){
			return d.value;
		})
		.duration(animateDuration)
		.delay(function(d,i){
			return i*animateDelay;
		})
		.ease(d3.easeExp);

	d3.selectAll('.nameLabel').data(myData)
		.transition()
		.attr('x', function(d,i){
			return xScale(i) + xScale.bandwidth()/2;
		})
		.attr('y', function(){
			return height;
		})
		.text(function(d){
			return d.label;
		})
		.duration(animateDuration)
		.delay(function(d,i){
			return i*animateDelay;
		})
		.ease(d3.easeExp);

	d3.select('svg #total')
		.transition()
		.text('Total sample size: ' + top)
		.duration(animateDuration)
		.delay(function(d,i){
			return i*animateDelay;
		})


}

// SHould just add these into the html?
d3.select('#datasets1').append('button')
	.attr('class','btn btn-outline-secondary active')
	.attr('data-toggle', 'button')
	.text('Death')
	.on('click', function() {
		changeSet('dead');
	});
d3.select('#datasets1').append('button')
	.attr('class','btn btn-outline-secondary')
	.attr('data-toggle', 'button')
	.text('Class')
	.on('click', function() {
		changeSet('class');
	});

d3.select('#datasets1').append('button')
	.attr('class','btn btn-outline-secondary')
	.attr('data-toggle', 'button')
	.text('Age')
	.on('click', function() {
		changeSet('age');
	});

d3.select('#datasets1').append('button')
	.attr('class','btn btn-outline-secondary')
	.attr('data-toggle', 'button')
	.text('Gender')
	.on('click', function() {
		changeSet('sex');
	});

d3.select('#datasets1').append('button')
	.attr('class','btn btn-outline-secondary')
	.attr('data-toggle', 'button')
	.text('Embark')
	.on('click', function() {
		changeSet('embark');
	});
