$(document).ready(function() {

  function hideTooltip() {
    tooltip.setAttributeNS(null,"visibility","hidden");
  }
  function renderTooltip(x, y, data)
  {
	console.log(tooltip);
	console.log(data);
    tooltip.setAttributeNS(null,"x",x+30);
    tooltip.setAttributeNS(null,"y",y+5);
    tooltip.setAttributeNS(null,"visibility","visible");
	var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

	d3.select("#tooltip").html(monthNames[data[0].getMonth()] + " " + data[0].getFullYear() + ": $" + data[1] + " Billion");

	/*length = tooltip.getComputedTextLength();
	tooltip_bg.setAttributeNS(null,"width",length+20);
	tooltip_bg.setAttributeNS(null,"height",50);
    tooltip_bg.setAttributeNS(null,"x",x-75);
    tooltip_bg.setAttributeNS(null,"y",y-30);
    tooltip_bg.setAttributeNS(null,"visibility","visibile");*/
  }

  var margin = {top: 20, right: 30, bottom: 30, left: 40}
  var chartWidth = 1400 - margin.left - margin.right;
  var chartHeight = 600 - margin.top - margin.bottom;

  var parseTime = d3.timeParse("%Y-%m-%d");

  var x = d3.scaleTime().range([0, chartWidth]);
  var y = d3.scaleLinear().range([chartHeight, 0]);

  var chart = d3.select('.chart').attr("width", 1400).attr("height", 600).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  d3.json('https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json', function(error, gdpData) {
	
	if (error) throw error;


	gdpData.data.forEach(function(d) {
		d[0] = parseTime(d[0]);
	});

	x.domain(d3.extent(gdpData.data, function(d) { return d[0]; }));
	y.domain([0, d3.max(gdpData.data, function(d) { return d[1]; } ) ]);

		 
	var barWidth = chartWidth / gdpData.data.length;
  	var bar = chart.selectAll("g")
	               .data(gdpData.data)
				   .enter().append("rect")
				   .attr("title", "GDP")
				   .attr("x", function(d) { return x(d[0]); })
				   .attr("y", function(d) { return y(d[1]); })
				   .attr("height", function(d) { return chartHeight - y(d[1]); })
				   .attr("width", barWidth - 1)
				   .on("mouseout", function() {
		             hideTooltip();
				   })
				   .on("mouseover", function() {
		             renderTooltip(this.x.baseVal.value, this.y.baseVal.value, d3.select(this).datum());
				   });

	//Add x-axis
	chart.append("g")
     .attr("transform", "translate(0," + chartHeight + ")")
	 .call(d3.axisBottom(x));
	
    //Add y-axis
    chart.append("g")
		 .call(d3.axisLeft(y));

    // text label for the y axis
    chart.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", -5)
      .attr("x", -98)
      .attr("dy", "2em")
      .style("text-anchor", "middle")
      .text("Gross Domestic Product (GDP)"); 
	  
	//Add text label for x-axis
	chart.append("text")
		 .attr("transform", "translate(" + (chartWidth/2) + "," + (chartHeight+margin.top+20) + ")")
		 .style("text-anchor", "middle")
		 .style("color", "white")
		 .text("Year");
  });

});