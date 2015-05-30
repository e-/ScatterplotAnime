# ScatterplotAnime

> This repository demonstrates the performance of 5 scatterplot animation methods on web browsers.

## Usage

Just visit [this link](http://e-.github.io/ScatterplotAnime/). Enter the number of points you want to test and press the Play button. I recommend using Google Chrome.

## Why?

I was wondering how many points can be animated at once on web browsers. So, I implemented 5 animation methods with various technologies (SVG, Canvas, and WebGL). As you can see, using WebGL is the most efficient method for scatterplot animation although it requires tricky implementation.

## Methods

I made three requirements that all methods should implement:

1. When initialized, each method should show `N` points with randomly-chosen position and color (selected from [`d3.scale.category10`](https://github.com/mbostock/d3/wiki/Ordinal-Scales#categorical-colors)).
2. Each method should animate the points smoothly to randomly-chosen destination points in 1 second.
3. The animation should involve at least one easing function. I used [the cubic-in-out easing function](http://easings.net/#easeInOutCubic) which is the default easing function in d3.js.

Each method is implemented separately in a single javascript file. 

1. webgl.js: This method uses WebGL. 
2. pixeldata.js: This method manipulates the pixel data of a canvas element. For simplicity, it draws a small rectangle instead of a circle. 
3. svg.js: This method uses d3's `transition`.
4. canvas.js: This method is very similar to the baseline method except that it uses [`requestAnimationFrame`](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) for better performance.
5. baseline.js: Naive implementation. It draws points on a `canvas` element and animates them using `setInterval`.

If you have other animation methods, please feel free to add them. Please make sure that your method implements the three requirements above.

If you can understand Korean, you can also read [my blog post](http://www.jaeminjo.com/post/113876054629/scatterplot-animation-canvas-vs-svg-vs-webgl) for more information.

## License

MIT © [Jaemin Jo](http://www.jaeminjo.com)
