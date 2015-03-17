var Webgl = (function(){
  var width, 
      height, 
      r,
      stage = new PIXI.Stage(0xFFFFFF),
      renderer,
      data = [],
      sbs = {},
      bsbs = {},
      colors,
      textures
      ;

  function hex2num(hex) {
    return parseInt(hex.substr(1), 16);
  }

  return {
    initialize: function(canvas, _width, _height, _r, _colors) {
      canvas.width = width = _width;
      canvas.height = height = _height;
      r = _r;
      colors = _colors;

      renderer = PIXI.autoDetectRenderer(width, height, {
        view: canvas,
        antialias: true
      });

      textures = (function() {
        var t = {};
        colors.forEach(function(color) {
          var g = new PIXI.Graphics();
          g.beginFill(hex2num(color));
          g.drawCircle(r, r, r);
          g.endFill();
          t[color] = g.generateTexture();
        });
        return t;
      })();
    },
    update: function(newData){ 
      data = [];
      stage.removeChildren();
      sbs = {};

      colors.forEach(function(color) {
        var sb = new PIXI.SpriteBatch();
        sbs[color] = sb;
        stage.addChild(sb);

        var bsb = new PIXI.SpriteBatch();
        bsbs[color] = bsb;
      });

      colors.reverse().forEach(function(color) {
        stage.addChild(bsbs[color]);
      });
      
      newData.forEach(function(d){
        var sp = new PIXI.Sprite(textures[d[2]]);
        data.push([d[0], d[1], sp]);
        
        ((Math.random() > .2) ? sbs : bsbs)[d[2]].addChild(sp);
      });

      Webgl.draw();
    },
    draw: function(){
      data.forEach(function(d){
        d[2].x = d[0] - r;
        d[2].y = d[1] - r;
      });

      renderer.render(stage);
    },
    play: function(finished) {
      data.forEach(function(d){ 
        var destX = random(width),
            destY = random(height);
        
        d[3] = destX;
        d[4] = destY;
        d[5] = d[0];
        d[6] = d[1];
      });
  
      var start = null;

      function tick(timestamp) {
        if(!start) start = timestamp;
        var progress = (timestamp - start) / duration;
        if(progress > 1) {
          data.forEach(function(d){
            d[0] = d[3];
            d[1] = d[4];
          });
          
          Webgl.draw();
          finished();
          return;
        }
      
        var c = cubic(progress);
        
        data.forEach(function(d){
          d[0] = (d[3] - d[5]) * c + d[5];
          d[1] = (d[4] - d[6]) * c + d[6];
        });

        Webgl.draw();
        
        window.requestAnimFrame(tick);
      }

      window.requestAnimFrame(tick);
    }
  }
})();
