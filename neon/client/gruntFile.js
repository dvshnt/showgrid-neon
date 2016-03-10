module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		copy: {
			css: {
				expand: true,
				flatten: true,
				cwd: './css/',
				src: ['*.css', '*.css.map'],
				dest: '../static/showgrid/css/',
			},
			js: {
				expand: true,
				cwd: './js/',
				src: '*.js',
				dest: '../static/showgrid/js/',
			},
		},


		// SASS Compilation
		sass: {
			dev: {
				options: {
					style: 'expanded'
				},
				files: {
					'./css/base.css' : './css/sass/base.scss',
				}
			},
			prod: {
				options: {
					style: 'compressed'
				},
				files: {
					'./css/base.css' : './css/sass/base.scss'
				}
			}
		},
	
		autoprefixer: {
			options: {
			// Task-specific options go here.
			},
			css: {
				files: {
					'./css/base.css' : './css/base.css'
				}
			},
		},

		browserify: {	
			options: {
				browserifyOptions: {
					debug: true
				}
			},
			dev: {
				options: {
					debug: true,
					transform: ['babelify']
				},
				src: './js/lib/index.js',
				dest: './js/bundle.js'
			},
			build: {
				options: {
					debug: false,
					transform: ['babelify']
				},
				src: './js/lib/index.js',
				dest: './js/bundle.js'
			}
		},

		uglify: {
			build: {
				src: './js/bundle.js',
				dest: './js/bundle.min.js'
			}
		},

		watch: { 
			css: {
				files: './css/sass/*.scss', 
				tasks: ['sass:dev','autoprefixer','copy:css'],
				options: {
					livereload: true,
				}
			},
			js: {
				files: [
					'./js/lib/*.js', './js/lib/components/*.js', './js/lib/util/*.js'
				],
				tasks: ['browserify:dev', 'copy:js'],
				options: {
					livereload: true,
				}
			}
		},
	});


	//// Grunt Modules
	grunt.loadNpmTasks('grunt-browserify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-autoprefixer');


	//// Registered Tasks
	grunt.registerTask('default', ['watch']);
	grunt.registerTask('build', ['sass:prod', 'browserify:build', 'copy:css', 'uglify:build', 'copy:js']);
}
