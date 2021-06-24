$(function () {
  
  // utitlity functions----------------------------------------------
  
  
    d3.csv("mto-data.csv",function(error,rawData){
    console.log(rawData);
    
      var data=rawData.map(function(d,i){
                  d.treated = Math.round(Math.random());
                  d.y_experiment = d.treated == 1 ? d.y1 : d.y0;
                  return d;
          });
          
          console.log(data);
          
      var plot = pictogramScroll();   
          
      // size variable    
      var height= 500, width=450;
      
      var margin={
        left:0,
        bottom:0,
        top:0,
        right:10
      };
          
    
      var g = null;
      
      //horizontal and vertical spacing between the icons
      var hBuffer = 15;
      var wBuffer = 18;
      
      
      //specify the number of columns and rows for pictogram layout
      var numCols = 20;
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
    
    display(data);
    
    
      function display(data) {
          d3.select('#vis').datum(data).call(plot);
      
          // setup scroll functionality
          var scroll = scroller().container(d3.select('#graphic'));
      
          // pass in .step selection as the steps
          scroll(d3.selectAll('.step'));
      
          // setup event handling
          scroll.on('active', function (index) {
            // highlight current step text
            d3.selectAll('.step').style('opacity', function (d, i) {
              return i === index ? 1 : 0.1;
            });
      
            // activate current section
            plot.activate(index);
          });
        }
    
    });
    
    
    

  
    
    
});
