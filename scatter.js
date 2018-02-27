
var margin = {left: 80, right: 80, top: 50, bottom: 50 }, 
        width = 960 - margin.left -margin.right,
        height = 500 - margin.top - margin.bottom;

//Define Color
//var colors = d3.scaleOrdinal(d3.schemeCategory10);
//console.log(colors);

//Color scales for each continent    
var Asia = d3.scaleLinear()
  .domain([18,221])
  .range(["#fed98e", "#cc4c02"]);
    
var Europe = d3.scaleLinear()
  .domain([134,205])
  .range(["#bdc9e1", "#0570b0"]);

var NorthA = d3.scaleLinear()
  .domain([308,316])
  .range(["#bae4b3", "#238b45"]);

var SouthA = d3.scaleLinear()
  .domain([57,64])
  .range(["#fbb4b9", "#ae017e"]);

var Australia = d3.scaleLinear()
  .domain([200,270])
  .range(["#9e9ac8", "#54278f"]);  
       
/*    
var temp = color("Asia");
console.log(temp[2]);    
*/
    
//Define SVG
var svg = d3.select("body")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
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
var xAxis = d3.axisBottom(xScale).tickPadding(2).tickSize(-height);
var yAxis = d3.axisLeft(yScale).tickPadding(2).tickSize(-width);
    
//Append Axes first so the circles appear above the grid lines   
//X-axis        
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);
    
//Label for X-axis    
svg.append("text")
    .attr("class", "label")
    .attr("y", height + 30)
    .attr("x", width/2)
    .style("text-anchor", "middle")
    .attr("font-size", "12px")
    .text("GDP (in Trillion US Dollars) in 2010");
    
//Y-axis
svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);
    
//Label for Y-axis
svg.append("text")
    .attr("class", "label")
    .attr("transform", "rotate(-90)")
    .attr("y", -50)
    .attr("x", -50)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("font-size", "12px")
    .text("Energy Consumption per Capita (in Million BTUs per person)");
    
//Defining Zooming behaviour
var zoom = d3.zoom().scaleExtent([0.5, 2]).on("zoom", zoomed);   
svg.call(zoom);
        
//Reading data from two files and combining them    
d3.csv("continent.csv", function (contset){
    
    d3.csv("scatterdata.csv", function(scatterdataset){

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
        
    var title = svg.append("text")
        .text("Energy Consumption, 2010")
        .attr("x", margin.left/2)
        .attr("y", margin.top/2)
        .attr("font-size","20px")
        .attr("font-weight","bold").attr("fill","#757a82");    

    console.log(scatterdataset);
            
    //Draw circles using the data    
        svg.append("g")//.attr("class","circle-container")
            .selectAll(".dot")
            .data(scatterdataset)
            .enter()
            .append("circle")
            .attr("class", "dot")
            .attr("r", function(d) { return Math.sqrt(d.ec)/.5; })
            .attr("cx", function(d) {return xScale(d.gdp);})
            .attr("cy", function(d) {return yScale(d.ecc);})
            .style("fill", function (d) {

                                if (d.continent=="Asia"){return Asia(d.ecc);}
                                else if (d.continent=="Europe"){return Europe(d.ecc);}
                                else if (d.continent =="North America"){return NorthA(d.ecc);}
                                else if (d.continent=="South America"){return SouthA(d.ecc);}
                                else{return Australia(d.ecc);}})
            .on("mouseover", function(d) {
                div.html("<b>"+d.country + "</b><br>"+"Continent: "+ d.continent +"<br>" + "Population: "+ d.population +" million" +"<br>" + "GDP: $" + d.gdp +" trillion"+"<br>"+ "EPC: "+ d.ecc +" million BTUs" + "<br>"+"Total: "+ d.ec + " trillion BTUs")
                    .transition()		
                    .duration(200).ease(d3.easeLinear)		
                    .style("opacity", .9)
                    .style("left", (d3.event.pageX) + "px")		
                    .style("top", (d3.event.pageY - 28) + "px");
            })
            .on("mouseout", function(d) {		
                div.transition()		
                    .duration(500)		
                    .style("opacity", 0);	
        });
        
        
        //Write Country names
        svg.selectAll(".text")
        .data(scatterdataset)
        .enter().append("text")
        .attr("class","text")
        .style("text-anchor", "start")
        .attr("x", function(d) {return xScale(d.gdp)-5;})
        .attr("y", function(d) {return yScale(d.ecc)-10;})
        .style("fill", "#757a82")
        .attr("font-weight", "bold")
        .text(function (d) {return d.country; });
        
        /*svg.select(".circle-container").selectAll(".dot").data(scatterdataset).enter()
            .append("text")
            .attr("class", "dot")
            .attr("x", function(d) {return xScale(d.gdp);})
            .attr("y", function(d) {return yScale(d.ecc);})
            .text("test");
        */
       //Legend and stuff    
        svg.append("rect")
            .attr("x", width-250)
            .attr("y", height-190)
            .attr("width", 220)
            .attr("height", 150)
            .style("stroke-width", "2px")
            .style("stroke","#ddd");

        svg.append("circle")
            .attr("r", 2)
            .attr("cx", width-100)
            .attr("cy", height-175)
            .style("fill", "darkgrey");

        svg.append("circle")
            .attr("r", 6)
            .attr("cx", width-100)
            .attr("cy", height-150)
            .style("fill", "darkgrey");

        svg.append("circle")
            .attr("r", 19)
            .attr("cx", width-100)
            .attr("cy", height-100)
            .style("fill", "darkgrey");

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
            .attr("y", height-95) 
            .style("text-anchor", "end")
            .text(" 100 Trillion BTUs");

        svg.append("text")
            .attr("class", "label")
            .attr("x", width -140)
            .attr("y", height-50)
            .style("text-anchor", "middle")
            .style("fill", "Green") 
            .attr("font-size", "16px")
            .text("Total Energy Consumption");
    });
}); 
    
