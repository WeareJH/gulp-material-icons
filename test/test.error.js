var Transform = require("stream").Transform;
var assert = require("chai").assert;
var icons = require("../");

describe("emit's correct errors", function(){
    it("should throw if initial config not given", function(done){
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
        assert.throws(function () {
            icons().pipe(ts);
        });
        done();
    });
});
