$(function () {
  // disable the accessible keyboard controls at first
  $('#keyboard_controls input').prop('disabled', true);

  $('#keyboard_controls').on('click', function () {
    $('#keyboard_controls input').prop('disabled', false);
  });

  d3.csv('data/rd_dataset1.csv', function (error, data) {
    if (error) {
      console.log(error);
    }

    // formating variables

    data = data
      .map(function (d, i) {
        d.x = Number(d.x);
        d.y = Number(d.y);
        d.yhat_1 = Number(d.yhat_1);
        d.yhat_2 = Number(d.yhat_2);
        d.yhat_3 = Number(d.yhat_3);
        d.yhat_4 = Number(d.yhat_4);
        return d;
      })
      .map(function (d) {
        d.yhat = d3.sum([d.yhat_1, d.yhat_2, d.yhat_3, d.yhat_4]);
        d.defined = 0;
        return d;
      })
      .filter(function (d, i) {
        return i < 120;
      }); // remove the data points after row 120 (included)

    console.log(data);

    const doneButton = document.getElementById('btn');

    var height = 500,
      width = 800;
    var margin = { left: 100, bottom: 80, top: 50, right: 100 };

    var drawHeight = height - margin.top - margin.bottom;
    var drawWidth = width - margin.left - margin.right;

    console.log(drawHeight, drawWidth);

    // define the svg for all visual elements
    var svg = d3
      .select('#my-draw')
      .append('svg')
      .attr('id', 'main-svg')
      //.attr('height',height)
      //.attr('width',width)
      .attr('preserveAspectRatio', 'xMinYMin meet')
      .attr('viewBox', [0, 0, width, height])
      .style('overflow', 'visible')
      //.on("click", mousedown)
      //.on('dblclick',mouseup)
      .classed('svg-content', true);

    // attach a g-element as the draw canvas

    var canvas = svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('id', 'can');

    // x-axis and y-axis

    var ymax =
      Math.max(
        d3.max(data, function (d) {
          return d.y;
        }),
        d3.max(data, function (d) {
          return d.yhat_1;
        }),
        d3.max(data, function (d) {
          return d.yhat_2;
        }),
        d3.max(data, function (d) {
          return d.yhat_3;
        }),
        d3.max(data, function (d) {
          return d.yhat_4;
        })
      ) + 10;

    console.log(ymax);
    var x = d3
      .scaleLinear()
      .range([0, drawWidth])
      .domain([
        0,
        d3.max(data, function (d) {
          return d.x;
        }),
      ]);

    var y = d3.scaleLinear().range([drawHeight, 0]).domain([0, ymax]);

    // drag and draw the line
    var filterData = data;
    var completed = false;

    var drag = d3.drag().on('drag', function () {
      d3.selectAll('#start-reminder').attr('opacity', 0);
      d3.selectAll('.start-point').attr('opacity', 0);

      var pos = d3.mouse(this);
      pos[0] -= margin.left;
      pos[1] -= margin.top;
      var enroll = clamp(0, 120, x.invert(pos[0]));
      var classSize = clamp(0, y.domain()[1], y.invert(pos[1]));

      filterData.forEach(function (d) {
        if (Math.abs(d.x - enroll) < 1) {
          d.defined = 1;
          d.ydraw = classSize; // create a new cloumn to store the mouse-drag generated/updated yhat
        }
        return;
      });

      // draw the line

      var path = canvas.selectAll('path').data([filterData]);

      path
        .enter()
        .append('path')
        .merge(path)
        .transition()
        .duration(0)
        .attr('class', 'draw-line')
        .attr('fill', 'none')
        .attr('stroke', '#737373')
        .attr('stroke-dasharray', '4')
        .attr('stroke-width', 4)
        .attr('opacity', 0.9)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(d.x);
            })
            .y(function (d) {
              return y(d.ydraw);
            })
            .defined(function (d) {
              return d.defined == 1;
            })
        );

      path.exit().remove();

      if (
        !completed &&
        1 ==
          d3.mean(
            filterData.map(function (d) {
              return d.defined;
            })
          )
      ) {
        completed = true;
        console.log('huan');
        console.log(completed);
        doneButton.disabled = false;
      }
    });

    svg.call(drag);

    function clamp(a, b, c) {
      return Math.max(a, Math.min(b, c));
    }

    $('input').on('input', function () {
      // Coordinate transforms
      function getX(x) {
        return (drawWidth * x) / 125 + 100;
      }
      function getY(y) {
        return drawHeight * (1 - y / 40) + 50;
      }

      // Clear old items
      d3.selectAll('.keyboard').remove();

      let allX = [1, 30, 31, 60, 61, 90, 91, 120];
      let allY = $('#keyboard_controls input')
        .map((i, e) => Number(e.value))
        .toArray()
        .map(function (d) {
          d.defined = 0;
          return d;
        });

      console.log(allY);

      circle = svg
        .append('circle')
        .attr('class', 'user-point keyboard')
        .attr('cx', x(1) + margin.left)
        .attr('cy', y(1) + margin.top)
        .attr('r', 5)
        .attr('stroke', '#737373')
        .attr('fill', '#737373');

      for (let j = 1; j < allX.length; j++) {
        allY.filter(function (d) {
          return d.defined !== 0;
        });

        // As soon as we type in a value, let us claim to be done.
        doneButton.disabled = false;

        prevX = allX[j - 1];
        prevY = allY[j - 1];
        currX = allX[j];
        currY = allY[j];

        if (currY !== 0) {
          circle = svg
            .append('circle')
            .attr('class', 'user-point keyboard')
            .attr('cx', getX(currX))
            .attr('cy', getY(currY))
            .attr('r', 5)
            .attr('stroke', '#737373')
            .attr('fill', '#737373');
        }

        if (prevY !== 0 && currY !== 0) {
          line = svg
            .append('line')
            .attr('class', 'user-line keyboard')
            .attr('x1', getX(prevX))
            .attr('y1', getY(prevY))
            .attr('x2', getX(currX))
            .attr('y2', getY(currY))
            .attr('stroke-dasharray', '4')
            .style('stroke', '#737373')
            .style('stroke-width', 2);
        }
      }
    });

    svg
      .append('g')
      .attr(
        'transform',
        'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')'
      )
      .attr('class', 'x-axis')
      .call(d3.axisBottom(x));

    svg
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
      .attr('class', 'y-axis')
      .call(d3.axisLeft(y));

    // axis title

    canvas
      .append('text')
      .attr('class', 'y-title')
      .attr('text-anchor', 'middle')
      .attr('x', -(drawHeight / 2))
      .attr('y', -40)
      .attr('transform', 'rotate(-90)')
      .text('Class Size');

    canvas
      .append('text')
      .attr('class', 'x-title')
      .attr('text-anchor', 'middle')
      .attr('x', drawWidth / 2)
      .attr('y', drawHeight + 50)
      //.attr("transform", "rotate(-90)")
      .text('School Enrollment');

    // adding vertical lines

    canvas
      .append('line')
      .attr('class', 'vline-1')
      .attr('x1', x(30))
      .attr('y1', y(0))
      .attr('x2', x(30))
      .attr('y2', y(ymax))
      .attr('stroke-dasharray', 4)
      .style('stroke', '#00a454');

    canvas
      .append('line')
      .attr('class', 'vline-2')
      .attr('x1', x(60))
      .attr('y1', y(0))
      .attr('x2', x(60))
      .attr('y2', y(ymax))
      .attr('stroke-dasharray', 4)
      .style('stroke', '#00a454');

    canvas
      .append('line')
      .attr('class', 'vline-3')
      .attr('x1', x(90))
      .attr('y1', y(0))
      .attr('x2', x(90))
      .attr('y2', y(ymax))
      .attr('stroke-dasharray', 4)
      .style('stroke', '#00a454');

    canvas
      .append('line')
      .attr('class', 'vline-4')
      .attr('x1', x(120))
      .attr('y1', y(0))
      .attr('x2', x(120))
      .attr('y2', y(ymax))
      .attr('stroke-dasharray', 4)
      .style('stroke', '#00a454');

    canvas
      .append('circle')
      .attr('class', 'start-point')
      .attr('cx', x(1))
      .attr('cy', y(1))
      .attr('r', 5)
      .attr('stroke', 'orange')
      .attr('fill', 'orange')
      .attr('opacity', 0.7);

    canvas
      .append('text')
      .attr('id', 'start-reminder')
      .attr('x', x(1))
      .attr('y', y(1.5))
      .text('Start here!')
      .attr('opacity', 0.7);

    // I am done button
    $('#btn').click(function () {
      doneButton.disabled = true;

      var filterData = data.filter(function (d) {
        return d.x != 0 && d.y != 0;
      });

      console.log(filterData);

      var scatter = canvas.selectAll('circle').data(filterData);

      scatter
        .enter()
        .merge(scatter)
        .append('circle')
        .transition()
        .duration(0)
        .attr('class', 'my-dots')
        .attr('cx', function (d) {
          return x(d.x);
        })
        .attr('cy', function (d) {
          return y(d.y);
        })
        .attr('r', 5)
        .attr('opacity', 0.7)
        .style('fill', '#00A454')
        .style('stroke', '#00a454');

      scatter.exit().remove();

      // d3.selectAll('.user-point').style('opacity',0.3);
      d3.selectAll('.draw-line').style('opacity', 0.3);

      canvas
        .append('path')
        .datum(
          data.filter(function (d) {
            return d.yhat_1 > 0;
          })
        )
        .attr('class', 'model-line')
        .attr('fill', 'none')
        .attr('stroke', '#00a454')
        .attr('stroke-width', 3)
        .attr('opacity', 0.7)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(d.x);
            })
            .y(function (d) {
              return y(d.yhat_1);
            })
        );

      canvas
        .append('path')
        .datum(
          data.filter(function (d) {
            return d.yhat_2 > 0;
          })
        )
        .attr('class', 'model-line')
        .attr('fill', 'none')
        .attr('stroke', '#00a454')
        .attr('stroke-width', 3)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(d.x);
            })
            .y(function (d) {
              return y(d.yhat_2);
            })
        );

      canvas
        .append('path')
        .datum(
          data.filter(function (d) {
            return d.yhat_3 > 0;
          })
        )
        .attr('class', 'model-line')
        .attr('fill', 'none')
        .attr('stroke', '#00a454')
        .attr('stroke-width', 3)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(d.x);
            })
            .y(function (d) {
              return y(d.yhat_3);
            })
        );

      canvas
        .append('path')
        .datum(
          data.filter(function (d) {
            return d.yhat_4 > 0;
          })
        )
        .attr('class', 'model-line')
        .attr('fill', 'none')
        .attr('stroke', '#00a454')
        .attr('stroke-width', 3)
        .attr(
          'd',
          d3
            .line()
            .x(function (d) {
              return x(d.x);
            })
            .y(function (d) {
              return y(d.yhat_4);
            })
        );
    });

    // Start Over button
    $('#nul').click(function () {
      filterData.map(function (d) {
        return (d.defined = 0);
      });
      d3.selectAll('#start-reminder').attr('opacity', 0.7);
      d3.selectAll('.start-point').attr('opacity', 0.7);

      var dots = d3.selectAll('.my-dots');
      var userDots = d3.selectAll('.user-point');
      var userLines = d3.selectAll('.user-line');
      var modelLines = d3.selectAll('.model-line');
      var drawLines = d3.selectAll('.draw-line');

      //polylines.remove();
      dots.remove();
      userDots.remove();
      userLines.remove();
      modelLines.remove();
      drawLines.remove();

      doneButton.disabled = true;

      completed = false;
    });
  }); // end of d3.csv
});
