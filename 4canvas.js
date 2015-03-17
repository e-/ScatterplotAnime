var Canvas = (function(){
  var width, 
      height, 
      r,
      data = [],
      canvas
    ;

  return {
    initialize: function(_canvas, _width, _height, _r, _colors) {
      canvas = new createjs.Stage(_canvas);
      _canvas.width = width = _width;
      _canvas.height = height = _height;
      r = _r;
    },
    update: function(newData){ 
      canvas.removeAllChildren();
      data = [];
      newData.forEach(function(d){
        var circle = new createjs.Shape();
        
        circle.graphics.beginFill(d[2]).drawCircle(0, 0, r);
        circle.x = d[0];
        circle.y = d[1];

        canvas.addChild(circle);
        data.push([d[0], d[1], circle]);
      });
      
      canvas.update();
    },
    play: function(finished) {
      data.forEach(function(d){
        var destX = random(width),
            destY = random(height);

        d[3] = destX;
        d[4] = destY;
      });

      var start = null;

      function tick(timestamp) {
        if(!start) start = timestamp;
        var progress = (timestamp - start) / duration;
        if(progress > 1) {
          data.forEach(function(d){
            d[2].x = d[0] = d[3];
            d[2].y = d[1] = d[4];
          });

          canvas.update();
          finished();
          return;
        }

        var c = cubic(progress);

        data.forEach(function(d){
          d[2].x = (d[3] - d[0]) * c + d[0];
          d[2].y = (d[4] - d[1]) * c + d[1];
        });

        canvas.update();

        window.requestAnimFrame(tick);
      }

      window.requestAnimFrame(tick);
    }
  }
})();
