function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var n,
    $ = document.querySelector.bind(document),
    width = 800,
    height = 300,
    r = 3,
    svg = d3.select('#svg'),
    canvas1 = new createjs.Stage('canvas1'),
    canvas2 = new createjs.Stage('canvas2'),
    canvas3 = $('#canvas3'),
    context = canvas3.getContext('2d'),
    colors = d3.scale.category10(),
    canvas1Data,
    canvas2Data,
    canvas3Data,
    canvas4Data,
    isPlaying = false,
    graphics = new PIXI.Graphics(),
    stage = new PIXI.Stage(0xFFFFFF),
    renderer = PIXI.autoDetectRenderer(width, height, {
      view: $('#canvas4'),
      antialias: true
    }),
    texture,
    spriteBatch
  ;
  
  
function getRandomColor(){
  return colors(Math.floor(Math.random() * 10));
}

function random(x) {
  return Math.random() * x;
}

function translate(x, y){
  return 'translate(' + x + ',' + y + ')';
}

function update(){
  var data = d3.range(n).map(function(){
    return [random(width), random(height)];
  });

  var circles = svg
    .selectAll('circle')
    .data(data);

  circles
    .enter()
      .append('circle')
      .attr('fill', function(){
        return getRandomColor();
      })
      .attr('r', r)

  circles
    .attr('transform', function(circle){
      return translate(circle[0], circle[1]);
    });


  circles
    .exit()
      .remove();

  canvas1.removeAllChildren();
  canvas1Data = [];

  for(var i = 0; i < n; ++i) {
    var circle = new createjs.Shape();
    var d = {
      x: random(width),
      y: random(height)
    };

    circle.graphics.beginFill(getRandomColor()).drawCircle(0, 0, r);
    circle.x = d.x;
    circle.y = d.y;

    canvas1.addChild(circle);
    d.circle = circle;
    canvas1Data.push(d);
  }

  canvas1.update();

  canvas2.removeAllChildren();
  canvas2Data = [];

  for(var i = 0; i < n; ++i) {
    var circle = new createjs.Shape();
    var d = {
      x: random(width),
      y: random(height)
    };

    circle.graphics.beginFill(getRandomColor()).drawCircle(0, 0, r);
    circle.x = d.x;
    circle.y = d.y;

    canvas2.addChild(circle);
    d.circle = circle;
    canvas2Data.push(d);
  }

  canvas2.update();

  canvas3Data = [];

  for(var i = 0; i < n; ++i) {
    var c = d3.rgb(getRandomColor());
    var d = [
      random(width),
      random(height),
      c.r,
      c.g,
      c.b      
    ];
    canvas3Data.push(d);
  }
  
  var imageData = context.createImageData(width, height);
  createScene(imageData, canvas3Data);
  context.putImageData(imageData, 0, 0);

  canvas4Data = [];
  
  stage.removeChildren();

  spriteBatches = {};
  
  colors.range().forEach(function(color) {
    var sp = new PIXI.SpriteBatch();
    spriteBatches[color] = sp;
    stage.addChild(sp);
  });
  
  textures = (function(){
/*    var g = new PIXI.Graphics();
    g.beginFill(0x888888);//FFFFFFF);
    g.drawCircle(r, r, r);
    g.endFill();

    return g.generateTexture();*/

    var t = {};
    colors.range().forEach(function(code) {
      var g = new PIXI.Graphics();
      g.beginFill(hexToWebgl(code));
      g.drawCircle(r, r, r);
      g.endFill();
      t[code] = g.generateTexture();
    });
    return t; 
  })();

  for(var i = 0 ; i < n ; ++i) {
    var color = getRandomColor();
    var sp = new PIXI.Sprite(textures[color]); //textures); //[getRandomColor()]);
    canvas4Data.push([random(width), random(height), 1, sp]);
    spriteBatches[color].addChild(sp);
//    stage.addChild(sp);
//    sp.tint = hexToWebgl(getRandomColor()); 
  }
  
  updateCanvas4();
}

function hexToWebgl(hex) {
  return parseInt(hex.substr(1), 16);
}

function updateCanvas4()
{
  canvas4Data.forEach(function(d){
    d[3].x = d[0] - r;
    d[3].y = d[1] - r;
  });

  renderer.render(stage);
}

function playCanvas4(){
  canvas4Data.forEach(function(d){
    var destX = random(width),
        destY = random(height);

    d[4] = destX;
    d[5] = destY;
    d[6] = d[0];
    d[7] = d[1];
  });

  var count = 0, start = null;

  function step(timestamp) {
    if(!start) start = timestamp;
    var progress = (timestamp - start) / duration;
    if(progress > 1) {
      canvas4Data.forEach(function(d){
        d[0] = d[4];
        d[1] = d[5];
      });
      
      updateCanvas4();
      isPlaying = false;
      return;
    }

    var c = cubic(progress);
    
    canvas4Data.forEach(function(d){
      d[0] = (d[4] - d[6]) * c + d[6];
      d[1] = (d[5] - d[7]) * c + d[7];
    });

    updateCanvas4();
    
    window.requestAnimFrame(step);
  }

  window.requestAnimFrame(step);
}


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

