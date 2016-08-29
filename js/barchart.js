$(document).ready(function() {

  var margin = {top: 20, right: 20, bottom: 50, left: 70}
  var chartWidth = 1000 - margin.left - margin.right;
  var chartHeight = 1000 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");

  //var x = d3.scaleLinear().range([chartHeight, 0]);
  var x = d3.scaleTime().range([0, chartWidth]);


  var valueLine = d3.line()
  					.x(function(d) { console.log("d: " + d); return x(d[0]); });

  //var chart = d3.select('.chart').attr("width", chartWidth+margin.left+margin.right).attr("height", chartHeight+margin.top+margin.bottom);
  var chart = d3.select('.chart').attr("width", chartWidth+margin.left+margin.right).attr("height", chartHeight+margin.top+margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, gdpData) {
	if (error) throw error;

	console.log(gdpData.data);

	gdpData.data.forEach(function(d) {
		d[0] = parseTime(d[0]);
	});

	x.domain(d3.extent(gdpData.data, function(d) { return d[0]; }));
	//Add valueline path
	chart.append("path")
       .data([gdpData])
	   .attr("class", "line")
	   .attr("d", valueLine);     

	//Add x-axis
	chart.append("g")
     .attr("transform", "translate(0," + chartHeight + ")")
	 .call(d3.axisBottom(x));
	
	//Add text label for x-axis
	chart.append("text")
		 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight + margin.top + 20) + ")")
		 .style("text-anchor", "middle")
		 .text("Year");


		 /*
	var max = d3.max(d3.values(gdpData.data));
	var barWidth = chartWidth / gdpData.data.length;
  	var bar = chart.selectAll("g")
	               .data(gdpData.data)
				   .enter().append("g")
      		       .attr("transform", function(d, i) { return "translate(" + i * barWidth + ", 0)"; });

    bar.append("rect")
	   .attr("y", function(d) { return x(d[1]); })
       .attr("height", function(d) { return chartHeight - x(d[1]); })
       .attr("width", barWidth - 1);
	
  	bar.append("text")
       .attr("x", barWidth / 2)
	   .attr("y", function(d) { return x(d[1]) + 3; })
       .attr("dy", ".75em")
       .text(function(d) { return d[1]; });*/
  });

});