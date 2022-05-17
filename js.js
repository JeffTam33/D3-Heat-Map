//Babel
//Libaries: D3
//Data used from https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
const width = 1200;
const height = 600;
const padding = 100;

var tooltips = d3.select(".visual-data")
                 .append("div")
                 .attr("id", "tooltip")
                 .attr("class", "tooltips")
                 .style("opacity", 1);

var svgContainer = d3.select(".visual-data")
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height)
                     .style("background-color", "#FFFFFF");

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
     .then(response => response.json())
     .then(data => {
      //Making Date object to determind min and max of x axis
      var dateArr = data.monthlyVariance.map(i => new Date(i.year, i.month));
      var yearArr = data.monthlyVariance.map(i => i.year);
      var monthArr = data.monthlyVariance.map(i => i.month);
      var monthStrArr = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"]
      //Axis Scales
      const xScale = d3.scaleLinear()
                       .domain([d3.min(yearArr), d3.max(yearArr)])
                       .range([padding, width - padding])
      const yScale = d3.scaleLinear()
                       .domain([d3.max(monthArr), d3.min(monthArr)])
                       .range([height - padding, padding])
      //Axises positions
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));
      const yAxis = d3.axisLeft(yScale).tickFormat(function (d){
        return(monthStrArr[d - 1])
      });
      //Call Axises
      svgContainer.append("g")
                  .attr("id", "x-axis")
                  .attr("transform", "translate(0, "+ (height - padding) + ")")
                  .call(xAxis)
      svgContainer.append("g")
                  .attr("id", "y-axis")
                  .attr("transform", "translate(" + padding +", 0)")
                  .call(yAxis)
      //x-axis title and text
      svgContainer.append("text")
                  .attr("id", "x-axis-title")
                  .attr("x", width / 2)
                  .attr("y", height - (padding / 4))
                  .text("Years")
      //Y-axis title and text
      svgContainer.append("text")
                  .attr("id", "y-axis-title")
                  .attr("x", (height * -1) + padding * 3)
                  .attr("y", padding / 3)
                  .attr("transform", "rotate(270)")
                  .text("Months")
     })