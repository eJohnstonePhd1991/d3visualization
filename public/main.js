'use strict'

// First process our data. label:value pairs for each collumn
var deadData = [{"label":"Dead", "value":0},{"label":"Alive", "value":0}];
var classData = [{"label":"Third", "value":0},{"label":"Second", "value":0},{"label":"First", "value":0}];
// counting no of survivors
data.forEach((obj, index)=> {
  if (obj.Survived == 0) {
    deadData[0]["value"] ++;
  }
  else deadData[1]["value"] ++;
});

// counting passangers by class
data.forEach((obj)=> {
  switch(obj.Pclass) {
    case 1:
      classData[2]["value"] ++
      break
    case 2:
        classData[1]["value"] ++
        break
    case 3:
        classData[0]["value"] ++
  }
})

console.log(classData);
// Setting up the graph
const margin = {
  top: 30,
  right: 30,
  bottom: 40,
  left: 50
}
const height = 500 - margin.top - margin.bottom;
const width = 500 - margin.right - margin.left;
const animateDuration = 1000;
const animateDelay = 30;
// var barWidth = 35;
// var barOffset = 5;

// creates svg

d3.select('#chart').append('svg')
  .attr('width', width + margin.right + margin.left)
  .attr('height', height + margin.top + margin.bottom)

// creates group which holds the bars
var myChart = d3.select('svg').append('g');

myChart.attr('transform', 'translate( '+ margin.left +', '+ margin.top +')')
  .style('background', '#f4f4f4')
  .attr('class','bars');

// creates axis
d3.select('svg')
    .append('g')
    .attr('id', 'vAxis')
// creates label
d3.select('svg')
    .append('text')
    .attr('transform','rotate(-90)')
    .attr('y', 45 - margin.left)
    .attr('x', 10 - (height/2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("# of People as percentage of total sample size");

d3.select('svg')
  .append('text')
  .attr('id','total')
  .attr('x', height/2 + margin.left)
  .attr('y', 0 + margin.top)
  .style('text-anchor', 'middle')
  .text('Total sample size: ' + 0);


function update(myData) {
// var tooltip = d3.select('body').append('div')
//     .style('position', 'absolute')
//     .style('background', '#f4f4f4')
//     .style('padding', '5 15px')
//     .style('border', '1px #333 solid')
//     .style('border-radius', '5px')
//     .style('opacity', '0')

var top = myData.reduce(function(acc,current){
  return acc + current.value;
},0)


console.log(myData);
var yScale = d3.scaleLinear()
    .domain([0, top])
    .range([0, height]);

var xScale = d3.scaleBand()
    .domain(d3.range(0, myData.length),.03)
    .range([0, width]);

var colors = d3.scaleLinear()
  .domain([0, myData.length])
  .range(['#90ee90','#30c230'])

var bars = d3.select('.bars').selectAll('g')
    .data(myData)
    //creates a group to contain each bar
var bar = bars.enter().append('g').attr('class','bar')
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
        })
        // creates a label for each bar
        bar.append("text")
        .attr("class", "nameLabel")
        .attr('x', function(d,i){
          return xScale(i) + xScale.bandwidth()/2;
        })
        .attr('y', function(d){
          return height;
        })
        .attr("dy", ".75em")
        .text(function(d){
          return d.label;
        })
        // creates a label showing the value
      bar.append("text")
        .attr("class", "dLabel")
        .attr('x', function(d,i){
          return xScale(i) + xScale.bandwidth()/2;
        })
        .attr('y', function(d){
          return height - yScale(d.value) - 30;
        })
        .attr("dy", ".75em")
        .text(function(d){
          return d.value;
        })

      // Update existing bars

      // Remove empty bars
      bars.exit().remove();

      // create the axis labels
      var vScale = d3.scaleLinear()
          .domain([0, 1])
          .range([height, 0]);

      // V axis
      var vAxis = d3.axisLeft(vScale)
            .tickFormat(d3.format(".0%"))
      // update V guide
      var vGuide = d3.select('svg')
              .select('#vAxis')
      vAxis(vGuide)
      vGuide.attr('transform','translate( '+ margin.left +', '+ margin.top +')')
      vGuide.selectAll('path')
                .style('fill', 'none')
                .style('stroke', '#000')
      vGuide.selectAll('line')
          .style('stroke', '#000')

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
          return height - yScale(d.value)
        })
        .duration(animateDuration)
        .delay(function(d,i){
          return i*animateDelay
        })
        .ease(d3.easeElastic)

      d3.selectAll('.dLabel').data(myData)
      .transition()
      .attr('x', function(d,i){
        return xScale(i) + xScale.bandwidth()/2;
      })
      .attr('y', function(d){
        return height - yScale(d.value) - 30;
      })
      .text(function(d){
        return d.value;
      })
      .duration(animateDuration)
      .delay(function(d,i){
        return i*animateDelay
      })
      .ease(d3.easeElastic)

      d3.selectAll('.nameLabel').data(myData)
      .transition()
      .attr('x', function(d,i){
        return xScale(i) + xScale.bandwidth()/2;
      })
      .attr('y', function(d){
        return height;
      })
      .text(function(d){
        return d.label;
      })
      .duration(animateDuration)
      .delay(function(d,i){
        return i*animateDelay
      })
      .ease(d3.easeElastic)

      d3.select('svg #total')
        .transition()
        .text('Total sample size: ' + top)
        .duration(animateDuration)
        .delay(function(d,i){
          return i*animateDelay
        })
        .ease(d3.easeElastic)

};


d3.select('body').append("button")
          .text("death")
          .on("click", function() {
            update(deadData);
          })
d3.select('body').append("button")
            .text("class")
            .on("click", function() {
                update(classData);
                })

update(deadData);
