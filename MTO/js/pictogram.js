// Draw pictogram function-----------------------------

var pictogramScroll = function () {
  // size variable
  var height = 600,
    width = 400;
  //Magrin: spaces saved in the svg for axes and titles
  var margin = {
    left:60,
    bottom: 100,
    top: 20,
    right: 50,
  };
  
  var drawHeight = height - margin.bottom - margin.top;
  var drawWidth = width - margin.left - margin.right;

  var lastIndex = -1;
  var activeIndex = 0;

  var activateFunctions = [];

  var div =null;
  var g = null;
  
  var svg=null;

  //padding for the grid
  var xPadding = 10;
  var yPadding = 10;

  //horizontal and vertical spacing between the icons
  var clfHBuffer = 15;
  var clfWBuffer = 12;

  //specify the number of columns for pictogram layout
  var numCols = 10;

  
  // Income Bar Scale and Axis----------------------
  
  var yBarScaleIncome = d3.scaleLinear()
                    .range([drawHeight,0]);
                   
    
  var xBarScaleIncome = d3.scaleBand()
                    .paddingInner(0.08)
                    .range([0,drawWidth])
                    .domain(["Public Housing Units","Mixed Income Neighborhood"]);


  var yAxisBarIncome = d3.axisLeft()
                   .scale(yBarScaleIncome)
                   .tickPadding([15])
                   .tickFormat(function(d){
                     return d+"K";
                   });
                   
                   
  var xAxisBarIncome= d3.axisBottom()
                  .scale(xBarScaleIncome)
                  .tickFormat("");
                  
          
 // Race Bar Scale and Axis-------------------
 
 
  var yBarScaleRaceObs = d3.scaleLinear()
                    .range([drawHeight,0]); 
   
  var yBarScaleRace = d3.scaleLinear()
                    .range([drawHeight,0]);
    
  var xBarScaleRace = d3.scaleBand()
                    .paddingInner(0.08)
                    .range([0,drawWidth])
                    .domain(["Public Housing Units","Mixed Income Neighborhood"]);
                    
                    
                    
   var yAxisBarRaceObs = d3.axisLeft()
                   .scale(yBarScaleRaceObs)
                    .tickPadding([15])
                   .tickFormat(function(d){
                     return d+"%";
                   });
                     
 
  var yAxisBarRace = d3.axisLeft()
                   .scale(yBarScaleRace)
                    .tickPadding([15])
                   .tickFormat(function(d){
                     return d+"%";
                   });
                   
                   
  var xAxisBarRace= d3.axisBottom()
                      .scale(xBarScaleRace);
                  
  var xAxisBarRaceObs= d3.axisBottom()
                         .scale(xBarScaleRace)
                         .tickFormat("");
                        
  
  
  // Color scale--------------  
  
  
     
   var incomeColor=d3.scaleSequential(d3.interpolateRdYlBu);
   // var incomeColor=d3.scaleSequential(d3.interpolateBrBG);
   // var incomeColor=d3.scaleSequential(d3.interpolateYlGn);
   // var incomeColor=d3.scaleSequential(d3.interpolateGreens);
   
   var legend = d3.legendColor()
                  .shapeWidth(30)
                  .orient('horizontal')
                  //.title('Earnings Level')
                  .scale(incomeColor)
                  .cells(7)
                  //.labelFormat(d3.format(","))
                  .labelFormat(d3.format("$,.2r"))
                  .labelAlign('start');
   
                  
  var barColors = { "Public Housing Units": '#cccccc', "Mixed Income Neighborhood": '#737373' };
  
  
  var chart = function (selection) {

    // Loop through selections and data bound to each element
    
    selection.each(function (data) {
      
      div = d3.select(this); // Container

      // Selection of SVG elements in DIV (making sure not to re-append svg)
      
      svg = div.selectAll('svg').data([data]);
  
      // Append a 'g' element in which to place the rects, shifted down and right from the top left corner
    
      svg.exit().remove();

      var incomeData=d3.nest()
      .key(function(d){return d.wakefield})
      .rollup(function(v){
        return d3.mean(v,function(d){return d.y_obs;}).toFixed(0);
      })
      .entries(data);
      
      incomeData=incomeData.map(function(d,i){
        d.group=d.key=="0"?"Public Housing Units":"Mixed Income Neighborhood";
        return d;
      });
      
      console.log(incomeData);
     
      var incomeDataTreat=d3.nest()
      .key(function(d){return d.treated})
      .rollup(function(v){
        return d3.mean(v,function(d){return d.y_experiment;}).toFixed(0);
      })
      .entries(data);
      
       incomeDataTreat=incomeDataTreat.map(function(d,i){
        d.group=d.key=="0"?"Public Housing Units":"Mixed Income Neighborhood";
        return d;
      });
      
      console.log(incomeDataTreat);
      
      var incomeMin=Math.min(d3.min(incomeData,function(d){return d.value}),d3.min(incomeDataTreat,function(d){return d.value})).toFixed(0);
      var incomeMax=Math.max(d3.max(incomeData,function(d){return d.value}),d3.max(incomeDataTreat,function(d){return d.value})).toFixed(0);
      
      console.log(incomeMax);
      console.log(Number(incomeMax)+50);
      console.log(incomeMin);
      console.log(incomeMin+10);
      
      // update the domain of two scales with range of income
       yBarScaleIncome.domain([0, Number(incomeMax)+5]);
       
       incomeColor.domain([Number(incomeMin)-3000, Number(incomeMax)+2000]);
       
       raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
       }); 
        
        
      console.log(raceData);
      
      var raceDataTreat=d3.nest()
        .key(function(d){return d.treated})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceDataTreat=raceDataTreat.map(function(d,i){
        d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
       }); 
        
      console.log(raceDataTreat);
      
      var raceMax=Math.max(d3.max(raceData,function(d){return d.value}),d3.max(raceDataTreat,function(d){return d.value}));
      
      yBarScaleRace.domain([0, raceMax+5]);
      yBarScaleRaceObs.domain([0,raceMax+5]);
       
      setupVis(data,incomeData,raceData,incomeDataTreat,raceDataTreat);
     
    });// end of selection.each

    setupSections();
  }; // end of chart function to return
  
  var setupVis=function(data,incomeData,raceData,incomeDataTreat,raceDataTreat){
   

    // Initial pictogram
    
     var gEnter = svg
        .enter()
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox", [0, 0, width, height])
                 .style("overflow", "visible")
                 .classed("svg-content", true);
  
  
      gEnter
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', drawHeight)
        .attr('width', drawWidth)
        .attr('class', 'symbol-g');

      // Re-select G for symbols
      g = div.select('.symbol-g');

      g.append('defs')
        .append('g')
        .attr('id', 'iconCustom')
        .append('path')
        .attr('transform','scale(2)')
        .attr(
          'd',
          'M3.5,2H2.7C3,1.8,3.3,1.5,3.3,1.1c0-0.6-0.4-1-1-1c-0.6,0-1,0.4-1,1c0,0.4,0.2,0.7,0.6,0.9H1.1C0.7,2,0.4,2.3,0.4,2.6v1.9c0,0.3,0.3,0.6,0.6,0.6h0.2c0,0,0,0.1,0,0.1v1.9c0,0.3,0.2,0.6,0.3,0.6h1.3c0.2,0,0.3-0.3,0.3-0.6V5.3c0,0,0-0.1,0-0.1h0.2c0.3,0,0.6-0.3,0.6-0.6V2.6C4.1,2.3,3.8,2,3.5,2z'
        );

    var numRows = Math.ceil(data.length / numCols);

    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;
          
          
      data = data.map(function (d, idx) {
        if ((d.wakefield == 1)){
          d.groupIndx = obsWakGrpIndx;
          obsWakGrpIndx += 1;
        } else if ((d.wakefield===0)) {
          d.groupIndx = obsMarGrpIndx;
          obsMarGrpIndx += 1;
        } 
        return d;
      });
      
      //text element to display number of figures in each location
      g.append('text')
        .attr('id', 'txtValue-ph')
        .attr('class', 'initial-txtValue')
        .attr('x', xPadding*7)
        .attr('y', yPadding*(-2))
        //.attr('dy', -10)
        .text('Public Housing Units: '+data.length/2)
        .call(wrap, 120);
        
        
       g.append('text')
        .attr('id', 'txtValue-mixed')
        .attr('class', 'initial-txtValue')
        .attr('x', xPadding*7+width/2)
        .attr('y', yPadding*(-2))
        //.attr('dy', -10)
        .text('Mixed Income Neighborhood: '+data.length/2)
        .call(wrap, 120);
        
      // text element holding the summary stats
       g.append('text')
        .attr('id','stat-ph')
        .attr('x', xPadding*7)
        .attr('y', 400)
        .attr('opacity',0)
        .text("")
        .call(wrap, 120);
  
       g.append('text')
        .attr('id','stat-mixed')
        .attr('x', xPadding*7+width/2)
        .attr('y', 400)
        .attr('opacity',0)
        .text("")
        .call(wrap, 120);

      // g.call(icon_tip);

      //create group element and create an svg <use> element for each icon
      g.append('g')
        .attr('id', 'pictoLayer')
        .selectAll('use')
        .data(data)
        .enter()
        .append('use')
        .attr('xlink:href', '#iconCustom')
        .attr('id', function (d) {
          return 'icon' + d.groupIndx;
        })
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.wakefield ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        });
       // .on('mouseover', icon_tip.show)
       // .on('mouseout', icon_tip.hide);
        
   // work on the color legend-------------
   
    d3.select('#legend-canvas').append("g")
    //.attr("transform", "translate(500,10)")
    .attr('class',"income-color-scale")
    .call(legend)
    .attr('opacity',1);
   
    d3.select('#legend-canvas-treat').append("g")
    //.attr("transform", "translate(500,10)")
    .attr('class',"income-color-scale-treat")
    .call(legend)
    .attr('opacity',1);
   
  
    /// update the range of yAxis
    
    yAxisBarIncome.scale(yBarScaleIncome.range([drawHeight/2-20,0]));
  
 
    yAxisBarRace.scale(yBarScaleRace.range([drawHeight,drawHeight/2+20]));
                   
                   
                   
 // Append all the axes


     g.append('g')
        .attr('class','x-axis-income')
        .attr("transform", 'translate(0,'+(drawHeight/2-20)+')')
        .call(xAxisBarIncome);
        
     g.append('g')
        .attr('class','y-axis-income')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarIncome);
        
        
     g.append('g')
        .attr('class','x-axis-race')
        .attr("transform", 'translate(0,'+drawHeight+')')
        .call(xAxisBarRace);
        
     g.append('g')
        .attr('class','y-axis-race')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarRace);
        
 // Income bar graph----------------     
        
     g.select('.x-axis-income').style('opacity',0);
     g.select('.y-axis-income').style('opacity',0);
        
      var barsIncome=g.selectAll('.bar-income')
                          .data(incomeData);
      
            barsIncome.enter()
                      .append('rect')
                      .attr('class','bar-income')
                      .merge(barsIncome)
                      .attr('y', drawHeight/2-20)
                      .attr('x', function (d) { return xBarScaleIncome(d.group)+ xBarScaleIncome.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleIncome.bandwidth()/2);  
                      
        barsIncome.exit().remove();              
                      
                      
     
   var barTextIncome = g.selectAll('.bar-text').data(incomeData);
   
            barTextIncome.enter()
              .append('text')
              .attr('class', 'bar-text-income')
              .merge(barTextIncome)
              .text(function (d) { return "$"+d.value+"k"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleIncome(d.value)-10;})
              .attr('x', function (d) { return xBarScaleIncome(d.group)+xBarScaleIncome.bandwidth() / 4;})
              .attr('dx', xBarScaleIncome.bandwidth() / 4)
              .style('font-size', '16px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextIncome.exit().remove();
              
     g.append("text")
    .attr("class", "y-label-income")
    .attr("text-anchor", "middle")
    .attr("x", -80)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("Average Income")
    .attr('opacity',0); 
  
        
   // Race bar graph     
        
    g.select('.x-axis-race').style('opacity',0);
    g.select('.y-axis-race').style('opacity',0);
        
     var barsRace=g.selectAll('.bar-race')
                        .data(raceData);
      
       barsRace.enter()
                      .append('rect')
                      .attr('class','bar-race')
                      .merge(barsRace)
                      .attr('y', drawHeight)
                      .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleRace.bandwidth()/2);  
                      
        barsRace.exit().remove();              
                      
                      
     
   var barTextRace = g.selectAll('.bar-text').data(raceData);
   
            barTextRace.enter()
              .append('text')
              .attr('class', 'bar-text-race')
              .merge(barTextRace)
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRace(d.value)-10;})
              .attr('x', function (d) { return xBarScaleRace(d.group)+xBarScaleRace.bandwidth()/4;})
              .attr('dx', xBarScaleRace.bandwidth()/4)
              .style('font-size', '16px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextRace.exit().remove();
              
     g.append("text")
    .attr("class", "y-label-race")
    .attr("text-anchor", "middle")
    .attr("x", -290)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("People of Color %")
    .attr('opacity',0);     
      

    /// append g only once in the setupVis--------------------
    
     g.append('g')
        .attr('class','x-axis-income-treat')
        .attr("transform", 'translate(0,'+(drawHeight/2-20)+')')
        .call(xAxisBarIncome);
        
     g.append('g')
        .attr('class','y-axis-income-treat')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarIncome);
        
      
        
    g.append('g')
        .attr('class','x-axis-race-obs')
        .attr("transform", 'translate(0,'+(drawHeight/2-20)+')')
        .call(xAxisBarRaceObs);
        
     g.append('g')
        .attr('class','y-axis-race-obs')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarRaceObs);
        
        
     g.append('g')
        .attr('class','x-axis-race-treat')
        .attr("transform", 'translate(0,'+drawHeight+')')
        .call(xAxisBarRace);
        
     g.append('g')
        .attr('class','y-axis-race-treat')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarRace);
        
        
        
        
    
    
  };
  
  
  
  var setupSections = function () {
    activateFunctions[0] = showInitial;
    activateFunctions[1] = showInitialIncome;
    activateFunctions[2] = showInitialRace;
    //activateFunctions[3] = showObsBars;
    activateFunctions[3] = showInitialPlus;// has an extra step of randomize the figures
    activateFunctions[4] = showRandom;
    activateFunctions[5] = showTreatBars;
  };
  
  // showInitial----------------------------------
  
  
  function showInitial(data) {
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
    hideAxis(yAxisBarRaceObs,'.y-axis-race-obs');
    hideAxis(xAxisBarRaceObs,'.x-axis-race-obs');
    hideAxis(yAxisBarRace,'.y-axis-race-treat');
    hideAxis(xAxisBarRace,'.x-axis-race-treat');
    
  
    // hide all income bar element    
    g.selectAll('.bar-income')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // hide all race bar element
   
   g.selectAll('.bar-race')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);


   
   g.selectAll('.bar-race-obs')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-obs')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-obs')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);

  // hide all treatment bars and text elements
    // income treatment bars
  g.selectAll('.bar-income-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // race treatment bars   
      
     g.selectAll('.bar-race-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);   


  // show pictogram
    
    //redraw the initial pictorgram
    
    
    var numRows = Math.ceil(data.length / numCols);

    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;

      
      // location title and number children in each location
      g.select('#txtValue-ph')
         .transition().duration(0).attr('opacity', 1);
     
      g.select('#txtValue-mixed')
       .transition().duration(0).attr('opacity', 1);
      
      
      g.select('#stat-ph')
         .transition().duration(0).attr('opacity', 0);
         
      g.select('#stat-mixed')
         .transition().duration(0).attr('opacity', 0);
       
      
       
       
      g.select(".income-color-scale").transition().duration(0).attr('opacity', 0);
     
    
      data = data.map(function (d, idx) {
        if ((d.wakefield == 1)){
          d.groupIndx = obsWakGrpIndx;
          obsWakGrpIndx += 1;
        } else if ((d.wakefield===0)) {
          d.groupIndx = obsMarGrpIndx;
          obsMarGrpIndx += 1;
        } 
        return d;
      });
      
      var use=g.selectAll('use')
             .data(data);
    
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       .attr('xlink:href', '#iconCustom')
       .attr('id', function (d) {return 'icon' + d.groupIndx;})
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.wakefield ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
        .style('fill',"#737373")
      .duration(0)
      .attr('opacity',1);
     
      
      use.exit().remove();

    
  }
  
  function showInitialIncome(data) {
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
    hideAxis(yAxisBarRaceObs,'.y-axis-race-obs');
    hideAxis(xAxisBarRaceObs,'.x-axis-race-obs');
    hideAxis(yAxisBarRace,'.y-axis-race-treat');
    hideAxis(xAxisBarRace,'.x-axis-race-treat');
    
  
    // hide all income bar element    
    g.selectAll('.bar-income')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // hide all race bar element
   
   g.selectAll('.bar-race')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
  // additional bar-race-obs shown in the last step
  
      
    g.selectAll('.bar-race-obs')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-obs')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-obs')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);   
      
      
      


  // hide all treatment bars and text elements
    // income treatment bars
  g.selectAll('.bar-income-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // race treatment bars   
      
     g.selectAll('.bar-race-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);   


  // show pictogram
    
    //redraw the initial pictorgram
    
    
    var numRows = Math.ceil(data.length / numCols);

    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;

      
      // location title and number children in each location
    g.select('#txtValue-ph')
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-mixed')
     .transition().duration(0).attr('opacity', 1);
     
     
    g.select(".income-color-scale")
     .transition().duration(1500).attr('opacity', 1);
     
     
     
     console.log(data);
    
      // sort the data by observed income 
      
      data=data.sort(function(a,b){
        return a.y_obs-b.y_obs
      })
    
      data = data.map(function (d, idx) {
        if ((d.wakefield == 1)){
          d.groupIndx = obsWakGrpIndx;
          obsWakGrpIndx += 1;
        } else if ((d.wakefield===0)) {
          d.groupIndx = obsMarGrpIndx;
          obsMarGrpIndx += 1;
        } 
        return d;
      });
      
      // sort the data by observed income 
      
      data=data.sort(function(a,b){
        return a.y_obs-b.y_obs
      })
      
      
      
      incomeData=d3.nest()
            .key(function(d){return d.wakefield})
            .rollup(function(v){
              return d3.mean(v,function(d){return d.y_obs;}).toFixed(0);
            })
            .entries(data);
            
             incomeData=incomeData.map(function(d,i){
              d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
              return d;
            }).sort(function(a,b){
              return a.key-b.key;
            });
            

            
        var incomeDiff=Math.abs(incomeData[0].value-incomeData[1].value).toFixed(0);
        
         g.selectAll("#stat-ph").text("Average Income: "+"$"+d3.format(",")(incomeData[0].value)).call(wrap,120).transition().duration(1500).attr('opacity', 1);
         g.selectAll("#stat-mixed").text("Average Income: "+"$"+d3.format(",")(incomeData[1].value)).call(wrap,120).transition().duration(1500).attr('opacity', 1);
        
         d3.selectAll("#incomeRaw-1").text("$"+d3.format(",")(incomeData[1].value));
         d3.selectAll("#incomeRaw-2").text("$"+d3.format(",")(incomeData[0].value));
         d3.selectAll("#incomeDIFF-1").text("$"+d3.format(",")(incomeDiff));
         d3.selectAll("#times").text(Math.round(incomeDiff/2000));
         
         
      console.log(data);
   
      var use=g.selectAll('use')
             .data(data);
    
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       .delay(function (d, i) { return 3 * (i + 1);})
       .attr('xlink:href', '#iconCustom')
       .attr('id', function (d) {return 'icon' + d.groupIndx;})
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.wakefield ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
        .style('fill',function(d){return incomeColor(d.y_obs)})
      .duration(0)
      .attr('opacity',1);
     
      
      use.exit().remove();
  
    
  }  
 
  function showInitialRace(data) {
    
    g.select(".income-color-scale")
     .transition().duration(0).attr('opacity', 0);
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
    hideAxis(yAxisBarRaceObs,'.y-axis-race-obs');
    hideAxis(xAxisBarRaceObs,'.x-axis-race-obs');   
    hideAxis(yAxisBarRace,'.y-axis-race-treat');
    hideAxis(xAxisBarRace,'.x-axis-race-treat');
    
  
    // hide all income bar element    
    g.selectAll('.bar-income')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // hide all race bar element
   
   g.selectAll('.bar-race')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
 /// additional observed race bar shown in last step
   g.selectAll('.bar-race-obs')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-obs')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-obs')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);


  // hide all treatment bars and text elements
    // income treatment bars
  g.selectAll('.bar-income-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // race treatment bars   
      
     g.selectAll('.bar-race-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);   


  // show pictogram
    
    //redraw the initial pictorgram
    
    
    var numRows = Math.ceil(data.length / numCols);

    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;

      
      // location title and number children in each location
     
    g.select('#txtValue-ph')
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-mixed')
     .transition().duration(0).attr('opacity', 1);
      
    
      
    // sort the data by race 
      
      data=data.sort(function(a,b){
        return a.black-b.black
      })
    
      data = data.map(function (d, idx) {
        if ((d.wakefield == 1)){
          d.groupIndx = obsWakGrpIndx;
          obsWakGrpIndx += 1;
        } else if ((d.wakefield===0)) {
          d.groupIndx = obsMarGrpIndx;
          obsMarGrpIndx += 1;
        } 
        return d;
      });
      
       raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
       }).sort(function(a,b){
         return a.key-b.key;
       }); 
       
       
       console.log("Why changed?")
       console.log(raceData);
       
       d3.select("#stat-ph").text("People of Color: "+raceData[0].value+"%").transition().duration(1500).attr('opacity',1);
       d3.select("#stat-mixed").text("People of Color: "+raceData[1].value+"%").transition().duration(1500).attr('opacity',1);
       
       
      var use=g.selectAll('use')
             .data(data);
    
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       .delay(function (d, i) { return 3 * (i + 1);})
       .attr('xlink:href', '#iconCustom')
       .attr('id', function (d) {return 'icon' + d.groupIndx;})
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.wakefield ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
      .style("fill",function(d,i){
         if (d.black == 1) {
          return '#4191cf';
        } else {
          return '#f2ca02';
        }})
      .duration(0)
      .attr('opacity',1);
      
      
      use.exit().remove();
      
    
  } 
  

  // showInitial+ a button animation--------------------
  function showInitialPlus(data) {
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
    hideAxis(yAxisBarRaceObs,'.y-axis-race-obs');
    hideAxis(xAxisBarRaceObs,'.x-axis-race-obs');   
    hideAxis(yAxisBarRace,'.y-axis-race-treat');
    hideAxis(xAxisBarRace,'.x-axis-race-treat');
    
  
    // hide all income bar element    
    g.selectAll('.bar-income')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // hide all race bar element
   
   g.selectAll('.bar-race')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
  // additonal observed race bar shown in the last step   
  
    g.selectAll('.bar-race-obs')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-obs')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-obs')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);


  // hide all treatment bars and text elements
    // income treatment bars
  g.selectAll('.bar-income-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // race treatment bars   
      
     g.selectAll('.bar-race-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);   


  // show pictogram
    
    //redraw the initial pictorgram
    
    var numCols=10
    
    var numRows = Math.ceil(data.length / numCols);
    var myIndex = d3.range(numCols * numRows);
      
    var treatWakGrpIndx = 0;
    var treatMarGrpIndx = 0;
    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;
    
    
    if(count===0){
    
      
    numCols=20
    
    numRows = Math.ceil(data.length / numCols);
    myIndex = d3.range(numCols * numRows);
      
      // location title and number children in each location
    g.select('#txtValue-ph')
     .transition().duration(0).attr('opacity', 0);
     
    g.select('#txtValue-mixed')
     .transition().duration(0).attr('opacity', 0);
     
    g.select("#stat-ph").transition().duration(0).attr('opacity',0);
    g.select("#stat-mixed").transition().duration(0).attr('opacity',0);
     
     
    g.select(".income-color-scale")
     .transition().duration(0).attr('opacity', 0);
    
     data=data.sort(function(a,b){
        return a.black-b.black;
      })
     
      data = data.map(function (d, idx) {
        d.index = myIndex[idx];
        return d;
      });
  
      
      var use=g.selectAll('use')
             .data(data);
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       .delay(function (d, i) { return 3 * (i + 1);})
       .attr('xlink:href', '#iconCustom')
      .attr('id', function (d) {
          return 'icon' + d.index;
        })
       .attr('x',function(d){
          var remainder = d.index % numCols;
          return xPadding + remainder * clfWBuffer;
       })
        .attr('y', function (d) {
          var whole = Math.floor(d.index / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
        .style("fill",function(d,i){
         if (d.black == 1) {
          return '#4191cf';
        } else {
          return '#f2ca02';
        }})    
        .duration(1500)
        .attr('opacity',1);
     
      
      use.exit().remove();
      
      
    }else if(count >0){
      
    g.select('#txtValue-ph')
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-mixed')
     .transition().duration(0).attr('opacity', 1);
     
    g.select(".income-color-scale")
     .transition().duration(0).attr('opacity', 0);
     
     data=data.sort(function(a,b){
        return a.black-b.black;
      })
     
      data = data.map(function (d, idx) {
        if ((d.treated == 1)){
          d.groupIndx = treatWakGrpIndx;
          treatWakGrpIndx += 1;
        } else if ((d.treated===0)) {
          d.groupIndx = treatMarGrpIndx;
          treatMarGrpIndx += 1;
        } 
        return d;
      });
      
      
      var raceDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
            })
            .entries(data);
            
           raceDataTreat=raceDataTreat.map(function(d,i){
            d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
            return d;
           }); 
    
    console.log("why changed 2?")       
      
    console.log(raceDataTreat);
 
       d3.select("#stat-ph").text("People of Color: "+raceDataTreat[0].value+"%").transition().duration(1500).attr("opacity",1);
       d3.select("#stat-mixed").text("People of Color: "+raceDataTreat[1].value+"%").transition().duration(1500).attr("opacity",1);
       
      var use=g.selectAll('use')
             .data(data);
    
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       .delay(function (d, i) { return 3 * (i + 1);})
       .attr('xlink:href', '#iconCustom')
       .attr('id', function (d) {return 'icon' + d.groupIndx;})
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.treated ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
        .style("fill",function(d,i){
         if (d.black == 1) {
          return '#4191cf';
        } else {
          return '#f2ca02';
        }})
        .duration(0)
        .attr('opacity',1);
      
      use.exit().remove();
      
    }
  
    
  }
  
  
  // showRandom: stick figures colored by experiment income after Randomization
  
  function showRandom(data){
    
     
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
    hideAxis(yAxisBarRaceObs,'.y-axis-race-obs');
    hideAxis(xAxisBarRaceObs,'.x-axis-race-obs');   
    hideAxis(yAxisBarRace,'.y-axis-race-treat');
    hideAxis(xAxisBarRace,'.x-axis-race-treat');
    
  
    // hide all income bar element    
    g.selectAll('.bar-income')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // hide all race bar element
   
   g.selectAll('.bar-race')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
  
  
  // additional observed race bar shown in the last step    
      
  
   g.selectAll('.bar-race-obs')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-obs')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-obs')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
      
   g.select('.race-bar-plot-title-obs')
    .transition()
    .duration(0)
    .attr('opacity',0);

  // hide all treatment bars and text elements
    // income treatment bars
  g.selectAll('.bar-income-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);
      
   // race treatment bars   
      
     g.selectAll('.bar-race-treat')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race-treat')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race-treat')
      .transition()
      //.delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);   
      
        
   g.select('.race-bar-plot-title-treat')
    .transition()
    .duration(0)
    .attr('opacity',0);
    
   g.select('.race-bar-plot-subtitle-treat')
    .transition()
    .duration(0)
    .attr('opacity',0);


if (count===0){

  d3.selectAll("#scroll-up-down").text("Scroll up to step 4");
  d3.selectAll("#scroll-reminder").text(" to randomize the assignment.");
  d3.selectAll("#recallEffectSen").text("");
  d3.selectAll("#legend-canvas-treat-title").style('display','none');
  d3.selectAll("#legend-canvas-treat").style('display','none');
  return null;
  
  }else if(count>0){
    
  
    var numCols=10
    
    var numRows = Math.ceil(data.length / numCols);
    var myIndex = d3.range(numCols * numRows);
      
    var treatWakGrpIndx = 0;
    var treatMarGrpIndx = 0;
    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;
    
  
    g.select('#txtValue-ph')
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-mixed')
     .transition().duration(0).attr('opacity', 1);
     
    g.select(".income-color-scale-treat")
     .transition().duration(1500).attr('opacity', 1);
     
      
      data=data.sort(function(a,b){
        return a.y_experiment-b.y_experiment;
      });
      
      data = data.map(function (d, idx) {
        if ((d.treated == 1)){
          d.groupIndx = treatWakGrpIndx;
          treatWakGrpIndx += 1;
        } else if ((d.treated===0)) {
          d.groupIndx = treatMarGrpIndx;
          treatMarGrpIndx += 1;
        } 
        return d;
      });
      
      
       var incomeDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return d3.mean(v,function(d){return d.y_experiment;}).toFixed(0);
            })
            .entries(data);
            
             incomeDataTreat=incomeDataTreat.map(function(d,i){
              d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
              return d;
            });
            
            
            
      d3.selectAll("#stat-ph").text("Average Income: "+"$"+d3.format(",")(incomeDataTreat[0].value)).call(wrap,120).transition().duration(1500).attr('opacity',1);
      
      d3.selectAll("#stat-mixed").text("Average Income: "+"$"+d3.format(",")(incomeDataTreat[1].value)).call(wrap,120).transition().duration(1500).attr('opacity',1);
      
            
       var incomeDiff=Math.abs(incomeDataTreat[0].value-incomeDataTreat[1].value).toFixed(0);
            
           /// change the section 5 html side text
      d3.selectAll("#no-experiment").text("The difference in earnings between the two groups is now ");
      d3.selectAll("#incomeDIFF-2").text("$"+d3.format(",")(incomeDiff));
      d3.selectAll("#ending-period").text(".");
      d3.selectAll("#with-text").text("");
      d3.selectAll("#recallEffect-1").text("This experiment does a very good job of estimating the causal effect, which in this simulation is")
      d3.selectAll("#causalEffect").text(" $2,000");
      d3.selectAll("#recallEffect-2").text(". The small discrepancy is due to chance.")
      
      d3.selectAll("#whyDIFF-1").text("Why does this randomized experiment work better than an observational comparison?");
      
      d3.selectAll("#scroll-up-down").text("Scroll down");
      d3.selectAll("#scroll-reminder").text(" to find out.");
      d3.selectAll("#legend-canvas-treat-title").style('display','block');
      d3.selectAll("#legend-canvas-treat").style('display','block');
    

      var use=g.selectAll('use')
             .data(data);
    
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       .delay(function (d, i) { return 3 * (i + 1);})
       .attr('xlink:href', '#iconCustom')
       .attr('id', function (d) {return 'icon' + d.groupIndx;})
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.treated ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
        .style('fill',function(d){return incomeColor(d.y_experiment)})
        .duration(0)
        .attr('opacity',1);
      
      use.exit().remove();
    
  }
}//end of else if
  
  // showObsBars
  
 function showObsBars(data){
   
   
   // hide the location and number title
    g.select('#txtValue-ph').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-mixed').transition().duration(0).attr('opacity', 0);
    g.select("#stat-ph").transition().duration(0).attr('opacity',0);
    g.select("#stat-mixed").transition().duration(0).attr('opacity',0);
    g.select(".income-color-scale").transition().duration(0).attr('opacity', 0);

  // hide initial pictorgram element
   
  // icon_tip.html(function (d) {return null;})
   
    
    g.selectAll('use')
      .transition()
      .duration(0)
      .attr('opacity', 0);
      
    g.selectAll('.icon-tip')
     .transition()
     .duration(0)
     .attr('opacity', 0);

    
// income and racial observed data -------------------       
    incomeData=d3.nest()
      .key(function(d){return d.wakefield})
      .rollup(function(v){
        return d3.mean(v,function(d){return d.y_obs;}).toFixed(1);
      })
      .entries(data);
      
      incomeData=incomeData.map(function(d,i){
        d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
      });

       var incomeDiffRaw=Math.abs(incomeData[0].value-incomeData[1].value).toFixed(2);
            
      raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
       }); 
       
          
        var raceDiffRaw=Math.abs(raceData[0].value-raceData[1].value).toFixed(2);
       
        
        /// change the section 5 html side text
      
         // d3.selectAll("#incomeDIFFRaw").text("$"+incomeDiffRaw+"K.");
          
          d3.selectAll("#raceRaw-1").text(raceData[1].value+"%");
          d3.selectAll("#raceRaw-2").text(raceData[0].value+"%");
       
         // d3.selectAll("#raceDIFF").text(raceDiff);
          //d3.selectAll("#experimentReminder").text("try another random assignment");
     
  // show all visual element for income and race bars
   
    showAxis(yAxisBarIncome,'.y-axis-income');
    showAxis(xAxisBarIncome,'.x-axis-income');
    showAxis(yAxisBarRace,'.y-axis-race');
    showAxis(xAxisBarRace,'.x-axis-race');
    
    
      var barsIncome=g.selectAll('.bar-income')
                          .data(incomeData);
      
            barsIncome.enter()
                      .append('rect')
                      .attr('class','bar-income')
                      .merge(barsIncome)
                      .attr('y', drawHeight/2-20)
                      .attr('x', function (d) { return xBarScaleIncome(d.group)+ xBarScaleIncome.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleIncome.bandwidth()/2);  
                      
        barsIncome.exit().remove();  
 
     g.selectAll('.bar-income')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(1500)
      .attr('y',function(d,i){return yBarScaleIncome(d.value);})
      .attr('height', function (d,i) { return (drawHeight/2-20) - yBarScaleIncome(d.value); })
      .attr('opacity',1);

      
     g.selectAll('.bar-text-income')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
      
     g.select('.y-label-income')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)

      
  // show observed race bars
  
    var barsRace=g.selectAll('.bar-race')
                        .data(raceData);
      
       barsRace.enter()
                      .append('rect')
                      .attr('class','bar-race')
                      .merge(barsRace)
                      .attr('y', drawHeight)
                      .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleRace.bandwidth()/2);  
                      
        barsRace.exit().remove();              
  
     g.selectAll('.bar-race')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(1500)
      .attr('y',function(d,i){return yBarScaleRace(d.value);})
      .attr('height', function (d,i) { return drawHeight - yBarScaleRace(d.value); })
      .attr('opacity',1);
      
     g.selectAll('.bar-text-race')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
     
     
     g.select('.y-label-race')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
    
  }
  
  // showTreatBars
  
