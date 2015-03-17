var Svg = (function(){
  var width, 
      height, 
      r,
      data = [],
      svg,
      circles
    ;

  function translate(x, y){
    return 'translate(' + x + ',' + y + ')';
  }

  return {
    initialize: function(_canvas, _width, _height, _r, _colors) {
      svg = d3.select(_canvas);
      width = _width;
      height = _height;
      r = _r;

      svg.attr('width', width).attr('height', height);
    },
    update: function(newData){ 
      data = [];
      newData.forEach(function(d){
        data.push([d[0], d[1], d[2]]);
      });

      circles = svg
          .selectAll('circle')
          .data(data);

      circles
        .enter()
          .append('circle')
          .attr('fill', function(d){
            return d[2];
          })
          .attr('r', r)

      circles
        .attr('transform', function(circle){
          return translate(circle[0], circle[1]);
        });


      circles
        .exit()
          .remove();
    },
    play: function(finished) {
      data.forEach(function(d){
        var destX = random(width),
            destY = random(height);

        d[0] = destX;
        d[1] = destY;
      });

      svg
        .selectAll('circle')
        .data(data)
        .transition()
        .duration(duration)
        .attr('transform', function(d){
          return translate(d[0], d[1]);
        })
        .each('end', function(){
          finished();
        });
    }
  }
})();
