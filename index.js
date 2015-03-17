function ready(fn) {
  if (document.readyState != 'loading'){
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
}

var n,
    $ = document.querySelector.bind(document),
    width = 700,
    height = 300,
    r = 3,
    isPlaying = false,
    duration = 1000,
    frame = 30
    ;

var methods = [
  Webgl,
  PixelData,
  Svg,
  Canvas,
  Baseline
];

var colors = d3.scale.category10();

function getRandomColor(){
  return colors(Math.floor(Math.random() * 10));
}

function random(x) {
  return Math.random() * x;
}

function cubic(t) {
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  var t2 = t * t, t3 = t2 * t;
  return 4 * (t < .5 ? t3 : 3 * (t - t2) + t3 - .75);
}

ready(function(){
  methods.forEach(function(method, i) {
    i++;
    method.initialize($('#canvas' + i), width, height, r, colors.range());
    $('#play' + i).addEventListener('click', function(){
      if(isPlaying) return;
      isPlaying = true;
      method.play(function() {
        isPlaying = false;
      });
    });
  });
 
  $('form').addEventListener('submit', function(e){
    n = +$('#n').value;
    
    var data = d3.range(n).map(function() {
      return [random(width), random(height), getRandomColor()];
    });
    methods.forEach(function(method) {
      method.update(data);
    });

    e.preventDefault();
    return false;
  });

  n = +$('#n').value;
  var data = d3.range(n).map(function() {
    return [random(width), random(height), getRandomColor()];
  });
  methods.forEach(function(method) {
    method.update(data);
  });
});
