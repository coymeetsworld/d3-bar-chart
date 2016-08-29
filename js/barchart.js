$(document).ready(function() {

  var chartWidth = 1200;
  var barHeight = 20;
  var scaleDisplay = d3.scaleLinear().range([0, chartWidth]);
  var chart = d3.select('.chart').attr("width", chartWidth);



  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(GDPdata) {

	var max = d3.max(d3.values(GDPdata.data));

	console.log("MAX GDP2: " + max[1]);
	scaleDisplay.domain([0, d3.max(d3.values(GDPdata.data))[1] ]);
	chart.attr("height", barHeight * GDPdata.data.length);


  	var bar = chart.selectAll("g")
	               .data(GDPdata.data)
				   .enter().append("g")
      		       .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

    bar.append("rect")
       .attr("width", function(d) { console.log(d); return scaleDisplay(d[1]); })
       .attr("height", barHeight - 1);
	
  	bar.append("text")
       .attr("x", function(d) { return scaleDisplay(d[1]) - 3; })
       .attr("y", barHeight / 2)
       .attr("dy", ".35em")
       .text(function(d) { return d[1]; });
  });
});