function showTreatBars(data){
    
   if (count===0){
    
    return null
   
   }
   
    // update treatment income data
  
  if (count>0){
    
      // redefine the scale
      
   var margin = {
    left:100,
    bottom: 100,
    top: 20,
    right: 0,
  };
  
   drawWidth = width - margin.left - margin.right;
   
   
   var gEnter = svg
        .enter()
        .append('svg')
        .attr("preserveAspectRatio", "xMinYMin meet")
                 .attr("viewBox", [0, 0, width, height])
                 .style("overflow", "visible")
                 .classed("svg-content", true);
  
  
      gEnter
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', drawHeight)
        .attr('width', drawWidth)
        .attr('class', 'symbol-g');

      // Re-select G for symbols
      g = div.select('.symbol-g');
  
    
   xBarScaleRace = d3.scaleBand()
                    .paddingInner(0.08)
                    .range([0,drawWidth])
                    .domain(["Public Housing Units","Mixed Income Neighborhood"]);
                    
    xAxisBarRace= d3.axisBottom()
                      .scale(xBarScaleRace);
                  
    xAxisBarRaceObs= d3.axisBottom()
                         .scale(xBarScaleRace)
                         .tickFormat(""); 
    
    
    
       
       // observed race data
       
        raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
       }); 
       
        var raceDiffRaw=Math.abs(raceData[0].value-raceData[1].value).toFixed(2);
      
    
     // treat race
            
        raceDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
            })
            .entries(data);
            
           raceDataTreat=raceDataTreat.map(function(d,i){
            d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
            return d;
           }); 
            
          console.log(raceDataTreat);
          
          var raceDiff=Math.abs(raceDataTreat[0].value-raceDataTreat[1].value).toFixed(2);
        
        /// change the section 5 html side text
      
          d3.selectAll("#with-text").text("");
          d3.selectAll("#whyDIFF-2").text("The lesson is that randomization ensures that the treatment and control groups are comparable, eliminating confounding.");
          d3.selectAll("#whyDIFF-3").text("Randomization makes the two groups much more similar than in the initial observational comparison.");
          
          d3.selectAll("#no-experiment-2").text("The difference in racial composition is ")
          d3.selectAll("#only").text("only ");
          d3.selectAll("#raceDIFF").text(raceDiff);
          d3.selectAll("#percentage-points").text(" percentage points.")
          d3.selectAll("#experimentReminder").text("to repeat the experiment.");
     
     /// hide other visual elements
    
    g.select('#txtValue-ph').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-mixed').transition().duration(0).attr('opacity', 0);
    g.select('#stat-ph').transition().duration(0).attr('opacity', 0);
    g.select('#stat-mixed').transition().duration(0).attr('opacity', 0);
    
    g.select(".income-color-scale").transition().duration(0).attr('opacity', 0);
    
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(xAxisBarRace,'.x-axis-race');
   
   
  // icon_tip.html(function (d) {return null;})
  
  
    g.selectAll('use')
      .transition()
      .duration(0)
      .attr('opacity', 0);
      
    g.selectAll('.icon-tip')
     .transition()
     .duration(0)
     .attr('opacity', 0);
 
 // hide all income bar element    
    g.selectAll('.bar-income')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-income')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-income')
      .transition()
      .duration(0)
      .attr('opacity',0)   
  // hide all race bar element
  
    g.selectAll('.bar-race')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
   g.selectAll('.bar-text-race')
      .transition()
      .duration(0)
      .attr('opacity',0);
      
  
   g.select('.y-label-race')
      .transition()
      .duration(0)
      .attr('opacity',0)  
      
       /// update the range of yAxis
    //yAxisBarIncome.scale(yBarScaleIncome.range([drawHeight/2-20,0]));
    
    
    yAxisBarRaceObs.scale(yBarScaleRaceObs.range([drawHeight/2-20,0]));               
    yAxisBarRace.scale(yBarScaleRace.range([drawHeight,drawHeight/2+20]));
                  
 
   // show observed race bars
    showAxis(xAxisBarRaceObs,'.x-axis-race-obs');
    showAxis(yAxisBarRaceObs,'.y-axis-race-obs');
    
    
     var barsRace=g.selectAll('.bar-race-obs')
                        .data(raceData);
      
       barsRace.enter()
                      .append('rect')
                      .attr('class','bar-race-obs')
                      .merge(barsRace)
                      .attr('y', drawHeight/2-20)
                      .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleRace.bandwidth()/2);  
                      
        barsRace.exit().remove();  
        
        
      var barTextRace = g.selectAll('.bar-text-race-obs').data(raceData);
   
            barTextRace.enter()
              .append('text')
              .attr('class', 'bar-text-race-obs')
              .merge(barTextRace)
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRaceObs(d.value)-10;})
              .attr('x', function (d) { return xBarScaleRace(d.group)+xBarScaleRace.bandwidth()/4;})
              .attr('dx', xBarScaleRace.bandwidth()/4)
              .style('font-size', '16px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextRace.exit().remove();  
     
  
     g.selectAll('.bar-race-obs')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(1500)
      .attr('y',function(d,i){return yBarScaleRaceObs(d.value);})
      .attr('height', function (d,i) { return (drawHeight/2-20)  - yBarScaleRaceObs(d.value); })
      .attr('opacity',1);
      
     g.selectAll('.bar-text-race-obs')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
     
     
     g.select('.y-label-race-obs')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
      
     g.select('.race-bar-plot-title-obs')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
    
 
      
    // show treatment race bars
    
    showAxis(xAxisBarRace,'.x-axis-race-treat');
    showAxis(yAxisBarRace,'.y-axis-race-treat');
    
     var barsRaceTreat=g.selectAll('.bar-race-treat')
                         .data(raceDataTreat);
                         
                         
        barsRaceTreat.enter()
                       .append('rect')
                       .attr('class','bar-race-treat')
                       .merge(barsRaceTreat)
                       .attr('y', drawHeight)
                        .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                        .attr('fill', function (d) { return barColors[d.group]; })
                        .attr('height', 0)
                        .attr('width', xBarScaleRace.bandwidth()/2);  
                      
                      
        barsRaceTreat.exit().remove();  
        
        
            
    var barTextRaceTreat = g.selectAll('.bar-text-race-treat').data(raceDataTreat);
   
            barTextRaceTreat.enter()
              .append('text')
              .attr('class', 'bar-text-race-treat')
              .merge(barTextRaceTreat)
              
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRace(d.value)-10;})
              .attr('x', function (d) { return xBarScaleRace(d.group)+xBarScaleRace.bandwidth()/4;})
              .attr('dx', xBarScaleRace.bandwidth()/4)
              .style('font-size', '16px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextRaceTreat.exit().remove(); 
    
    
     g.selectAll('.bar-race-treat')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(1500)
      .attr('y',function(d,i){return yBarScaleRace(d.value);})
      .attr('height', function (d,i) { return drawHeight - yBarScaleRace(d.value); })
      .attr('opacity',1);
      
     g.selectAll('.bar-text-race-treat')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
     
     
     g.select('.y-label-race-treat')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
      
      
     g.select('.race-bar-plot-title-treat')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
      
     g.select('.race-bar-plot-subtitle-treat')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
      
   }
    
  }
  
  // function to show and hide axis---------------------
  
  function showAxis(axis,className) {
    g.select(className)
      .call(axis)
      .transition().duration(500)
      .style('opacity', 1);
  }

  function hideAxis(axis,nameClass) {
    g.select(nameClass)
      .call(axis)
      .transition().duration(0)
      .style('opacity', 0);
  }

 // function to wrap the text----------------------------
 
 
 function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}

  // function to activate chart--------------------------
  chart.activate = function (index, data) {
    activeIndex = index;
    var sign = activeIndex - lastIndex < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      console.log(i);
      activateFunctions[i](data);
    });
    lastIndex = activeIndex;
  };

 
 // updateData method of chart function------------------------------
  chart.updateData = function (data,raceData,raceDataTreat) {
    
    var numRows = Math.ceil(data.length / numCols);
    
    var treatWakGrpIndx = 0;
    var treatMarGrpIndx = 0;

   data=data.sort(function(a,b){
        return a.black-b.black;
      })
     

  data = data.map(function (d, idx) {
        if ((d.treated == 1)){
          d.groupIndx = treatWakGrpIndx;
          treatWakGrpIndx += 1;
        } else if ((d.treated===0)) {
          d.groupIndx = treatMarGrpIndx;
          treatMarGrpIndx += 1;
        } 
        return d;
      });
      
  
 
          
  d3.selectAll("#stat-ph").text("People of Color: "+raceDataTreat[0].value+"%").transition().duration(1500).attr("opacity",1);
  d3.selectAll("#stat-mixed").text("People of Color: "+raceDataTreat[1].value+"%").transition().duration(1500).attr("opacity",1);



    var use = g.selectAll('use').data(data);

    use
      .enter()
      .append('use')
      .merge(use)
      .transition()
      .delay(function (d, i) { return 10 * (i + 1);})
      .duration(1500)
      .attr('xlink:href', '#iconCustom')
        .attr('id', function (d) {
          return 'icon' + d.groupIndx;
        })
        .attr('x', function (d) {
          var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
          return (d.treated ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
        })
        .attr('y', function (d) {
          var whole = Math.floor(d.groupIndx / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
        .style("fill",function(d,i){
         if (d.black == 1) {
          return '#4191cf';
        } else {
          return '#f2ca02';
        }});

    use.exit().remove();
    
    
    g.select('#txtValue-ph')
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-mixed')
     .transition().duration(0).attr('opacity', 1);
           
    // Draw Treatment Income bars------------------
    
    /// update the range of yAxis
    //yAxisBarIncome.scale(yBarScaleIncome.range([drawHeight/2-20,0]));
    
    yAxisBarRaceObs.scale(yBarScaleRaceObs.range([drawHeight/2-20,0]));
  
    yAxisBarRace.scale(yBarScaleRace.range([drawHeight,drawHeight/2+20]));

  // draw the observed bars--------
        
     g.select('.x-axis-income-treat').style('opacity',0);
     g.select('.y-axis-income-treat').style('opacity',0);
        
      var barsRace=g.selectAll('.bar-race-obs')
                          .data(raceData);
      
            barsRace.enter()
                      .append('rect')
                      .attr('class','bar-race-obs')
                      .merge(barsRace)
                      .attr('y', drawHeight/2-20)
                      .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleRace.bandwidth()/2);  
                      
        barsRace.exit().remove();              
                      
                      
     
   var barTextRace = g.selectAll('.bar-text-obs').data(raceData);
   
            barTextRace.enter()
              .append('text')
              .attr('class', 'bar-text-race-obs')
              .merge(barTextRace)
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRaceObs(d.value)-5;})
              .attr('x', function (d) { return xBarScaleRace(d.group)+xBarScaleRace.bandwidth() / 4;})
              .attr('dx', xBarScaleRace.bandwidth() / 4)
              .style('font-size', '16px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextRace.exit().remove();
              
     g.append("text")
    .attr("class", "y-label-race-obs")
    .attr("text-anchor", "middle")
    .attr("x", -90)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("People of Color %")
    .attr('opacity',0); 
    
    
    g.append("text")
    .attr('class','race-bar-plot-title-obs')
    .attr('text-anchor','middle')
    .attr('x',(drawWidth/2))
    .attr('y',-margin.top)
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
        .text("Observational Comparison")
    .attr('opacity',0);
    
        // Draw Treatment Race bars
    
    
     g.select('.x-axis-race-treat').style('opacity',0);
     g.select('.y-axis-race-treat').style('opacity',0);
        
     var barsRaceTreat=g.selectAll('.bar-race')
                        .data(raceDataTreat);
      
       barsRaceTreat.enter()
                      .append('rect')
                      .attr('class','bar-race-treat')
                      .merge(barsRaceTreat)
                      .attr('y', drawHeight)
                      .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleRace.bandwidth()/2);  
                      
        barsRaceTreat.exit().remove();              
                      
                      
     
   var barTextRaceTreat = g.selectAll('.bar-text').data(raceDataTreat);
   
            barTextRaceTreat.enter()
              .append('text')
              .attr('class', 'bar-text-race-treat')
              .merge(barTextRaceTreat)
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRace(d.value)-5;})
              .attr('x', function (d) { return xBarScaleRace(d.group);})
              .attr('dx', xBarScaleRace.bandwidth() / 4)
              .style('font-size', '16px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextRaceTreat.exit().remove();
              
     g.append("text")
    .attr("class", "y-label-race-treat")
    .attr("text-anchor", "middle")
    .attr("x", -350)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("People of Color %")
    .attr('opacity',0); 
    
    
    
        
    g.append("text")
    .attr('class','race-bar-plot-title-treat')
    .attr('text-anchor','middle')
    .attr('x',(drawWidth/2))
    .attr('y',(drawHeight/2+5))
    .style("font-size", "16px") 
    .style("text-decoration", "underline")  
        .text("Experimental Comparison")
        //.call(wrap, 120)
    .attr('opacity',0);
    
    g.append("text")
    .attr('class','race-bar-plot-subtitle-treat')
    .attr('text-anchor','middle')
    .attr('x',(drawWidth/2))
    .attr('y',(drawHeight/2+20))
    .style("font-size", "10px") 
    //.style("text-decoration", "underline")  
        .text("(with Random Assignment)")
        //.call(wrap, 120)
    .attr('opacity',0); 
    
    
  };// end of updateData function

  return chart;
   
};
