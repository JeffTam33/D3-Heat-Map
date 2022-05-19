//Babel
//Libaries: D3
//Data used from https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json
const width = 1300
const height = 600
const padding = 125
const barWidth = 18
//Colors: space cadet, celtic blue, cultured(whiteish), pale silver, red salsa, lava
const colorHeatArr = ["#183059", "#276FBF", "#F6F4F3", "#C2B4AE", "#F03A47", "#D1101D"]

//function used to sort variance temperature
function sortVarianceByColor(temp){
  if(temp >= 12){
    return colorHeatArr[5]
  }else if(temp >= 10){
    return colorHeatArr[4]
  }else if(temp >= 8){
    return colorHeatArr[3]
  }else if(temp >= 6){
    return colorHeatArr[2]
  }else if(temp >= 4){
    return colorHeatArr[1]
  }else{
    return colorHeatArr[0]
  }
}

var tooltips = d3.select(".visual-data")
                 .append("div")
                 .attr("id", "tooltip")
                 .attr("class", "tooltips")
                 .style("opacity", 1)

var svgContainer = d3.select(".visual-data")
                     .append("svg")
                     .attr("width", width)
                     .attr("height", height)

var heat = svgContainer.append("g")
                         .attr("id", "heat")

var legend = svgContainer.append("g")
                         .attr("id", "legend")

var description = svgContainer.append("g")
                         .attr("id", "description")

fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json")
     .then(response => response.json())
     .then(data => {
      //Making Date object to determind min and max of x axis
      var dateArr = data.monthlyVariance.map(i => new Date(i.year, i.month))
      var yearArr = data.monthlyVariance.map(i => i.year)
      var monthArr = data.monthlyVariance.map(i => i.month)
      var monthStrArr = ["January", "February", "March", "April", "May", "June", 
                         "July", "August", "September", "October", "November", "December"]
      var varianceArr = data.monthlyVariance.map(i => i.variance)
      //Axis Scales
      const xScale = d3.scaleLinear()
                       .domain([d3.min(yearArr), d3.max(yearArr)])
                       .range([padding, width - padding])
      const yScale = d3.scaleLinear()
                       .domain([d3.max(monthArr), d3.min(monthArr)])
                       .range([height - padding, padding / 2])
      const legendScale = d3.scaleLinear()
                       .domain([d3.max(varianceArr) + data.baseTemperature, d3.min(varianceArr) + data.baseTemperature])
                       .range([height - padding, padding])
      //Axises positions
      const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"))
      const yAxis = d3.axisLeft(yScale).tickFormat(function (d){
        return(monthStrArr[d - 1])
      })
      const legendAxis = d3.axisBottom(legendScale).ticks(5);
      //Call Axises
      svgContainer.append("g")
                  .attr("id", "x-axis")
                  .attr("transform", "translate(0, "+ (height - padding) + ")")
                  .call(xAxis)
      svgContainer.append("g")
                  .attr("id", "y-axis")
                  .attr("transform", "translate(" + padding +", 0)")
                  .call(yAxis)
      svgContainer.append("g")
                  .attr("id", "legend-axis")
                  .attr("transform", "translate(50, 550)")
                  .call(legendAxis)
      //x-axis title and text
      svgContainer.append("text")
                  .attr("id", "x-axis-title")
                  .attr("x", width / 2)
                  .attr("y", height - (padding / 2))
                  .text("Years")
      //Y-axis title and text
      svgContainer.append("text")
                  .attr("id", "y-axis-title")
                  .attr("x", (height * -1) + padding * 3)
                  .attr("y", padding / 3)
                  .attr("transform", "rotate(270)")
                  .text("Months")
      //Legend-axis title and text
      svgContainer.append("text")
                  .attr("id", "legend-axis-title")
                  .attr("x", width / 4)
                  .attr("y", height)
                  .text("Variance (C°)")
      svgContainer.selectAll("#heat")
                  .data(data.monthlyVariance)
                  .enter()
                  .append("rect")
                  .attr("class", "cell")
                  .attr("data-year", d => d.year)
                  .attr("data-month", d=> d.month)
                  .attr("data-temp", d => d.variance + data.baseTemperature)
                  .attr("fill", d => sortVarianceByColor(data.baseTemperature + d.variance))
                  .attr("x", d => xScale(d.year))
                  .attr("y", d => yScale(d.month))
                  .attr("height", "21px")  
                  .attr("width", "3px")
                  .on("mouseover", function (event, d){
                      var date = this.getAttribute("data-year") + "-" + monthStrArr[this.getAttribute("data-month") - 1]
                      var temp = Math.round(this.getAttribute("data-temp") * 10) / 10 + "°C"
                      tooltips.transition().duration(0);                             
                      tooltips.style("height", 300)
                              .style("width", 300)
                              .attr("data-year", this.getAttribute("data-year"))
                              .style("top", yScale(this.getAttribute("data-month")) + 100 + "px")
                              .style("left", xScale(this.getAttribute("data-year")) + 100 + "px")
                              .style("opacity", .9)
                              .style("fill", "#358600")
                              .style("transform", "translateX(100px)")
                              .attr("id", "tooltip")
                              .text(date + " " + temp)
                  })
                  .on("mouseout", function(){
                    tooltips.transition().duration(100).style("opacity", 0)
                  })
  //Legend color appear on axis
      legend.selectAll("#legend")
                  .data(colorHeatArr)
                  .enter()
                  .append("rect")
                  .style("fill", d => d)
                  .attr("x", (d, i) => 184 + (57 * i) + "px")
                  .attr("y", "525px")
                  .attr("height", "25px")  
                  .attr("width", "56px")
     })