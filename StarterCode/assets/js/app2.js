
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


//--------------------------------------------------------------------------
  var varXaxis = "poverty";

// function used for updating x-scale var upon click on axis label
function xScale(cendata, varXaxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(cendata, d => d[varXaxis]) * 0.8,
      d3.max(cendata, d => d[varXaxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating xAxis var upon click on axis label
function renderAxes(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating circles group with a transition to
// new circles
function renderCircles(circlesGroup, newXScale, varXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[varXaxis]));

  return circlesGroup;
}

// function used for updating circles group with new tooltip
function updateToolTip(varXaxis, circlesGroup) {

  if (varXaxis === "poverty") {
    var label = "poverty:";
  }
  else {
    var label = "Poverty (%)";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[varXaxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(cendata) {
    toolTip.show(cendata);
  })
    // onmouseout event
    .on("mouseout", function(cendata, index) {
      toolTip.hide(cendata);
    });

  return circlesGroup;
}

// Retrieve cendata from the CSV file and execute everything below
d3.csv("cendata.csv", function(err, cendata) {
  if (err) throw err;

  // parse data
  cendata.forEach(function(cendata) {
    cendata.poverty = +cendata.poverty;
    cendata.age = +cendata.age;
    cendata.healthcareLow = +cendata.healthcareLow;
  });

  // xLinearScale function above csv import
  var xLinearScale = xScale(cendata, varXaxis);

  // Create y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([0, d3.max(cendata, d => d.age)])
    .range([height, 0]);

  // Create initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(cendata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[varXaxis]))
    .attr("cy", d => yLinearScale(d.age))
    .attr("r", 20)
    .attr("fill", "pink")
    .attr("opacity", ".5");

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Po (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "healthcareLow") // value to grab for event listener
    .classed("inactive", true)
    .text("Lacks H (%)");

  // append y axis
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Number of Billboard 500 Hits");

  // updateToolTip function above csv import
  var circlesGroup = updateToolTip(varXaxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== varXaxis) {

        // replaces varXaxis with value
        varXaxis = value;

        // console.log(varXaxis)

        // functions here found above csv import
        // updates x scale for new data
        xLinearScale = xScale(cendata, varXaxis);

        // updates x axis with transition
        xAxis = renderAxes(xLinearScale, xAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, xLinearScale, varXaxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(varXaxis, circlesGroup);

        // changes classes to change bold text
        if (varXaxis === "healthcareLow") {
          ageLabel
            .classed("active", true)
            .classed("inactive", false);
          povertyLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          ageLabel
            .classed("active", false)
            .classed("inactive", true);
          povertyLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });
});
