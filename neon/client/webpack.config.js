var webpack = require("webpack");

var path = require('path');

var cfg = {
	devtool: 'source-map',
	entry: {
		app: "./js/main.js",
 		vendor: [
 			"./node_modules/jquery",
 	 		"./node_modules/react",
 			"./node_modules/gsap/src/uncompressed/TweenMax.js",
 			"./node_modules/gsap/src/uncompressed/easing/EasePack.js",
 		],
 	},
	output: {
		path: '../static/showgrid/js',
		publicPath: '../static/showgrid/js',
		filename: "[name].bundle.js",
		chunkFilename: "[id].chunk.js"

	},
	resolve: {
   		root: path.resolve('./js'),
		extensions: ['', '.js']
	},
	module: {
	  loaders: [
		{
	      test: /\.js?$/,
	      exclude: /(node_modules\/(?!intui).*|bower_components)/,
	      loader: 'babel', // 'babel-loader' is also a legal name to reference
	      query: {
	        presets: ['es2015' , 'react'],
			plugins: ['transform-runtime']
	      }
	    },
	  ]
	},
	plugins: [
		new webpack.optimize.CommonsChunkPlugin("vendor", "vendor.bundle.js")
	],
}

var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
function runsass() {
  return gulp.src('./css/base.scss')
    .pipe(sass({includePaths: ['./css/sass']}).on('error', sass.logError))
    .pipe(autoprefixer({
		browsers: ['last 2 versions'],
		cascade: false
	}))
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