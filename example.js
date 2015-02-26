var fs = require("vinyl-fs");

require("./")({tasks:require("./test/config-example.json")})
    .pipe(require("gulp-svg-sprites")())
    .pipe(fs.dest("./out"));