function playSVG(){
  var data = d3.range(n).map(function(){
    return [random(width), random(height)];
  });

  svg
    .selectAll('circle')
    .data(data)
    .transition()
    .duration(1000)
    .attr('transform', function(circle){
      return translate(circle[0], circle[1]);
    })
    .each('end', function(){
      isPlaying = false;
    });
}

var duration = 1000,
    frame = 30;

function cubic(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  var t2 = t * t, t3 = t2 * t;
  return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
}

function playCanvas1(){
  canvas1Data.forEach(function(d){
    var destX = random(width),
        destY = random(height);

    d.destX = destX;
    d.destY = destY;
  });

  var count = 0;

  var timer = setInterval(function(){
    count ++;
    if(count > frame) {
      clearInterval(timer); 
      canvas1Data.forEach(function(d){
        d.x = d.destX;
        d.y = d.destY;
      });
      isPlaying = false;
      return;
    }
    
    var f = count / frame, 
        c = cubic(f);

    canvas1Data.forEach(function(d){
      d.circle.x = (d.destX - d.x) * c + d.x;
      d.circle.y = (d.destY - d.y) * c + d.y;
    });

    canvas1.update();
  }, duration / frame);
}

function playCanvas2(){
  canvas2Data.forEach(function(d){
    var destX = random(width),
        destY = random(height);

    d.destX = destX;
    d.destY = destY;
  });

  var count = 0, start = null;

  function step(timestamp) {
    if(!start) start = timestamp;
    var progress = (timestamp - start) / duration;
    if(progress > 1) {
      canvas2Data.forEach(function(d){
        d.circle.x = d.x = d.destX;
        d.circle.y = d.y = d.destY;
      });

      canvas2.update();
      isPlaying = false;
      return;
    }

    var c = cubic(progress);

    canvas2Data.forEach(function(d){
      d.circle.x = (d.destX - d.x) * c + d.x;
      d.circle.y = (d.destY - d.y) * c + d.y;
    });

    canvas2.update();

    window.requestAnimFrame(step);
  }

  window.requestAnimFrame(step);
}

function playCanvas3(){
  canvas3Data.forEach(function(d){
    var destX = random(width),
        destY = random(height);

    d[5] = destX;
    d[6] = destY;
    d[7] = d[0];
    d[8] = d[1];
  });

  var count = 0, start = null;

  function step(timestamp) {
    if(!start) start = timestamp;
    var progress = (timestamp - start) / duration;
    if(progress > 1) {
      canvas3Data.forEach(function(d){
        d[0] = d[5];
        d[1] = d[6];
      });

      var imageData = context.createImageData(width, height);
      createScene(imageData, canvas3Data);
      context.putImageData(imageData, 0, 0);
      isPlaying = false;
      return;
    }

    var c = cubic(progress);
    
    canvas3Data.forEach(function(d){
      d[0] = (d[5] - d[7]) * c + d[7];
      d[1] = (d[6] - d[8]) * c + d[8];
    });

    var imageData = context.createImageData(width, height);
    createScene(imageData, canvas3Data);
    context.putImageData(imageData, 0, 0);
    
    window.requestAnimFrame(step);
  }

  window.requestAnimFrame(step);
}


ready(function(){
  svg.attr('width', width).attr('height', height);
  $('#canvas1').width = width;
  $('#canvas1').height = height;
  $('#canvas2').width = width;
  $('#canvas2').height = height;
  $('#canvas3').width = width;
  $('#canvas3').height = height;
 
  $('#update').addEventListener('click', function(){
    n = +$('#n').value;
    update();
  });
 
  $('#play-svg').addEventListener('click', function(){
    if(isPlaying)return;
    isPlaying = true;
    playSVG();
  });

  $('#play-canvas1').addEventListener('click', function(){
    if(isPlaying)return;
    isPlaying = true;
    playCanvas1();
  });

  $('#play-canvas2').addEventListener('click', function(){
    if(isPlaying)return;
    isPlaying = true;
    playCanvas2();
  });

  $('#play-canvas3').addEventListener('click', function(){
    if(isPlaying)return;
    isPlaying = true;
    playCanvas3();
  });

  $('#play-canvas4').addEventListener('click', function(){
    if(isPlaying)return;
    isPlaying = true;
    playCanvas4();
  });

  n = +$('#n').value;
  update();
});
