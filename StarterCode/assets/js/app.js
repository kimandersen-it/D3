
//set the stage

var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// svg wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Census Data
d3.csv("cendata.csv")
  .then(function(cendata) {

    // Step 1: Parse the Census data and cast as numbers

    cendata.forEach(function(cendata) {
      cendata.poverty = +cendata.poverty;
      cendata.healthcareLow = +cendata.healthcareLow;
    });

    // Scale functions

    var xLinearScale = d3.scaleLinear()
      .domain([8, d3.max(cendata, d => d.poverty)])
      .range([0, width]);

    var yLinearScale = d3.scaleLinear()
      .domain([2, d3.max(cendata, d => d.healthcareLow)])
      .range([height, 0]);

    // axis functions
   
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append axes 
     
    chartGroup.append("g")
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);

    chartGroup.append("g")
      .call(leftAxis);

    // circles

    var circlesGroup = chartGroup.selectAll("circle")
    .data(cendata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d.poverty))
    .attr("cy", d => yLinearScale(d.healthcareLow))
    .attr("r", "15")
    .attr("fill", "lightblue")
    .attr("opacity", ".8")

  // I need something, presumably here, that will tell it to put the state 
  // abbreviations in the little circles.
    ;


    // Create tool tip

    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([-10, -50])
      .html(function(d) {
        return (`${d.state}<br>Poverty: ${d.poverty}<br>Low Healthcare: ${d.healthcareLow}`);
      });


    chartGroup.call(toolTip);

    // event listeners 

    circlesGroup.on("click", function(cendata) {
      toolTip.show(cendata, this);
    })
      // onmouseout event
      .on("mouseout", function(cendata, index) {
        toolTip.hide(cendata);
      });

    // Axes labels
    chartGroup.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left + 40)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .attr("class", "axisText")
      .text("Lacks Healthcare (%)");

    chartGroup.append("text")
      .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
      .attr("class", "axisText")
      .text("In Poverty (%)");

      
  });
