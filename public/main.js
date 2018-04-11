// want an array for each chart which counts what we want
'use strict'
var myData = [0,0];

// counting no of survivors
data.forEach((obj, index)=> {
  myData[obj.Survived] ++;
})
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

// creates group which holds the axis and bars
var myChart = d3.select('svg').append('g');

myChart.attr('transform', 'translate( '+ margin.left +', '+ margin.top +')')
  .style('background', '#f4f4f4')

// creates axis
d3.select('svg')
    .append('g')
    .attr('id', 'vAxis')

d3.select('svg')
  .append('g')
  .attr('id', 'hAxis')

function update(myData) {
  console.log("update");
// var tooltip = d3.select('body').append('div')
//     .style('position', 'absolute')
//     .style('background', '#f4f4f4')
//     .style('padding', '5 15px')
//     .style('border', '1px #333 solid')
//     .style('border-radius', '5px')
//     .style('opacity', '0')
const sum = (a,b)=> a+b;
var top = myData.reduce(sum);

  console.log(top);
var yScale = d3.scaleLinear()
    .domain([0, top])
    .range([0, height]);

var xScale = d3.scaleBand()
    .domain(d3.range(0, myData.length))
    .range([0, width]);

var colors = d3.scaleLinear()
  .domain([0, myData.length])
  .range(['#90ee90','#30c230'])

var bars = d3.select('svg g').selectAll('rect')
    .data(myData)
    //Enter new data
    bars.enter().append('rect')
      .style('fill', (d, i)=> {
        return colors(i);
      })
      .attr('width', xScale.bandwidth())
      .attr('height', function(d){
        return yScale(d);
      })
      .attr('x', (d,i)=>{
        return xScale(i);
      })
      .attr('y', function(d){
        return height - yScale(d);
      })

      // Update existing bars
      // bars.style('fill', (d, i)=> {
      //   return colors(i);
      // })
      // .attr('width', xScale.bandwidth())
      // .attr('height', 0)
      // .attr('x', (d,i)=>{
      //   return xScale(i);
      // })
      // .attr('y', height)

      // Remove empty bars
      bars.exit().remove();

      // create the labels
      var vScale = d3.scaleLinear()
          .domain([0, top])
          .range([height, 0]);

      var hScale = d3.scaleBand()
          .domain(d3.range(0, myData.length))
          .range([0, width]);

      // V axis
      var vAxis = d3.axisLeft(vScale)
            .ticks(5)
            .tickPadding(5)
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

          // H axis
          var hAxis = d3.axisBottom(hScale)
                .tickValues(hScale.domain().filter(function(d, i){
                  return !(i % (myData.length/5));
                }))
          // H guide
          var hGuide = d3.select('svg')
                  .select('#hAxis')
          hAxis(hGuide)
          hGuide.attr('transform','translate( '+ margin.left +', '+ (height + margin.top) +')')
          hGuide.selectAll('path')
                    .style('fill', 'none')
                    .style('stroke', '#000')
          hGuide.selectAll('line')
              .style('stroke', '#000')

      // animation
      bars.transition()
        .attr('height', function(d){
          return yScale(d);
        })
        .attr('y', function(d){
          return height - yScale(d)
        })
        .duration(animateDuration)
        .delay(function(d,i){
          return i*animateDelay
        })
        .ease(d3.easeElastic)
};


d3.select('body').append("button")
          .text("+")
          .on("click", function() {
            myData[0] += 100;
            console.log(myData);
            update(myData);
          })

update(myData);