function zoomed(){
          
    //Redrawing the circles    
    svg.selectAll(".dot").attr("transform", d3.event.transform)
    svg.selectAll(".text").attr("transform", d3.event.transform)
          
    //Redrawing the axes with redifined scales
    svg.select(".x.axis")
        .call(xAxis.scale(d3.event.transform.rescaleX(xScale)))        
    svg.select(".y.axis")
        .call(yAxis.scale(d3.event.transform.rescaleY(yScale)));           
}   
    
//Legend for colours    
// draw legend colored rectangles
var svgLegend = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height/4 + margin.top + margin.bottom-15)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + 0 + ")");   
    
svgLegend.append("rect")
    .attr("x", 0)
    .attr("y", 0)
    .attr("width", width)
    .attr("height", height/2)
    .style("stroke-width", "0px").style("stroke","#ddd");
    
svgLegend.append("text").text("Color Scale as per EPC, in millions of BTUs").attr("x", width/2-100).attr("y",30);    
    
svgLegend.append("g")
  .attr("class", "legendAsia")
  .attr("transform", "translate(20,70)")
  .append("text").text("Asia").attr("x",70).attr("y",-10).attr("font-size","12px");

var legendAsia = d3.legendColor()
  .shapeWidth(30).shapePadding(0)
  .orient('horizontal')
  .scale(Asia);

svgLegend.select(".legendAsia")
  .call(legendAsia);  
    
svgLegend.append("g")
  .attr("class", "legendEurope")
  .attr("transform", "translate(220,70)")
  .append("text").text("Europe").attr("x",60).attr("y",-10).attr("font-size","12px");

var legendEurope = d3.legendColor()
  .shapeWidth(30).shapePadding(0)
  .orient('horizontal')
  .scale(Europe);

svgLegend.select(".legendEurope")
  .call(legendEurope);
    
svgLegend.append("g")
  .attr("class", "legendNA")
  .attr("transform", "translate(420,70)")
  .append("text").text("North America").attr("x",40).attr("y",-10).attr("font-size","12px");

var legendNA = d3.legendColor()
  .shapeWidth(30).shapePadding(0)
  .orient('horizontal')
  .scale(NorthA);

svgLegend.select(".legendNA")
  .call(legendNA);
    
svgLegend.append("g")
  .attr("class", "legendSA")
  .attr("transform", "translate(620,70)")
  .append("text").text("South America").attr("x",40).attr("y",-10).attr("font-size","12px");
    
var legendSA = d3.legendColor()
  .shapeWidth(30).shapePadding(0)
  .orient('horizontal')
  .scale(SouthA);

svgLegend.select(".legendSA")
  .call(legendSA);  
    
svgLegend.append("g")
  .attr("class", "legendAus")
  .attr("transform", "translate(320,140)")
  .append("text").text("Australia").attr("x",50).attr("y",-10).attr("font-size","12px");

var legendAus = d3.legendColor()
  .shapeWidth(30).shapePadding(0)
  .orient('horizontal')
  .scale(Australia);

svgLegend.select(".legendAus")
  .call(legendAus);         
      
/*
var circles = svg.append('circle')
    .attr("id","circles")
    .attr("cx", x(150))
    .attr("cy", y(150))
    .attr('r', 4)
    .call(zoom)      
  */  

/*function zoomed() {
  
    // Defining new Scales
    var new_xScale = d3.event.transform.rescaleX(x);
    var new_yScale = d3.event.transform.rescaleY(y);   
    
    //calling new axis
    gX.call(xAxis.scale(new_xScale));
    gY.call(yAxis.scale(new_yScale));
    
    //Redrawing the circle
    svg.selectAll(".dot").attr("transform", d3.event.transform);
}*/