var webpack = require("webpack");

var path = require('path');

var cfg = {
	devtool: 'source-map',
	entry: {
		app: "./js/index.js",
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
		root: path.resolve(__dirname,'./js'),
		extensions: ['', '.js', '.jsx']
	},
	module: {
	  loaders: [

	    {
	      test: /\.js?$/,
	      include: [
		    path.resolve(__dirname, "node_modules/material-ui/src"),
		  ],
	      loader: 'babel', // 'babel-loader' is also a legal name to reference
	    },
	    {
	      test: /\.js?$/,
	      include: [
		    path.resolve(__dirname, "node_modules/intui"),
		  ],
	      loader: 'babel', // 'babel-loader' is also a legal name to reference
	      query: {
	        presets: ['react', 'es2015'],
	        plugins: ['transform-runtime']
	      }
	    },
	    {
	      test: /\.js?$/,
	      exclude: /(node_modules|bower_components)/,
	      include: [
		    path.resolve(__dirname, "js"),
		  ],
	      loader: 'babel', // 'babel-loader' is also a legal name to reference
	      query: {
	        presets: ['react', 'es2015'],
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

function runsass() {
  return gulp.src('./css/base.scss')
    .pipe(sass({includePaths: ['./css/sass']}).on('error', sass.logError))
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