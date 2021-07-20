// Draw pictogram function-----------------------------

var pictogramScroll = function () {
  // size variable
  var height = 500,
    width = 500;
  //Magrin: spaces saved in the svg for axes and titles
  var margin = {
    left:60,
    bottom: 100,
    top: 30,
    right: 10,
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
  var xPadding = 5;
  var yPadding = 5;

  //horizontal and vertical spacing between the icons
  var clfHBuffer = 15;
  var clfWBuffer = 12;

  //specify the number of columns for pictogram layout
  var numCols = 10;

  //tooltip for each icon

  var icon_tip = d3
    .tip()
    .attr('class', 'icon-tip')
    .direction('e')
    .offset([-35, 0])
    .html(function (d) {
      if ((d.wakefield==1) & (d.black==1)){
        return(
          'Community: Wakefield'+
          '<br>'+
          'Race: People of color');
      }else if((d.wakefield==1)&(d.black===0)){
        return(
          'Community: Wakefield'+
          '<br>'+
          'Race: White');
        
      }else if ((d.wakefield===0)&(d.black===0)){
        return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: White');
        
      }else{
        return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: People of color');
      }
    });
  
  
  
  // Income Bar Scale and Axis----------------------
  
  var yBarScaleIncome = d3.scaleLinear()
                    .range([drawHeight,0]);
                   
    
  var xBarScaleIncome = d3.scaleBand()
                    .paddingInner(0.08)
                    .range([0,drawWidth])
                    .domain(["MLK Jr. Towers","Wakefield"]);


  var yAxisBarIncome = d3.axisLeft()
                   .scale(yBarScaleIncome)
                   .tickFormat(function(d){
                     return "$"+d+"K";
                   });
                   
                   
  var xAxisBarIncome= d3.axisBottom()
                  .scale(xBarScaleIncome);
                  
          
 // Race Bar Scale and Axis-------------------
   
  var yBarScaleRace = d3.scaleLinear()
                    .range([drawHeight,0]);
                   
    
  var xBarScaleRace = d3.scaleBand()
                    .paddingInner(0.08)
                    .range([0,drawWidth])
                    .domain(["MLK Jr. Towers","Wakefield"]);
                     
 
  var yAxisBarRace = d3.axisLeft()
                   .scale(yBarScaleRace)
                   .tickFormat(function(d){
                     return d+"%";
                   });
                   
                   
  var xAxisBarRace= d3.axisBottom()
                  .scale(xBarScaleRace);
  
  
  // Color scale--------------  
  
  
    var incomeColor=d3.scaleSequential(d3.interpolateRdYlGn);
   // var incomeColor=d3.scaleSequential(d3.interpolateYlGn);
   //  var incomeColor=d3.scaleSequential(d3.interpolateGreens);
                  
  var barColors = { "MLK Jr. Towers": '#4191cf', "Wakefield": '#f2ca02' };
  
  
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
        return d3.mean(v,function(d){return d.y_obs;}).toFixed(1);
      })
      .entries(data);
      
      incomeData=incomeData.map(function(d,i){
        d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
        return d;
      });
      
      console.log(incomeData);
     
      var incomeDataTreat=d3.nest()
      .key(function(d){return d.treated})
      .rollup(function(v){
        return d3.mean(v,function(d){return d.y_experiment;}).toFixed(1);
      })
      .entries(data);
      
       incomeDataTreat=incomeDataTreat.map(function(d,i){
        d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
        return d;
      });
      
      console.log(incomeDataTreat);
      
      var incomeMin=Math.min(d3.min(incomeData,function(d){return d.value}),d3.min(incomeDataTreat,function(d){return d.value}));
      var incomeMax=Math.max(d3.max(incomeData,function(d){return d.value}),d3.max(incomeDataTreat,function(d){return d.value}));
      
      console.log(incomeMax);
      
      // update the domain of two scales with range of income
       yBarScaleIncome.domain([0, incomeMax+5]);
       
       incomeColor.domain([incomeMin-10, incomeMax+10]);
       
      var raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
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
        d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
        return d;
       }); 
        
      console.log(raceDataTreat);
      
      var raceMax=Math.max(d3.max(raceData,function(d){return d.value}),d3.max(raceDataTreat,function(d){return d.value}));
      
      yBarScaleRace.domain([0, raceMax+5]);
       
      setupVis(data,incomeData,raceData,incomeDataTreat,raceDataTreat);
     
    });// end of selection.each

    setupSections();
  }; // end of chart function to return
  
  var setupVis=function(data,incomeData,raceData,incomeDataTreat,raceDataTreat){
   

    // Initial pictogram
    
     var gEnter = svg
        .enter()
        .append('svg')
        //.merge(svg)
        //.attr('height', height)
        //.attr('width', width);
        .attr('preserveAspectRatio', 'xMinYMin meet')
        //.attr('viewBox', [0, 0, width, height]);
        .attr('viewBox', [0, 0, width - 50, height - 50]);
  
  
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
      
      console.log("what is this: ");
      
      console.log(data);

      //text element to display number of figures in each location
      g.append('text')
        .attr('id', 'txtValue-mlk')
        .attr('class', 'initial-txtValue')
        .attr('x', xPadding)
        .attr('y', yPadding)
        .attr('dy', -10)
        .text('Van Dyke Public Housing: '+data.length/2);
        
        
       g.append('text')
        .attr('id', 'txtValue-wakefield')
        .attr('class', 'initial-txtValue')
        .attr('x', xPadding*2+width/2)
        .attr('y', yPadding)
        .attr('dy', -10)
        .text('Nehemiah Houses: '+data.length/2);
        
      

      g.call(icon_tip);

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
        })
        //.attr('fill',function(d,i){return incomeColor(d.y_obs)})
        .on('mouseover', icon_tip.show)
        .on('mouseout', icon_tip.hide);
        
