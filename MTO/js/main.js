$(function () {
  
    d3.csv("mto-data.csv",function(error,rawData){
    console.log(rawData);
    
    console.log(count);
    
    
      var data=rawData.map(function(d,i){
                  d.treated = Math.round(Math.random());
                  d.y_experiment = d.treated == 1 ? d.y1 : d.y0;
                  d.wakefield=Number(d.wakefield);
                  d.black=Number(d.black);
                  return d;
          });
          
          console.log(data);
          
      var raceData=d3.nest()
        .key(function(d){return d.wakefield})
        .rollup(function(v){
          return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
        })
        .entries(data);
        
       raceData=raceData.map(function(d,i){
         d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
       }); 
       
     
     
     var incomeData=d3.nest()
      .key(function(d){return d.wakefield})
      .rollup(function(v){
        return d3.mean(v,function(d){return d.y_obs;}).toFixed(1);
      })
      .entries(data);
      
      incomeData=incomeData.map(function(d,i){
        d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
        return d;
      });
      
      console.log(incomeData);  
       
          
      var plot = pictogramScroll();   
      
      display(data);
      
      Math.seedrandom('randomizeLocation');
    
      
      
      $('#randomize').click(function(){
      
          console.log('randomize');
        
          //data=rawData.map(function(d,i){
                     // d.treated = Math.round(Math.random());
                    //  d.y_experiment = d.treated == 1 ? d.y1 : d.y0;
                     // d.wakefield=Number(d.wakefield);
                     // d.black=Number(d.black);
                     // return d;
            //  });
            
        
          temp=rawData.map(function(d,i){
            if (i<250){
              d.treated=0;
            }else{
              d.treated=1;
            }
            
            return d;
        });  
        
          console.log("temp:");
          console.log(temp);
     
     
     
         shuffle(temp,"treated");
              
         data=temp.map(function(d,i){
           d.y_experiment = d.treated == 1 ? d.y1 : d.y0;
           d.wakefield=Number(d.wakefield);
           d.black=Number(d.black);
           return d;
         });
          
          
        // update treatment income data
        
         var incomeDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return d3.mean(v,function(d){return d.y_experiment;}).toFixed(1);
            })
            .entries(data);
            
             incomeDataTreat=incomeDataTreat.map(function(d,i){
              d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
              return d;
            }).sort(function(a,b){
              return a.key-b.key;
            });
            
            console.log("incomeDataTreat");
            console.log(incomeDataTreat);
            
      
            
         var raceDataTreat=d3.nest()
            .key(function(d){return d.treated})
            .rollup(function(v){
              return (d3.mean(v,function(d){return d.black})*100).toFixed(1);
            })
            .entries(data);
            
           raceDataTreat=raceDataTreat.map(function(d,i){
            d.group=d.key=="0"? "Public Housing Units":"Mixed Income Neighborhood";
            return d;
           }).sort(function(a,b){
             return a.key-b.key;
           }); 
            
          console.log(raceDataTreat);
          
          
         d3.selectAll("#race-ratio-public").text("People of Color in Public Housing Units: "+raceDataTreat[0].value+"%");
         d3.selectAll("#race-ratio-mixed").text("People of Color in Mixed Income Neighborhood: "+raceDataTreat[1].value+"%");
        
          
         plot.updateData(data,incomeDataTreat,raceDataTreat);
      
    });
    

  
  // untility function to generate 250 1s and 250 0s and randomly assign them to the data rows
    
  function shuffle(data, attr) { //inplace shuffle
    n = data.length;
    for(var i = 0; i < n; ++i) {
      r = getRandomIntInclusive(0, n - 1 - i);
      swap(data, i, i + r, attr);
    }
  }
  
  function swap(data, i, j, attr) {
    var temp = data[i][attr];
    data[i][attr] = data[j][attr];
    data[j][attr] = temp;
    return;
  }
  
  function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
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
            plot.activate(index, data);
          });
          
        }
    
    }); // end of d3.csv data loading
    
});
