var webpack = require("webpack");
var path = require('path');

var cfg = {
	devtool: 'source-map',
	module: {
		loaders: [
			{ test: /\.jsx$/, loader: "jsx-loader" },
			{ exclude: /(node_modules|bower_components)/, test: /\.js$/, loader: "babel",query: { presets: ['es2015'] } },
		]
	},
	context: __dirname + "/js/",
	entry: {
		app: "index.js",
 		vendor: [
 	 		"../node_modules/react",
 			"../node_modules/gsap/src/uncompressed/TweenLite.js",
 			"../node_modules/gsap/src/uncompressed/easing/EasePack.js",
 		],
 	},

	output: {
		path: '../static/showgrid/js',
		publicPath: '../static/showgrid/js',
		filename: "bundle.js"
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	],

}


var gulp = require('gulp');
var sass = require('gulp-sass');

function runsass() {
  return gulp.src('./client_source/style/main.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('../static/showgrid/css'))
    .on('done',function(){
    	console.log("CSS DONE")
    })
    .on('end',function(){
    	console.log("CSS DONE")
    })
    .pipe(sass().on('done', console.log))
    .pipe(sass().on('end', console.log))
}

gulp.task('sass',runsass);
runsass()
gulp.watch('./css/**/*.scss', ['sass']);


module.exports = cfg;