
const MONTH_NAMES = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const MARGIN = {top: 20, right: 30, bottom: 30, left: 40}
const CHART_WIDTH = 1400 - MARGIN.left - MARGIN.right;
const CHART_HEIGHT = 600 - MARGIN.top - MARGIN.bottom;
const TIME_PARSER = d3.timeParse("%Y-%m-%d");

let x = d3.scaleTime().range([0, CHART_WIDTH]);
let y = d3.scaleLinear().range([CHART_HEIGHT, 0]);

let chart = d3.select(".chart")
              .attr("width", 1400)
              .attr("height", 600)
              .append("g")
              .attr("transform", "translate(" + MARGIN.left + "," + MARGIN.top + ")");

const hideTooltip = () => tooltip.setAttributeNS(null,"visibility", "hidden");

const renderTooltip = (x, y, data) => {
  tooltip.setAttributeNS(null,"x",x+30);
  tooltip.setAttributeNS(null,"y",y+5);
  tooltip.setAttributeNS(null,"visibility", "visible");
  d3.select("#tooltip").html(MONTH_NAMES[data[0].getMonth()] + " " + data[0].getFullYear() + ": $" + data[1] + " Billion");
}

const buildXAxis = (x) => {
  chart.append("g")
       .attr("transform", `translate(0,${CHART_HEIGHT})`)
       .call(d3.axisBottom(x));
  chart.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -5)
       .attr("x", -98)
       .attr("dy", "2em")
       .style("text-anchor", "middle")
       .text("Gross Domestic Product (GDP)"); 
}

const buildYAxis = (y) => {
  chart.append("g").call(d3.axisLeft(y));
  chart.append("text")
       .attr("transform", `translate(${CHART_WIDTH/2},${CHART_HEIGHT+MARGIN.top+20})`)
       .attr("transform", `translate(${CHART_WIDTH/2},${CHART_HEIGHT+MARGIN.top+20})`)
       .style("text-anchor", "middle")
       .style("color", "white")
       .text("Year");
}

const addOneQtrToDate = (d) => {
  var m, addOneQtr = (d = new Date(+d)).getDate()
  d.setMonth(d.getMonth() + 3, 1)
  m = d.getMonth()
  d.setDate(addOneQtr)
  if (d.getMonth() !== m) d.setDate(0)
  return d;
}

d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json", (error, gdpData) => {
  if (error) throw error;

  gdpData.data = gdpData.data.map((d) => {
    d[0] = TIME_PARSER(d[0]); 
    return d;
  });

  let minQtr = d3.min(gdpData.data, d => d[0]);
  let maxQtr = d3.max(gdpData.data, d => d[0]);
  
  // Need to extend x-axis one quarter so it covers all data points
  maxQtr = addOneQtrToDate(maxQtr);
  
  x.domain([minQtr, maxQtr]);
  y.domain([0, d3.max(gdpData.data, d => d[1])]);

  var barWidth = CHART_WIDTH / gdpData.data.length;
  var bar = chart.selectAll("g")
                 .data(gdpData.data)
                 .enter().append("rect")
                 .attr("title", "GDP")
                 .attr("x", (d) => x(d[0]))
                 .attr("y", (d) => y(d[1]))
                 .attr("height", (d) => CHART_HEIGHT - y(d[1]))
                 .attr("width", barWidth - 1)
                 .on("mouseout", function() {
                   hideTooltip();
                 })
                 .on("mouseover", function() {
                   renderTooltip(this.x.baseVal.value, this.y.baseVal.value, d3.select(this).datum());
                 });

  buildXAxis(x);
  buildYAxis(y);
});
