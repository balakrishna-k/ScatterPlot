var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

    //Define Color
var colors = d3.scaleOrdinal(d3.schemeCategory10);
//console.log(colors(1))

/*

if (continent == Asia)


*/

    //Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom).call(d3.zoom().on("zoom", function () {
    svg.attr("transform", d3.event.transform)
 }))
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define Scales   
var xScale = d3.scaleLinear()
    .domain([0,16]) //Need to redefine this after loading the data
    .range([0, width]);

var yScale = d3.scaleLinear()
    .domain([0,450]) //Need to redfine this after loading the data
    .range([height, 0]);
    
    //Define Tooltip here
var div = d3.select("body").append("div")	
    .attr("class", "tooltip")				
    .style("opacity", 0);
      
       //Define Axis
var xAxis = d3.axisBottom(xScale);
var yAxis = d3.axisLeft(yScale).tickPadding(2);

d3.csv("continent.csv", function (contset){
    
    d3.csv("scatterdata.csv", function(scatterdataset){

        // Define domain for xScale and yScale

        //console.log(contset[0].continent);

        for (var i = 0; i < scatterdataset.length; i++){

            var country = scatterdataset[i].country;
            //console.log(contset[i].continent);

            for (var j = 0; j <scatterdataset.length; j++){

                if (contset[j].country == country){
                scatterdataset[i].continent = contset[j].continent;
                }

            }  
        }

        console.log(scatterdataset);
        //Draw Scatterplot
            svg.selectAll(".dot")
            .data(scatterdataset)
            .enter().append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return Math.sqrt(d.ec)*2; })
            .attr("cx", function(d) {return (xScale(d.gdp));})
            .attr("cy", function(d) {return (yScale(d.ecc));})
            .style("fill", function (d) { return colors(d.continent); })
            .on("mouseover", function(d) {
                
                div.transition()		
                    .duration(200)		
                    .style("opacity", .9);		
                div.style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px")
                    .text(" "+ d.country + "\n Continent: \xa0" + d.continent + "\n"+ " Population: \xa0" +d.population + "\xa0million\n" + " GDP: $" + d.gdp + " trillion\n" + " EPC: \xa0"+ d.ecc + " trillion BTUs\n");	
                })					
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
            });

        //Add .on("mouseover", .....
        //Add Tooltip.html with transition and style
        //Then Add .on("mouseout", ....

        //Scale Changes as we Zoom
        // Call the function d3.behavior.zoom to Add zoom

        //Draw Country Names
            svg.selectAll(".text")
            .data(scatterdataset)
            .enter().append("text")
            .attr("class","text")
            .style("text-anchor", "start")
            .attr("x", function(d) {return xScale(d.gdp);})
            .attr("y", function(d) {return yScale(d.ecc);})
            .style("fill", "black");

     //x-axis
            
    //}

    });

});

svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis)
            .append("text")
            .attr("class", "label")
            .attr("y", 50)
            .attr("x", width/2)
            .style("text-anchor", "middle")
            .attr("font-size", "12px")
            .text("GDP (in Trillion US Dollars) in 2010");


        //Y-axis
        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", -50)
            .attr("x", -50)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .attr("font-size", "12px")
            .text("Energy Consumption per Capita (in Million BTUs per person)");


         // draw legend colored rectangles
        svg.append("rect")
            .attr("x", width-250)
            .attr("y", height-190)
            .attr("width", 220)
            .attr("height", 180)
            .attr("fill", "lightgrey")
            .style("stroke-size", "1px");

        svg.append("circle")
            .attr("r", 5)
            .attr("cx", width-100)
            .attr("cy", height-175)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 15.8)
            .attr("cx", width-100)
            .attr("cy", height-150)
            .style("fill", "white");

        svg.append("circle")
            .attr("r", 50)
            .attr("cx", width-100)
            .attr("cy", height-80)
            .style("fill", "white");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -150)
            .attr("y", height-172)
            .style("text-anchor", "end")
            .text(" 1 Trillion BTUs");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -150)
            .attr("y", height-147)
            .style("text-anchor", "end")
            .text(" 10 Trillion BTUs");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -150)
            .attr("y", height-77)
            .style("text-anchor", "end")
            .text(" 100 Trillion BTUs");

         svg.append("text")
            .attr("class", "label")
            .attr("x", width -150)
            .attr("y", height-15)
            .style("text-anchor", "middle")
            .style("fill", "Green") 
            .attr("font-size", "16px")
            .text("Total Energy Consumption"); 

var g= svg.selectAll(g);
console.log(svg.translate);
