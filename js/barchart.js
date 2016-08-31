$(document).ready(function() {

  var margin = {top: 20, right: 20, bottom: 50, left: 70}
  var chartWidth = 1400 - margin.left - margin.right;
  var chartHeight = 600 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");

  //var x = d3.scaleLinear().range([chartHeight, 0]);
  var x = d3.scaleTime().range([0, chartWidth]);
  var y = d3.scaleLinear().range([chartHeight, 0]);


  //var chart = d3.select('.chart').attr("width", chartWidth+margin.left+margin.right).attr("height", chartHeight+margin.top+margin.bottom);
  var chart = d3.select('.chart').attr("width", chartWidth+margin.left+margin.right).attr("height", chartHeight+margin.top+margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, gdpData) {
	if (error) throw error;

	console.log(gdpData.data);

	gdpData.data.forEach(function(d) {
		d[0] = parseTime(d[0]);
	});

	x.domain(d3.extent(gdpData.data, function(d) { return d[0]; }));
	y.domain([0, d3.max(gdpData.data, function(d) { return d[1]; } ) ]);

	//Add x-axis
	chart.append("g")
     .attr("transform", "translate(0," + chartHeight + ")")
	 .call(d3.axisBottom(x));
	
	//Add text label for x-axis
	chart.append("text")
		 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight + margin.top + 20) + ")")
		 .style("text-anchor", "middle")
		 .text("Year");

    //Add y-axis
    chart.append("g")
		 .call(d3.axisLeft(y));

    // text label for the y axis
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (chartHeight / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("GDP"); 

		 
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
       .text(function(d) { return d[1]; });
  });

});