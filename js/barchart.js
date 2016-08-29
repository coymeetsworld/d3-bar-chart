$(document).ready(function() {

  var chartWidth = 1200;
  var chartHeight = 1200;

  var scaleDisplay = d3.scaleLinear().range([chartHeight, 0]);
  var chart = d3.select('.chart').attr("width", chartWidth).attr("height", chartHeight);

  $.getJSON('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(GDPdata) {
	var max = d3.max(d3.values(GDPdata.data));
	console.log("MAX GDP2: " + max[1]);

	scaleDisplay.domain([0, d3.max(d3.values(GDPdata.data))[1] ]);

	var barWidth = chartWidth / GDPdata.data.length;

  	var bar = chart.selectAll("g")
	               .data(GDPdata.data)
				   .enter().append("g")
      		       .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

    bar.append("rect")
	   .attr("y", function(d) { return scaleDisplay(d[1]); })
       .attr("height", function(d) { return chartHeight - scaleDisplay(d[1]); })
       .attr("width", barWidth - 1);
	
  	bar.append("text")
       .attr("x", barWidth / 2)
	   .attr("y", function(d) { return scaleDisplay(d[1]) + 3; })
       .attr("dy", ".75em")
       .text(function(d) { return d[1]; });
  });
});