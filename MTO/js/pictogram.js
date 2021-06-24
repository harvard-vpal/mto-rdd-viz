// Draw pictogram function-----------------------------

var pictogramScroll = function () {
  // size variable
  var height = 500,
    width = 450;
  //Magrin: spaces saved in the svg for axes and titles
  var margin = {
    left: 0,
    bottom: 0,
    top: 0,
    right: 10,
  };

  var lastIndex = -1;
  var activeIndex = 0;

  var activateFunctions = [];

  var g = null;

  //padding for the grid
  var xPadding = 20;
  var yPadding = 20;

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
          'Community: Wakfield'+
          '<br>'+
          'Race: People of color');
      }else if((d.wakefield==1)&(d.black===0)){
        return(
          'Community: Wakfield'+
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
  
  
  var chart = function (selection) {
    // Height/width of the drawing area for data symbols
    var innerHeight = height - margin.bottom - margin.top;
    var innerWidth = width - margin.left - margin.right;

   // var clfboxheight = height / 2 - margin.bottom - margin.top;
  //  var clfboxwidth = width / 2 - margin.bottom - margin.top;
   
      var localBoxHeight=height - margin.bottom - margin.top;
      var localBoxWidth= width / 2 - margin.bottom - margin.top;

    // Loop through selections and data bound to each element
    selection.each(function (data) {
      var div = d3.select(this); // Container

      // Selection of SVG elements in DIV (making sure not to re-append svg)
      var svg = div.selectAll('svg').data([data]);

      // Append a 'g' element in which to place the rects, shifted down and right from the top left corner
      var gEnter = svg
        .enter()
        .append('svg')
        // .merge(svg)
        //.attr('height', height)
        // .attr('width', width)
        .attr('preserveAspectRatio', 'xMinYMin meet')
        .attr('viewBox', [0, 0, width - 50, height - 50]);

      svg.exit().remove();

      // Append a G to hold rects
      gEnter
        .append('g')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .attr('height', innerHeight)
        .attr('width', innerWidth)
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

      //text element to display number of icons highlighted
      g.append('text')
        .attr('id', 'txtValue')
        .attr('class', 'treated-txtValue')
        .attr('x', xPadding)
        .attr('y', yPadding)
        .attr('dy', -3)
        .text(data.length);

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
        .attr('class', function (d) {
        if (d.black == 1) {
          return 'people-of-color';
        } else {
          return 'other';
        }
        })
        .attr('fill',function(d){
          if(d.black==1){return '#4191cf'}else{
            return '#b13';
          }
        })
        .on('mouseover', icon_tip.show)
        .on('mouseout', icon_tip.hide);
    });

    setupSections();
  }; // end of chart function to return
  
  
  var setupSections = function () {
    activateFunctions[0] = showInitial;
    activateFunctions[1] = showPrediction;
    activateFunctions[2] = showClassification;
  };
  
  
  function showInitial() {
    //change the class of person
    g.selectAll('use')
      .transition()
      .duration(1500);

    icon_tip.html(function (d) {
      if (d.wakefield == 1) {
        return 'Community: Wakefield';
      } else {
        return 'Community: Martin Luther King Jr. Towers';
      }
    });

    g.call(icon_tip);
  }
  
  return chart;
   

  
};
