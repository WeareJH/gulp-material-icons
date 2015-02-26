var Transform = require("stream").Transform;
var assert = require("chai").assert;
var icons = require("../");
var tasks = require("./config-example.json");

describe("sending svg's down stream", function(){
    it("sends correct number of files", function(done){
        var files =[];
        var ts = new Transform({objectMode: true});
        ts._flush = function (cb) {
            this.emit("end");
            cb();
        };
        ts._write = function (file, enc, next) {
            files.push(file.relative);
            this.push(file);
            next();
        };

        icons({
            tasks: tasks
        })
            .pipe(ts)
            .on("end", function () {
                //require("fs").writeFileSync("./expected.json", JSON.stringify(files, null, 2));
                assert.deepEqual(require("./expected.json"), files);
                done();
            });
    });
});
