var PixelData = (function(){
  var width, 
      height, 
      r,
      data = [],
      canvas,
      context
    ;
    
  function createScene(imageData, data) {
    var limit = imageData.width * imageData.height * 4;
    function index(x, y) {
      var idx = (x + y * imageData.width) * 4;
      if(idx < 0 || idx >= limit) return -1;
      return idx;
    }

    var i, j;

    data.forEach(function(d){
      var x = Math.round(d[0]),
          y = Math.round(d[1]);
      
      for(i =-2;i<=2;++i) {
        for(j=-2;j<=2;++j) {
          var idx = index(x + i, y + j);
          if(idx >= 0){
            imageData.data[idx + 0] = d[2];
            imageData.data[idx + 1] = d[3];
            imageData.data[idx + 2] = d[4];
            imageData.data[idx + 3] = 255;
          }
        }
      }
    });
  }


  return {
    initialize: function(_canvas, _width, _height, _r, _colors) {
      canvas = _canvas;
      context = canvas.getContext('2d');
      _canvas.width = width = _width;
      _canvas.height = height = _height;
      r = _r;
    },
    update: function(newData){ 
      var imageData = context.createImageData(width, height);
      
      data = [];
      newData.forEach(function(d){
        var rgb = d3.rgb(d[2]);
        data.push([d[0], d[1], rgb.r, rgb.g, rgb.b]);
      });
 
      createScene(imageData, data);

      context.putImageData(imageData, 0, 0);
    },
    play: function(finished) {
      data.forEach(function(d){
        var destX = random(width),
            destY = random(height);

        d[5] = destX;
        d[6] = destY;
        d[7] = d[0];
        d[8] = d[1];
      });

      var start = null;

      function tick(timestamp) {
        if(!start) start = timestamp;
        var progress = (timestamp - start) / duration;
        if(progress > 1) {
          data.forEach(function(d){
            d[0] = d[5];
            d[1] = d[6];
          });

          var imageData = context.createImageData(width, height);
          createScene(imageData, data);
          context.putImageData(imageData, 0, 0);
          
          finished();
          return;
        }

        var c = cubic(progress);

        data.forEach(function(d){
          d[0] = (d[5] - d[7]) * c + d[7];
          d[1] = (d[6] - d[8]) * c + d[8];
        });

        var imageData = context.createImageData(width, height);
        createScene(imageData, data);
        context.putImageData(imageData, 0, 0);
        
        window.requestAnimFrame(tick);
      }

      window.requestAnimFrame(tick);
    }
  }
})();
