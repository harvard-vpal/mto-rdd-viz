// Draw pictogram function-----------------------------

var pictogramScroll = function () {
  // size variable
  var height = 500,
    width = 500;
  //Magrin: spaces saved in the svg for axes and titles
  var margin = {
    left:50,
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
  var xPadding = 10;
  var yPadding = 10;

  //horizontal and vertical spacing between the icons
  var hBuffer = 15;
  var wBuffer = 18;

  //horizontal and vertical spacing between the icons for classified
  var clfHBuffer = 15;
  var clfWBuffer = 12;

  //specify the number of columns and rows for pictogram layout
  var numCols = 10;
  var clfNumCols = 12;
 

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

  // global variable for each categories data length;

  var dt_wakefield_black_length=0;
  var dt_wakefield_other_length=0;
  var dt_martin_black_length=0;
  var dt_martin_other_length=0;
  
  
  // Observed Income bar graph scale and axis
  
  var yBarScaleIncome = d3.scaleLinear()
                    .range([drawHeight,0]);
                   
    
  var xBarScaleIncome = d3.scaleBand()
                    .paddingInner(0.08)
                    .range([0,drawWidth])
                    .domain(["MLK Jr. Towers","Wakefield"]);
                    
                    
    
  var barColorsIncome = { "MLK Jr. Towers": '#4191cf', "Wakefield": '#f2ca02' };
  
  var barColorsRace = { "MLK Jr. Towers": '#4191cf', "Wakefield": '#4191cf' };
 
  var yAxisBarIncome = d3.axisLeft()
                   .scale(yBarScaleIncome)
                   .tickFormat(function(d){
                     return d+"K";
                   });
                   
                   
  var xAxisBarIncome= d3.axisBottom()
                  .scale(xBarScaleIncome);
                  
                  
  // observed race bar graph scale and axis         
 
   
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
                   

                   
 
  
  
  var chart = function (selection) {
    // Height/width of the drawing area for data symbols
    //var drawHeight = height - margin.bottom - margin.top;
    //var drawWidth = width - margin.left - margin.right;

   // var clfboxheight = height / 2 - margin.bottom - margin.top;
  //  var clfboxwidth = width / 2 - margin.bottom - margin.top;
   
      var localBoxHeight=height - margin.bottom - margin.top;
      var localBoxWidth= width / 2 - margin.bottom - margin.top;

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
      
      var incomeMax=Math.max(d3.max(incomeData,function(d){return d.value}),d3.max(incomeDataTreat,function(d){return d.value}));
      
      console.log(incomeMax);
      
       yBarScaleIncome.domain([0, incomeMax+5]);
       
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
      
      console.log("huan: "+ drawWidth);
      console.log("huan: "+drawHeight);
       
       
      setupVis(data,incomeData,raceData,incomeDataTreat,raceDataTreat);
     
    });// end of selection.each

    setupSections();
  }; // end of chart function to return
  
  var setupVis=function(data,incomeData,raceData,incomeDataTreat,raceDataTreat){
   
   // var drawHeight = height - margin.bottom - margin.top;
   // var drawWidth = width - margin.left - margin.right;
   
   console.log("Megan: "+ drawWidth);
   console.log("Megan: " +drawHeight);
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

      //generate a d3 range for the total number of required elements
      var myIndex = d3.range(numCols * numRows);
     
      console.log(myIndex);
      data = data.map(function (d, idx) {
        d.index = myIndex[idx];
        return d;
      });
      console.log(data);
      
    var treatWakGrpIndx = 0;
    var treatMarGrpIndx = 0;
    var obsWakGrpIndx = 0;
    var obsMarGrpIndx = 0;

    dt_wakefield_black_length=data.filter(function(d){
            return (d.wakefield==1) & (d.black==1);
          }).length;
          
    dt_wakefield_other_length=data.filter(function(d){
            return (d.wakefield==1) & (d.black===0);
          }).length;
          
    dt_martin_black_length=data.filter(function(d){
            return (d.wakefield===0) & (d.black==1);
          }).length;
          
    dt_martin_other_length=data.filter(function(d){
            return (d.wakefield===0) & (d.black===0);
          }).length;
          
          
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
        .text('MLK Jr. Towers: '+data.length/2);
        
        
       g.append('text')
        .attr('id', 'txtValue-wakefield')
        .attr('class', 'initial-txtValue')
        .attr('x', xPadding*2+width/2)
        .attr('y', yPadding)
        .attr('dy', -10)
        .text('Wakefield: '+data.length/2);
        
      

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
      
     var barsE=bars.enter()
                  .append('rect')
                  .attr('class','bar-income');
                  
                  
        bars=bars.merge(barsE)
                .attr('y', drawHeight)
                .attr('x', function (d) { return xBarScaleIncome(d.group)+ xBarScaleIncome.bandwidth()/4;})
                .attr('fill', function (d) { return barColorsIncome[d.group]; })
                .attr('height', 0)
                .attr('width', xBarScaleIncome.bandwidth()/2);   
     
   var barText = g.selectAll('.bar-text').data(incomeData);
   
            barText.enter()
              .append('text')
              .attr('class', 'bar-text-income')
              .text(function (d) { return d.value+"k"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleIncome(d.value)-10;})
              .attr('x', function (d) { return xBarScaleIncome(d.group);})
              .attr('dx', xBarScaleIncome.bandwidth() / 4)
              .style('font-size', '25px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
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
      
     var barsRaceE=barsRace.enter()
                  .append('rect')
                  .attr('class','bar-race');
                  
                  
        barsRace=barsRace.merge(barsRaceE)
                .attr('y', drawHeight)
                .attr('x', function (d) { return xBarScaleRace(d.group)+ xBarScaleRace.bandwidth()/4;})
                .attr('fill', function (d) { return barColorsRace[d.group]; })
                .attr('height', 0)
                .attr('width', xBarScaleRace.bandwidth()/2);   
     
   var barText = g.selectAll('.bar-text').data(raceData);
   
            barText.enter()
              .append('text')
              .attr('class', 'bar-text-race')
              .text(function (d) { return d.value+"%"; })
              .attr('y', 0)
              .attr('dy',function(d,i){return yBarScaleRace(d.value)-10;})
              .attr('x', function (d) { return xBarScaleRace(d.group);})
              .attr('dx', xBarScaleRace.bandwidth() / 4)
              .style('font-size', '25px')
              .attr('fill', 'black')
              .attr('opacity', 0);
              
    g.append("text")
    .attr("class", "y-label-race")
    .attr("text-anchor", "middle")
    .attr("x", -margin.left*4)
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("People of Color %")
    .attr('opacity',0);
        
    
  };
  
  
  
  var setupSections = function () {
    activateFunctions[0] = showInitial;
    activateFunctions[1] = showObsIncomeBar;
    activateFunctions[2] = showObsRaceBar;
    activateFunctions[3] = showInitial;// has an extra step of randomize the figures
    //activateFunctions[4] = showTreatIncomeBar;
    //activateFunctions[5] = showTreatRaceBar;
  };
  
  // showInital needs a button animation
 
  // showInital needs a button animation
  function showInitial() {
    
    hideAxis(yAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarIncome,'.y-axis-income');
    hideAxis(xAxisBarRace,'.x-axis-race');
    hideAxis(yAxisBarRace,'.y-axis-race');
  
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
      .delay(function (d, i) { return 300 * (i + 1);})
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
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0);

    
    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 1);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 1);
    
    //change the class of person
    g.selectAll('use')
      .transition()
      .duration(1500)
      .attr('opacity',1)
      .attr('class', function (d, i) {
        if (d.black == 1) {
          return 'people-of-color';
        } else {
          return 'people-of-white';
        }
      });

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
  
  function showObsIncomeBar(){
    
    // hide the location and number title
    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 0);
    
    
    // hide the observed race bar element
    
    hideAxis(xAxisBarIncome,'.x-axis-race');
    hideAxis(yAxisBarIncome,'.y-axis-race');
    
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
      //.delay(function (d, i) { return 300 * (i + 1);})
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
     
      // ensure bar axis is set
    showAxis(xAxisBarIncome,'.x-axis-income');
    showAxis(yAxisBarIncome,'.y-axis-income');
     
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
  
  function showObsRaceBar(){
    
    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 0);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 0);
   
    hideAxis(yAxisBarIncome,'.x-axis-income');
    hideAxis(xAxisBarIncome,'.y-axis-income');
   
   
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
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(0)
      .attr('opacity',0)   
      
  /// show race bar elements
  
     // ensure bar axis is set
    showAxis(xAxisBarRace,'.x-axis-race');
    showAxis(yAxisBarRace,'.y-axis-race');
    
     g.selectAll('.bar-race')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(1500)
      .attr('y',function(d,i){return yBarScaleRace(d.value);})
      .attr('height', function (d,i) { return drawHeight - yBarScaleRace(d.value); })
      .attr('opacity',1);
      
     g.selectAll('.bar-text-race')
      .transition(600)
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
     
     
     g.select('.y-label-race')
      .transition()
      .delay(function (d, i) { return 300 * (i + 1);})
      .duration(600)
      .attr('opacity',1)
  }
  
  function showPrediction() {
  var truepos = 0,
      trueneg = 0,
      falsepos = 0,
      falseneg = 0;

    g.selectAll('use')
      .transition()
      .duration(1500)
      .attr('class', function (d, i) {
        if ((d.y == 1) & (d.yhat == 1)) {
          truepos++;
          return 'true-positive';
        } else if ((d.y == 1) & (d.yhat === 0)) {
          falseneg++;
          return 'false-negative';
        } else if ((d.y === 0) & (d.yhat == 1)) {
          falsepos++;
          return 'false-positive';
        } else {
          trueneg++;
          return 'true-negative';
        }
      });

    icon_tip.html(function (d) {
      if ((d.y == 1) & (d.yhat == 1)) {
        return (
          'Sepsis: yes' +
          '<br>' +
          'Prediction: yes' +
          '<br>' +
          'Model predicted probability of having sepsis: ' +
          d.predY.toFixed(3)
        );
      } else if ((d.y == 1) & (d.yhat === 0)) {
        return (
          'Sepsis: yes' +
          '<br>' +
          'Prediction: no' +
          '<br>' +
          'Model predicted probability of having sepsis: ' +
          d.predY.toFixed(3)
        );
      } else if ((d.y === 0) & (d.yhat === 0)) {
        return (
          'Sepsis: no' +
          '<br>' +
          'Prediction: no' +
          '<br>' +
          'Model predicted probability of having sepsis: ' +
          d.predY.toFixed(3)
        );
      } else {
        return (
          'Sepsis: no' +
          '<br>' +
          'Prediction: yes' +
          '<br>' +
          'Model predicted probability of having sepsis: ' +
          d.predY.toFixed(3)
        );
      }
    });

    g.call(icon_tip);

    g.select('#txtValue-mlk').transition().duration(0).attr('opacity', 1);
    g.select('#txtValue-wakefield').transition().duration(0).attr('opacity', 1);
    g.selectAll('use')
      .transition()
      .duration(1500)
      .attr('x', function (d) {
        var remainder = d.index % numCols; //calculates the x position (column number) using modulus
        return xPadding + remainder * wBuffer; //apply the buffer and return value
      })
      .attr('y', function (d) {
        var whole = Math.floor(d.index / numCols); //calculates the y position (row number)
        return yPadding + whole * hBuffer; //apply the buffer and return the value
      });

    g.select('#truePositiveClf').transition().duration(0).attr('opacity', 0);
    g.select('#trueNegativeClf').transition().duration(0).attr('opacity', 0);
    g.select('#falseNegativeClf').transition().duration(0).attr('opacity', 0);
    g.select('#falsePositiveClf').transition().duration(0).attr('opacity', 0);

    // Update numbers elsewhere on the page.
    d3.selectAll('.truepos').text(truepos);
    d3.selectAll('.trueneg').text(trueneg);
    d3.selectAll('.falsepos').text(falsepos);
    d3.selectAll('.falseneg').text(falseneg);
    d3.selectAll('.totalpos').text(falsepos + truepos);
    d3.selectAll('.totalneg').text(falseneg + trueneg);

    // Have to select this with jquery - d3 doesn't select invisible things.
    $('.falsetextsr').text(
      falsepos + ' false positives, ' + falseneg + ' false negatives'
    );
  }

  function showClassification() {
    g.select('#txtValue').transition().duration(0).attr('opacity', 0);
    g.select('#truePositiveClf')
      .attr('class', 'true-positive')
      .attr('x', xPadding)
      .attr('y', yPadding)
      .attr('dy', -3)
      .text('True Positive: ' + dt_tp_length)
      .transition()
      .duration(0)
      .attr('opacity', 1);

    g.select('#trueNegativeClf')
      .attr('class', 'true-negative')
      .attr('x', xPadding)
      .attr('y', yPadding)
      .attr('dy', -3)
      .text('True Negative: ' + dt_tn_length)
      .transition()
      .duration(0)
      .attr('opacity', 1);

    g.select('#falsePositiveClf')
      .attr('class', 'false-positive')
      .attr('x', xPadding)
      .attr('y', yPadding)
      .attr('dy', -3)
      .text('False Positive: ' + dt_fp_length)
      .transition()
      .duration(0)
      .attr('opacity', 1);

    g.select('#falseNegativeClf')
      .attr('class', 'false-negative')
      .attr('x', xPadding)
      .attr('y', yPadding)
      .attr('dy', -3)
      .text('False Negative: ' + dt_fn_length)
      .transition()
      .duration(0)
      .attr('opacity', 1);

    g.selectAll('use')
      .transition()
      .duration(1500)
      .attr('x', function (d) {
        var remainder = d.groupIndx % clfNumCols; //calculates the x position (column number) using modulus
        if ((d.y == 1) & (d.yhat == 1)) {
          return xPadding + remainder * clfWBuffer; //apply the buffer and return value
        } else if ((d.y == 1) & (d.yhat === 0)) {
          return width / 2 + xPadding + remainder * clfWBuffer;
        } else if ((d.y === 0) & (d.yhat == 1)) {
          return xPadding + remainder * clfWBuffer;
        } else if ((d.y === 0) & (d.yhat === 0)) {
          return width / 2 + xPadding + remainder * clfWBuffer;
        }
      })
      .attr('y', function (d) {
        var whole = Math.floor(d.groupIndx / clfNumCols); //calculates the y position (row number)
        if ((d.y == 1) & (d.yhat == 1)) {
          return yPadding + whole * clfHBuffer; //apply the buffer and return the value
        } else if ((d.y == 1) & (d.yhat === 0)) {
          return yPadding + whole * clfHBuffer;
        } else if ((d.y === 0) & (d.yhat == 1)) {
          return height / 4 + yPadding + whole * clfHBuffer;
        } else if ((d.y === 0) & (d.yhat === 0)) {
          return height / 4 + yPadding + whole * clfHBuffer;
        }
      });
  }
  
  
   function showAxis(axis,className) {
    g.select(className)
      .call(axis)
      .transition().duration(500)
      .style('opacity', 1);
  }
  
  /**
   * hideAxis - helper function
   * to hide the axis
   *
   */
   
 
  
  function hideAxis(axis,nameClass) {
    g.select(nameClass)
      .call(axis)
      .transition().duration(0)
      .style('opacity', 0);
  }

  /**
   * @param index - index of the activate section
   * */
  chart.activate = function (index) {
    activeIndex = index;
    var sign = activeIndex - lastIndex < 0 ? -1 : 1;
    var scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(function (i) {
      console.log(i);
      activateFunctions[i]();
    });
    lastIndex = activeIndex;
  };

  /*
   *@param data - data for the plot of the chart
   */
  chart.updateData = function (data) {
    var numCols = 20;
    var numRows = Math.ceil(data.length / numCols);
    //generate a d3 range for the total number of required elements
    var myIndex = d3.range(numCols * numRows);

    //console.log(myIndex);
    data = data.map(function (d, idx) {
      d.index = myIndex[idx];
      return d;
    });
    var truePosGrpIndx = 0;
    var falseNegGrpIndx = 0;
    var falsePosGrpIndx = 0;
    var trueNegGrpIndx = 0;

    dt_tp_length = data.filter(function (d) {
      return (d.y == 1) & (d.yhat == 1);
    }).length;
    dt_tn_length = data.filter(function (d) {
      return (d.y === 0) & (d.yhat === 0);
    }).length;
    dt_fp_length = data.filter(function (d) {
      return (d.y === 0) & (d.yhat == 1);
    }).length;
    dt_fn_length = data.filter(function (d) {
      return (d.y == 1) & (d.yhat === 0);
    }).length;

    data = data.map(function (d, idx) {
      if ((d.y == 1) & (d.yhat == 1)) {
        d.groupIndx = truePosGrpIndx;
        truePosGrpIndx += 1;
      } else if ((d.y == 1) & (d.yhat === 0)) {
        d.groupIndx = falseNegGrpIndx;
        falseNegGrpIndx += 1;
      } else if ((d.y === 0) & (d.yhat == 1)) {
        d.groupIndx = falsePosGrpIndx;
        falsePosGrpIndx += 1;
      } else if ((d.y === 0) & (d.yhat === 0)) {
        d.groupIndx = trueNegGrpIndx;
        trueNegGrpIndx += 1;
      }
      return d;
    });

    var use = g.selectAll('use').data(data);

    use
      .enter()
      .append('use')
      .merge(use)
      .attr('xlink:href', '#iconCustom')
      .attr('id', function (d) {
        return 'icon' + d.index;
      })
      .attr('x', function (d) {
        var remainder = d.index % numCols; //calculates the x position (column number) using modulus
        return xPadding + remainder * wBuffer; //apply the buffer and return value
      })
      .attr('y', function (d) {
        var whole = Math.floor(d.index / numCols); //calculates the y position (row number)
        return yPadding + whole * hBuffer; //apply the buffer and return the value
      });

    use.exit().remove();
    activateFunctions[1]();
  };
  

  
  return chart;
   

  
};
