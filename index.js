var Transform = require("stream").Transform;
var File = require("gulp-util").File;
var gutil = require("gulp-util");
var cloneDeep = require("lodash.clonedeep");

const PLUGIN_NAME = "gulp-material-icons";

module.exports = function (opts) {

    opts = opts || {};

    var items = [];

    if (!opts.tasks) {
        throw new gutil.PluginError({
            plugin:  PLUGIN_NAME,
            message: "You didn't provide the required `tasks` array"
        });
    }

    opts.tasks.forEach(function (task) {

        return task.fills.forEach(function (fill, i) {

            var clone = cloneDeep(task);

            clone.fill = fill;
            clone.id = task.ids[i];

            clone.icons = task.icons.reduce(function (all, item) {
                var split = item.split("/");
                var key = split[0];
                var icon = split[1];
                if (!all[key]) {
                    all[key] = [icon];
                } else {
                    all[key].push(icon);
                }
                return all;
            }, {});

            items.push(clone);
        });
    });

    var ts = new Transform({objectMode: true});

    ts._write = function (file, enc, next) {

        var xml2js = require("xml2js");
        var parseString = require("xml2js").parseString;
        var builder = new xml2js.Builder();
        var stream = this;
        var key = require("path").relative(process.cwd(), file.path);

        parseString(file.contents.toString(), function (err, result) {

            srcs[key].tasks.forEach(function (task) {

                var endname = task.name;

                if (task.fill) {
                    result.svg.path[0].$.fill = task.fill;
                }

                if (task.id) {
                    endname += "-" + task.id;
                }

                if (task.size) {
                    endname += "-" + task.size;
                }

                stream.push(new File({
                    path:     endname + ".svg",
                    cwd:      file.cwd,
                    contents: new Buffer(builder.buildObject(result))
                }));
            });
            next();
        });
    };

    var srcs = {};

    items.forEach(function (item) {

        Object.keys(item.icons).forEach(function (key) {

            var prefix = require("path").dirname(require.resolve("material-design-icons")) +
                "/" + key + "/svg/production/";

            if (!require("fs").existsSync(require("path").resolve(prefix))) {
                throw new gutil.PluginError({
                    plugin:  PLUGIN_NAME,
                    message: "Section " + prefix + " does not exist"
                });
            }

            var icons = item.icons[key];

            icons.forEach(function (name) {

                item.sizes.forEach(function (size) {

                    var src = prefix + "ic_" + name + "_" + size + "px.svg";
                    src = require("path").relative(process.cwd(), src);

                    if (!require("fs").existsSync(src)) {
                        throw new gutil.PluginError({
                            plugin:  PLUGIN_NAME,
                            message: src + " Does not exist..."
                        });
                    }

                    if (!srcs[src]) {
                        srcs[src] = {
                            tasks: [getTasks(item, name, size)]
                        };
                    } else {
                        srcs[src].tasks = srcs[src].tasks.concat(getTasks(item, name, size));
                    }
                });
            });
        });
    });

    function getTasks(item, name, size) {
        return {
            fill: item.fill || false,
            id:   item.id,
            name: name,
            size: size
        };
    }

    return require("vinyl-fs").src(Object.keys(srcs)).pipe(ts);
};