// Income Bar graph-----------------------            
     g.append('g')
        .attr('class','x-axis-income')
        .attr("transform", 'translate(0,'+drawHeight+')')
        .call(xAxisBarIncome);
        
     g.append('g')
        .attr('class','y-axis-income')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarIncome);
        
     g.select('.x-axis-income').style('opacity',0);
     g.select('.y-axis-income').style('opacity',0);
        
     var bars=g.append('g')
                .selectAll('.bar')
                .data(incomeData);
      
              bars.enter()
                  .append('rect')
                  .attr('class','bar-income')
                  .merge(bars)
                  .attr('y', drawHeight)
                  .attr('x', function (d) { return xBarScaleIncome(d.group)+ xBarScaleIncome.bandwidth()/4;})
                  .attr('fill', function (d) { return barColors[d.group]; })
                  .attr('height', 0)
                  .attr('width', xBarScaleIncome.bandwidth()/2); 
                  
                  
         bars.exit().remove();
     
     var barTextIncome = g.selectAll('.bar-text').data(incomeData);
   
        barTextIncome.enter()
                .append('text')
                .attr('class', 'bar-text-income')
                .merge(barTextIncome)
                .text(function (d) { return "$"+d.value+"k"; })
                .attr('y', 0)
                .attr('dy',function(d,i){return yBarScaleIncome(d.value)-10;})
                .attr('x', function (d) { return xBarScaleIncome(d.group);})
                .attr('dx', xBarScaleIncome.bandwidth() / 4)
                .style('font-size', '25px')
                .attr('fill', 'black')
                .attr('opacity', 0);
                
          barTextIncome.exit().remove();     
      
              
       g.append("text")
        .attr("class", "y-label-income")
        .attr("text-anchor", "middle")
        .attr("x", -margin.left*4)
        .attr("y", -40)
        .attr("transform", "rotate(-90)")
        .text("Average Income")
        .attr('opacity',0);                   
                       
                       
  /// Racial composition bar ------------------------------------------
  
    g.append('g')
          .attr('class','x-axis-race')
          .attr("transform", 'translate(0,'+drawHeight+')')
          .call(xAxisBarRace);
        
     g.append('g')
        .attr('class','y-axis-race')
        .attr("transform", 'translate(0,0)')
        .call(yAxisBarRace);
        
     g.select('.x-axis-race').style('opacity',0);
     g.select('.y-axis-race').style('opacity',0);
        
     var barsRace=g.append('g')
                .selectAll('.bar')
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
              .merge(barTextRace)
              .attr('class', 'bar-text-race')
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRace(d.value)-10;})
              .attr('x', function (d) { return xBarScaleRace(d.group);})
              .attr('dx', xBarScaleRace.bandwidth() / 4)
              .style('font-size', '25px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
      barTextRace.exit().remove();
              
       g.append("text")
        .attr("class", "y-label-race")
        .attr("text-anchor", "middle")
        .attr("x", -margin.left*4)
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
    activateFunctions[1] = showObsIncomeBar;
    activateFunctions[2] = showObsRaceBar;
    activateFunctions[3] = showInitialPlus;// has an extra step of randomize the figures
    activateFunctions[4] = showTreatBars;
  };
  
  // showInitial----------------------------------
  
  
  function showInitial(data) {
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
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
    g.select('#txtValue-mlk')
     .text("MLK Jr. Towers: "+data.length/2)
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-wakefield')
     .attr('x', xPadding*2+width/2)
     .text("Wakefield: "+data.length/2)
     .transition().duration(0).attr('opacity', 1);
    
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
        .style('fill',function(d,i){ return incomeColor(d.y_obs)})
      .duration(1500)
      .attr('opacity',1);
     // .attr('class', function (d, i) {
       // if (d.black == 1) {
         // return 'people-of-color';
      //  } else {
        //  return 'people-of-white';
      //  }
    //  });
      
      use.exit().remove();
      
      
    icon_tip.html(function (d) {
      if ((d.wakefield==1) & (d.black==1)){
        return(
          'Community: Wakefield'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Income: '+d.y0);
      }else if((d.wakefield==1)&(d.black===0)){
        return(
          'Community: Wakefield'+
          '<br>'+
          'Race: White' +
          '<br>'+
          'Income: '+d.y0);
        
      }else if ((d.wakefield===0)&(d.black===0)){
        return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: White'+
          '<br>'+
          'Income: '+d.y0
          );
        
      }else{
        return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Income: '+d.y0
          );
      }
    });
    
    g.call(icon_tip);
  
    
  }
  
  

  // showInitial+ a button animation--------------------
  function showInitialPlus(data) {
    
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-income-treat');
    hideAxis(xAxisBarIncome,'.x-axis-income-treat');
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
    
    numCols=20
    
    var numRows = Math.ceil(data.length / numCols);
    var myIndex = d3.range(numCols * numRows);
      
    var treatWakGrpIndx = 0;
    var treatMarGrpIndx = 0;
    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;
    
    console.log("what is count");
    console.log(count);
    console.log(myIndex);
    
    
    if(count===0){
      
      // location title and number children in each location
    g.select('#txtValue-mlk')
     .text("MLK Jr. Towers: "+data.length/2)
     .transition().duration(0).attr('opacity', 0);
     
    g.select('#txtValue-wakefield')
     .attr('x', xPadding*2+width/2)
     .text("Wakefield: "+data.length/2)
     .transition().duration(0).attr('opacity', 0);
    
      //data = data.map(function (d, idx) {
        //if ((d.wakefield == 1)){
         // d.groupIndx = obsWakGrpIndx;
         // obsWakGrpIndx += 1;
      //  } else if ((d.wakefield===0)) {
       //   d.groupIndx = obsMarGrpIndx;
       //   obsMarGrpIndx += 1;
      // } 
     //   return d;
     // });
     
     
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
        //.attr('x', function (d) {
        //  var remainder = d.groupIndx % numCols; //calculates the x position (column number) using modulus
        //  return (d.wakefield ===0 ? 0 : (width / 2)) + xPadding + remainder * clfWBuffer; //apply the buffer and return value
       //  })
        .attr('y', function (d) {
          var whole = Math.floor(d.index / numCols); //calculates the y position (row number)
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        })
      .duration(1500)
      .attr('opacity',1)
      .attr('class', function (d, i) {
        if (d.black == 1) {
          return 'people-of-color';
        } else {
          return 'people-of-white';
        }
      });
      
      use.exit().remove();
      
      
    }else if(count >0){
      
    g.select('#txtValue-mlk')
     .text("Assigned MLK Jr. Towers: "+data.length/2)
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-wakefield')
     .attr('x', width/2)
     .text("Assigned Wakefield: "+data.length/2)
     .transition().duration(0).attr('opacity', 1);
      
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
      
      
      var use=g.selectAll('use')
             .data(data);
    
    
    use.enter()
       .append('use')
       .merge(use)
       .transition()
       //.delay(function (d, i) { return 3 * (i + 1);})
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
      .duration(1500)
      .attr('opacity',1)
      .attr('class', function (d, i) {
        if (d.black == 1) {
          return 'people-of-color';
        } else {
          return 'people-of-white';
        }
      });
      
      use.exit().remove();
      
    }
    


    icon_tip.html(function (d) {
      if ((d.wakefield==1) & (d.black==1)){
        return(
          'Community: Wakefield'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Income: '+d.y0);
      }else if((d.wakefield==1)&(d.black===0)){
        return(
          'Community: Wakefield'+
          '<br>'+
          'Race: White' +
          '<br>'+
          'Income: '+d.y0);
        
      }else if ((d.wakefield===0)&(d.black===0)){
        return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: White'+
          '<br>'+
          'Income: '+d.y0
          );
        
      }else{
        return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Income: '+d.y0
          );
      }
    });
    
    g.call(icon_tip);
  
    
  }
  
  
  // showObsIncomeBar
  
  function showObsIncomeBar(data){
    
    // hide the location and number title
    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 0);
    
    
    // hide the observed race bar element
    
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
    
    // hide all income bar element    
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
      .attr('opacity',0);
      
    // hide initial pictorgram element
   
   icon_tip.html(function (d) {return null;})
   
    
    g.selectAll('use')
      .transition()
      .duration(0)
      .attr('opacity', 0);
      
    g.selectAll('.icon-tip')
     .transition()
     .duration(0)
     .attr('opacity', 0);
     
     // show observed income bar element
     
     
    yAxisBarIncome = d3.axisLeft()
                   .scale(yBarScaleIncome.range([drawHeight,0]))
                   .tickFormat(function(d){
                     return d+"K";
                   });
 
   
      // ensure bar axis is set
    showAxis(xAxisBarIncome,'.x-axis-income');
    showAxis(yAxisBarIncome,'.y-axis-income');
    
    incomeData=d3.nest()
      .key(function(d){return d.wakefield})
      .rollup(function(v){
        return d3.mean(v,function(d){return d.y_obs;}).toFixed(1);
      })
      .entries(data);
      
      incomeData=incomeData.map(function(d,i){
        d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
        return d;
      });
    
    var barsIncome=g.selectAll('.bar-income')
                    .data(incomeData);
                    
        barsIncome.enter()
                  .append('rect')
                  .attr('class','bar-income')
                  .merge(barsIncome)
                   .attr('y', drawHeight)
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
      .attr('height', function (d,i) { return drawHeight - yBarScaleIncome(d.value); })
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
     
  }
  
  
  // showRaceCompBar
  
  function showObsRaceBar(data){
    
    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 0);
   
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
   
   
   icon_tip.html(function (d) {return null;})
  
  
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
      
  /// show observe race bar elements
  
    yAxisBarRace = d3.axisLeft()
                   .scale(yBarScaleRace.range([drawHeight,0]))
                   .tickFormat(function(d){
                     return d+"%";
                   });
     
  
     // ensure bar axis is set
    showAxis(xAxisBarRace,'.x-axis-race');
    showAxis(yAxisBarRace,'.y-axis-race');
  
     
     raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
        return d;
       }); 
       
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
  
  
  // showTreatIncomeBar
  
  function showTreatBars(data){
    
    console.log('what is count?');
    
    console.log(count);
    
   if (count===0){
    
    return null
   
   }
   
    // update treatment income data
  
  if (count>0){
        
         var incomeDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return d3.mean(v,function(d){return d.y_experiment;}).toFixed(1);
            })
            .entries(data);
            
             incomeDataTreat=incomeDataTreat.map(function(d,i){
              d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
              return d;
            });
            
            console.log("incomeDataTreat");
            console.log(incomeDataTreat);
            
            var incomeDiff=Math.abs(incomeDataTreat[0].value-incomeDataTreat[1].value).toFixed(2);
            
         var raceDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
            })
            .entries(data);
            
           raceDataTreat=raceDataTreat.map(function(d,i){
            d.group=d.key=="0"? "MLK Jr. Towers":"Wakefield";
            return d;
           }); 
            
          console.log(raceDataTreat);
          
          var raceDiff=Math.abs(raceDataTreat[0].value-raceDataTreat[1].value).toFixed(2);
        
        /// change the section 5 html side text
      
          d3.selectAll("#incomeDIFF").text("$"+incomeDiff+"K.");
          d3.selectAll("#whyDIFF").text("Why does this work better than the observational comparison? Randomization ensures that the treatment and control groups are comparable.");
          d3.selectAll("#raceDIFF").text(raceDiff);
          d3.selectAll("#experimentReminder").text("try another random assignment.");
     
     /// hide other visual elements
    
    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 0);
   
    hideAxis(yAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarIncome,'.x-axis-income');
    hideAxis(yAxisBarRace,'.y-axis-race');
    hideAxis(xAxisBarRace,'.x-axis-race');
   
   
   icon_tip.html(function (d) {return null;})
  
  
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
    yAxisBarIncome = d3.axisLeft()
                   .scale(yBarScaleIncome.range([drawHeight/2-20,0]))
                   .tickFormat(function(d){
                     return d+"K";
                   });
 
   yAxisBarRace = d3.axisLeft()
                   .scale(yBarScaleRace.range([drawHeight,drawHeight/2+20]))
                   .tickFormat(function(d){
                     return d+"%";
                   });
 
 
      
    // show treatment income bars
      // ensure bar axis is set
    showAxis(xAxisBarIncome,'.x-axis-income-treat');
    showAxis(yAxisBarIncome,'.y-axis-income-treat');
    
    var barsIncomeTreat=g.selectAll('.bar-income-treat')
                         .data(incomeDataTreat);
                         
                         
        barsIncomeTreat.enter()
                       .append('rect')
                       .attr('class','bar-income-treat')
                       .merge(barsIncomeTreat)
                       .attr('y', drawHeight/2-20)
                        .attr('x', function (d) { return xBarScaleIncome(d.group)+ xBarScaleIncome.bandwidth()/4;})
                        .attr('fill', function (d) { return barColors[d.group]; })
                        .attr('height', 0)
                        .attr('width', xBarScaleIncome.bandwidth()/2);  
                      
        barsIncomeTreat.exit().remove();  
        
        
            
    var barTextIncomeTreat = g.selectAll('.bar-text-income-treat').data(incomeDataTreat);
   
            barTextIncomeTreat.enter()
              .append('text')
              .attr('class', 'bar-text-income-treat')
              .merge(barTextIncomeTreat)
              .text(function (d) { return "$"+d.value+"k"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleIncome(d.value)-10;})
              .attr('x', function (d) { return xBarScaleIncome(d.group);})
              .attr('dx', xBarScaleIncome.bandwidth() / 4)
              .style('font-size', '25px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextIncomeTreat.exit().remove(); 
        

     g.selectAll('.bar-income-treat')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(1500)
      .attr('y',function(d,i){return yBarScaleIncome(d.value);})
      .attr('height', function (d,i) { return (drawHeight/2-20) - yBarScaleIncome(d.value); })
      .attr('opacity',1);
      
     g.selectAll('.bar-text-income-treat')
      .transition(600)
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
     
     
     g.select('.y-label-income-treat')
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
              .attr('x', function (d) { return xBarScaleRace(d.group);})
              .attr('dx', xBarScaleRace.bandwidth() / 4)
              .style('font-size', '25px')
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
      .transition(600)
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
     
     
     g.select('.y-label-race-treat')
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
  chart.updateData = function (data,incomeDataTreat,raceDataTreat) {
    
    var numRows = Math.ceil(data.length / numCols);
    
    var treatWakGrpIndx = 0;
    var treatMarGrpIndx = 0;


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

    console.log('updated data: '+ data);

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
        });

    use.exit().remove();
    
    
    g.select('#txtValue-mlk')
     .text("Assigned MLK Jr. Towers: "+data.length/2)
     .transition().duration(0).attr('opacity', 1);
     
    g.select('#txtValue-wakefield')
     .attr('x', width/2)
     .text("Assigned Wakefield: "+data.length/2)
     .transition().duration(0).attr('opacity', 1);
    
    
    icon_tip.html(function(d){
      if(d.wakefield===0){
        if(d.black===0 & d.treated===0){
          return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Assigned Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: White'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }else if(d.black===0 & d.treated==1){
          return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Assigned Community: Wakefield'+
          '<br>'+
          'Race: White'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }else if(d.black==1 & d.treated===0){
           return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Assigned Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }else if(d.black==1 & d.treated==1){
          return(
          'Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Assigned Community: Wakefield'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }
        
       }else if(d.wakefield==1){
         
         if(d.black===0 & d.treated===0){
          return(
          'Community: Wakefield'+
          '<br>'+
          'Assigned Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: White'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }else if(d.black===0 & d.treated==1){
          return(
          'Community: Wakefield'+
          '<br>'+
          'Assigned Community: Wakefield'+
          '<br>'+
          'Race: White'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }else if(d.black==1 & d.treated===0){
           return(
          'Community: Wakefield'+
          '<br>'+
          'Assigned Community: Martin Luther King Jr. Towers'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }else if(d.black==1 & d.treated==1){
          return(
          'Community: Wakefield'+
          '<br>'+
          'Assigned Community: Wakefield'+
          '<br>'+
          'Race: People of color'+
          '<br>'+
          'Observed Income: '+d.y_obs+
          '<br>'+
          'Experiment Income: '+ d.y_experiment);
        }
       }
    })// end of icon-tip update
    
           
    // Draw Treatment Income bars------------------
    
    /// update the range of yAxis
    yAxisBarIncome = d3.axisLeft()
                   .scale(yBarScaleIncome.range([drawHeight/2-20,0]))
                   .tickFormat(function(d){
                     return d+"K";
                   });
 
   yAxisBarRace = d3.axisLeft()
                   .scale(yBarScaleRace.range([drawHeight,drawHeight/2+20]))
                   .tickFormat(function(d){
                     return d+"%";
                   });
                   
  
  
  // draw the bars--------
        
     g.select('.x-axis-income-treat').style('opacity',0);
     g.select('.y-axis-income-treat').style('opacity',0);
        
      var barsIncome=g.selectAll('.bar-income')
                          .data(incomeDataTreat);
      
            barsIncome.enter()
                      .append('rect')
                      .attr('class','bar-income-treat')
                      .merge(barsIncome)
                      .attr('y', drawHeight/2-20)
                      .attr('x', function (d) { return xBarScaleIncome(d.group)+ xBarScaleIncome.bandwidth()/4;})
                      .attr('fill', function (d) { return barColors[d.group]; })
                      .attr('height', 0)
                      .attr('width', xBarScaleIncome.bandwidth()/2);  
                      
        barsIncome.exit().remove();              
                      
                      
     
   var barTextIncomeTreat = g.selectAll('.bar-text').data(incomeDataTreat);
   
            barTextIncomeTreat.enter()
              .append('text')
              .attr('class', 'bar-text-income-treat')
              .merge(barTextIncomeTreat)
              .text(function (d) { return "$"+d.value+"k"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleIncome(d.value)-10;})
              .attr('x', function (d) { return xBarScaleIncome(d.group);})
              .attr('dx', xBarScaleIncome.bandwidth() / 4)
              .style('font-size', '25px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextIncomeTreat.exit().remove();
              
     g.append("text")
    .attr("class", "y-label-income-treat")
    .attr("text-anchor", "middle")
    .attr("x", -80)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("Average Income")
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
              .attr('dy',function(d,i){return yBarScaleRace(d.value)-10;})
              .attr('x', function (d) { return xBarScaleRace(d.group);})
              .attr('dx', xBarScaleRace.bandwidth() / 4)
              .style('font-size', '25px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
        barTextRaceTreat.exit().remove();
              
     g.append("text")
    .attr("class", "y-label-race-treat")
    .attr("text-anchor", "middle")
    .attr("x", -280)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("People of Color %")
    .attr('opacity',0); 
    
  };// end of updateData function

  return chart;
   
};
