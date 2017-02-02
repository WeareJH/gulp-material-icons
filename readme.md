## gulp-material-icons

Utilise [Google's Material Design Icon Set](https://github.com/google/material-design-icons) in a sane way - serving only the 
icons you actually use.

## Install 
```bash
npm install gulp-material-icons
```

### Example Gulp Task
You simply pass in an array of task & you'll get back a `src` stream that you can pipe to other tasks.

```js
var icons = require("gulp-material-icons");
var gulp  = require("gulp");
var tasks = require("icons.json");

gulp.task("icons", function() {
    return icons({tasks: tasks})
        .pipe(gulp.dest("./img/svgs"));
});
```

**icons.json**

For each icon you want, simply specify them in this format: `<category>/<icon>` as seen in this example...

```json
[
  {
    "sizes": [24, 48],
    "ids": ["blue"],
    "fills": ["#005DAA"],
    "icons": [
      "action/account_circle",
      "action/shopping_basket",
      "action/lock",
      "maps/place",
      "maps/local_shipping",
      "maps/store_mall_directory",
      "navigation/fullscreen",
      "navigation/close",
      "navigation/menu",
      "content/add",
      "content/remove"
    ]
  }
]
```

... you'll get back 22 icons (as we specified 2 sizes) in which you can pipe to other tasks.

### Practical Example - making SVG sprites

Using another lib such as [gulp-svg-sprites](https://github.com/shakyshane/gulp-svg-sprites), you can create 
a fully automated workflow.

```js
var icons   = require("gulp-material-icons");
var sprites = require("gulp-svg-sprites");
var gulp    = require("gulp");
var tasks   = require("icons.json");

gulp.task("icons", function() {
    return icons({tasks: tasks})
        .pipe(sprites())
        .pipe(gulp.dest("./img/svgs"));
});
```


