var margin ={top:20, right:30, bottom:30, left:40},
    width=960-margin.left - margin.right,
    height=500-margin.top-margin.bottom;

// scale to ordinal because x axis is not numerical
var x = d3.scale.ordinal().rangeRoundBands([0, width], .1);

//scale to numerical value by height
var y = d3.scale.linear().range([height, 0]);

var color = d3.scale.category10();

var chart = d3.select("#chart-container")
              .append("svg")  //append svg element inside #chart
              .attr("width", width+(2*margin.left)+margin.right)    //set width
              .attr("height", height+margin.top+margin.bottom);  //set height
var xAxis = d3.svg.axis()
              .scale(x)
              .orient("bottom");  //orient bottom because x-axis will appear below the bars

var yAxis = d3.svg.axis()
              .scale(y)
              .orient("left");

d3.json("data.json", function(error, data) {
  x.domain(data.map(function(d){ return d.personName; }));
  y.domain([0, d3.max(data, function(d){return d.age; })]);

  var bar = chart.selectAll("g")
    .data(data)
    .enter().append("g")
    .attr("transform", function(d, i){
    return "translate("+x(d.personName)+", 0)";
    });

var line = d3.svg.line()
  .x(function(d,i) { return x(i) })
  .y(function(d) { return y(d.age) });

  bar.append("rect")
      .attr("y", function(d) { return y(d.age); })
      .attr("x", function(d,i){ return x.rangeBand()+(margin.left/4); })
      .attr("height", function(d) { return height - y(d.age);})
      .attr("width", x.rangeBand())  //set width base on range on ordinal data
      .attr("fill", function(d,i) { return color(i) });

  bar.append("text")
      .attr("x", x.rangeBand()+margin.left )
      .attr("y", function(d) { return y(d.age) -10; })
      .attr("dy", ".75em")
      .text(function(d) { return d.age; });

  chart.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate("+margin.left+","+ height+")")
        .call(xAxis);

  chart.append("line")
    .attr("d", line(data));

  chart.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate("+margin.left+",0)")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Age");
});

function type(d) {
    d.age = +d.age; // coerce to number
    return d;
  }
