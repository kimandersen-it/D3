
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var varXaxis = "poverty";
var varYaxis = "healthcareLow";

//start X here


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
    var label = "Poverty (%):";
  }
  else {
    var label = "Age";
  }

  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${label} ${d[varXaxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

//end x circlesGroup

//start y here

// function used for updating y-scale var upon click on axis label
function yScale(cendata, varYaxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(cendata, d => d[varYaxis]) * 0.8,
        d3.max(cendata, d => d[varYaxis]) * 1.2
      ])
      .range([0, width]);
  
    return yLinearScale;
  
  }
  
  
  // function used for updating yAxis var upon click on axis label
  function renderAxes(newYScale, YAxis) {
    var lefyAxis = d3.axisLeft(newYscale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }
  
  // function used for updating circles group with a transition to
  // new circles
  function renderCirclesY(circlesGroupY, newYScale, varYaxis) {
  
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[varYaxis]));
  
    return circlesGroup;
  }
  
  // function used for updating circles group with new tooltip
  function updateToolTip(varYaxis, circlesGroup) {
  
    if (varYaxis === "healthcareLow") {
      var label = "Healthcare Low (%):";
    }
    else {
      var label = "Obesity";
    }
  
    var toolTip = d3.tip()
      .attr("class", "tooltip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${label} ${d[varYaxis]}`);
      });
  
    circlesGroup.call(toolTip);
  
    circlesGroup.on("mouseover", function(data) {
      toolTip.show(data);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return circlesGroup;
  }
  
  //end y circlesGroup



// Retrieve data from the CSV file and execute everything below
d3.csv("cendata.csv", function(err, cendata) {
  if (err) throw err;

  // parse data
  cendata.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcareLow = +data.healthcareLow;
    data.age = +data.age;
    data.obesity = +data.obesity;

  });
console.log(cendata);
  // xLinearScale function above csv import
  var xLinearScale = xScale(cendata, varXaxis);

  //  y scale function
  var yLinearScale = d3.scaleLinear()
    .domain([2, d3.max(cendata, d => d.healthcareLow)])
    .range([height, 0]);

  //  initial axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // append x axis
  var xAxis = chartGroup.append("g")
    .classed("x-axis", true)
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  // append y axis
  var Yaxis = chartGroup.append("g")
    .call(leftAxis);

  // append initial circles
  var circlesGroup = chartGroup.selectAll("circle")
    .data(cendata)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[varXaxis]))
    .attr("cy", d => yLinearScale(d[varYaxis]))
    .attr("r", 15)
    .attr("fill", "lightblue")
    .attr("opacity", ".8");

  // Create group for  2 x- axis labels
  var labelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height + 20})`);

    //append x axes
  var povertyLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 20)
    .attr("value", "poverty") // value to grab for event listener
    .classed("active", true)
    .text("Poverty (%)");

  var ageLabel = labelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "age") // value to grab for event listener
    .classed("inactive", true)
    .text("Age");

  // append y axes
  var healthLabel = circlesGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Low Healthcare (%)");

   
    var obeseLabel = circlesGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 20 - margin.left)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obesity");



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
        if (varXaxis === "age") {
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


  // updateToolTip function above csv import FOR Y
  var circlesGroup = updateToolTip(varYaxis, circlesGroup);

  // x axis labels event listener
  labelsGroup.selectAll("text")
    .on("click", function() {
      // get value of selection
      var value = d3.select(this).attr("value");
      if (value !== varYaxis) {

        // replaces varXaxis with value
        varYaxis = value;

        // console.log(varXaxis)

        // functions here found above csv import
        // updates x scale for new data
        yLinearScale = yScale(cendata, varYaxis);

        // updates x axis with transition
        yAxis = renderAxes(yLinearScale, yAxis);

        // updates circles with new x values
        circlesGroup = renderCircles(circlesGroup, yLinearScale, varYaxis);

        // updates tooltips with new info
        circlesGroup = updateToolTip(varYaxis, circlesGroup);

        // changes classes to change bold text
        if (varYaxis === "healthcareLow") {
          healthLabel
            .classed("active", true)
            .classed("inactive", false);
          obeseLabel
            .classed("active", false)
            .classed("inactive", true);
        }
        else {
          healthLabel
            .classed("active", false)
            .classed("inactive", true);
          obeseLabel
            .classed("active", true)
            .classed("inactive", false);
        }
      }
    });








});
