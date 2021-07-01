$(function () {
  
  // utitlity functions----------------------------------------------
  
  
    d3.csv("mto-data.csv",function(error,rawData){
    console.log(rawData);
    
      var data=rawData.map(function(d,i){
                  d.treated = Math.round(Math.random());
                  d.y_experiment = d.treated == 1 ? d.y1 : d.y0;
                  d.wakefield=Number(d.wakefield);
                  d.black=Number(d.black);
                  return d;
          });
          
          console.log(data);
          
      var plot = pictogramScroll();   
          

    display(data);
    
   function showStep1() {
    // show step 1---------------------------------------
    d3.select('.canvas-1').transition().duration(0).style('opacity', 1);

    d3.select('.init-rect').transition().duration(0).style('opacity', 1);

    d3.selectAll('.init-patient-tip')
      .transition()
      .duration(0)
      .style('opacity', 1);

    d3.select('.init-txtValue').transition().duration(0).style('opacity', 1);

    d3.selectAll('.iconSelected Wakefield')
      .transition()
      .duration(0)
      .style('opacity', 1);

    d3.selectAll('.iconSelected Martin')
      .transition()
      .duration(0)
      .style('opacity', 1);

    // hide step 2 ---------------------
    d3.select('.canvas-2').transition().duration(0).style('opacity', 0);

    d3.selectAll('.iconSepsis-Predicted')
      .transition()
      .duration(0)
      .style('opacity', 0);

    d3.selectAll('.iconSepsis-NonPredicted')
      .transition()
      .duration(0)
      .style('opacity', 0);

    d3.selectAll('.iconNonSepsis-NonPredicted')
      .transition()
      .duration(0)
      .style('opacity', 0);

    d3.selectAll('.iconNonSepsis-Predicted')
      .transition()
      .duration(0)
      .style('opacity', 0);

    d3.select('.predicted-patient-tip')
      .transition()
      .duration(0)
      .style('opacity', 0);

    d3.select('.predicted-txtValue')
      .transition()
      .duration(0)
      .style('opacity', 0);
  }  
    
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
        
        
    
    }); // end of d3.csv data loading
    
    
    

  
    
    
});
