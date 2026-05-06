"use strict";

import gulp from "gulp";
import del from "del";
import gulpLoadPlugins from "gulp-load-plugins";
import { spawn } from "child_process";
import minifyHTML from "gulp-minify-html";
import purify from "gulp-purifycss";
import fs from "fs";
import dartSass from "sass";

const $ = gulpLoadPlugins();
const browserSync = require("browser-sync").create();
const isProduction = process.env.NODE_ENV === "production";
const sassCompiler = $.sass(dartSass);

const onError = err => {
	console.log(err);
};

let suppressHugoErrors = false;

// --

const watchContent = () => {
	gulp.watch(
		[
			"archetypes/**/*",
			"data/**/*",
			"content/**/*",
			"layouts/**/*",
			"static/**/*",
			"config.toml"
		],
		hugo
	);
};

const watchPreviewContent = () => {
	gulp.watch(
		[
			"archetypes/**/*",
			"data/**/*",
			"content/**/*",
			"layouts/**/*",
			"static/**/*",
			"config.toml"
		],
		hugoPreview
	);
};

const minify = () => {
	const opts = { comments: true, spare: true };
	return gulp
		.src("./public/**/*.html")
		.pipe(minifyHTML(opts))
		.pipe(gulp.dest("./public/"));
};

const initWatch = cb => {
	suppressHugoErrors = true;
	browserSync.init({
		server: {
			baseDir: "public"
		},
		open: false
	});
	gulp.watch("src/sass/**/*.scss", sass);
	gulp.watch("src/js/**/*.js", jsWatch);
	gulp.watch("src/images/**/*", images);
	gulp.watch("src/lambda/**/*", buildFunctions);
	cb();
};

const buildFunctions = cb => {
	fs.readdir("./src/lambda", (err, files) => {
		if (err) {
			cb(err);
		}
		if (!files.filter(file => file.endsWith(".js")).length) {
			console.log("No Netlify functions.");
			cb();
			return;
		}
		return spawn("netlify-lambda", ["build", "src/lambda"], { stdio: "inherit" }).on(
			"close",
			code => {
				if (code === 0) {
					cb();
				} else {
					console.log("netlify-lambda failed.");
					cb("netlify-lambda failed.");
				}
			}
		);
	});
};

const hugo = cb => {
	let baseUrl =
		process.env.NODE_ENV === "production" ? process.env.URL : process.env.DEPLOY_PRIME_URL;
	let args = baseUrl ? ["-b", baseUrl] : [];

	return spawn("hugo", args, { stdio: "inherit" }).on("close", code => {
		if (suppressHugoErrors || code === 0) {
			browserSync.reload();
			minify().on("end", cb);
		} else {
			console.log("hugo command failed.");
			cb("hugo command failed.");
		}
	});
};

const hugoPreview = cb => {
	let args = ["--buildDrafts", "--buildFuture"];
	if (process.env.DEPLOY_PRIME_URL) {
		args.push("-b");
		args.push(process.env.DEPLOY_PRIME_URL);
	}
	return spawn("hugo", args, { stdio: "inherit" }).on("close", code => {
		if (suppressHugoErrors || code === 0) {
			browserSync.reload();
			cb();
		} else {
			console.log("hugo command failed.");
			cb("hugo command failed.");
		}
	});
};

// --

const sass = () => {
	return gulp
		.src(["src/sass/**/*.scss"])
		.pipe($.plumber({ errorHandler: onError }))
		.pipe($.print())
		.pipe($.if(!isProduction, $.sassLint()))
		.pipe($.if(!isProduction, $.sassLint.format()))
		.pipe(sassCompiler({ precision: 5 }))
		.pipe($.autoprefixer(["ie >= 8", "last 2 versions"]))
		.pipe($.cssnano({ discardUnused: false, minifyFontValues: false }))
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest("static/css"))
		.pipe(browserSync.stream())
};

const pureCss = () => {
	return gulp
		.src(["src/css/**/*.css"])
		.pipe(purify(["./public/**/*.html"]))
		.pipe($.cssnano({ discardUnused: false, minifyFontValues: false }))
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest("static/css"));
};

const jsWatch = cb => {
	js();
	browserSync.reload();
	cb();
};

const js = () => {
	return gulp
		.src(["src/js/**/*.js"])
		.pipe($.plumber({ errorHandler: onError }))
		.pipe($.print())
		.pipe($.babel())
		.pipe($.concat("app.js"))
		.pipe($.uglify())
		.pipe($.size({ gzip: true, showFiles: true }))
		.pipe(gulp.dest("static/js"));
};

const fonts = () => {
	return gulp.src("src/fonts/**/*.{woff,woff2}").pipe(gulp.dest("static/fonts"));
};

const images = () => {
	return gulp
		.src("src/images/**/*.{png,jpg,jpeg,gif,svg,webp,ico}")
		.pipe($.newer("static/images"))
		.pipe($.print())
		.pipe($.imagemin())
		.pipe(gulp.dest("static/images"));
};

const cmsDelete = () => {
	return del(["static/admin"], { dot: true });
};

const pubDelete = () => {
	return del(["public/**", "!public", "functions/**", "!functions"], {
		// dryRun: true,
		dot: true
	}).then(paths => {
		console.log(
			"Files and folders deleted:\n",
			paths.join("\n"),
			"\nTotal Files Deleted: " + paths.length + "\n"
		);
	});
};

const build = gulp.series(pubDelete, gulp.parallel(sass, js, fonts, images, buildFunctions), hugo, pureCss);
const buildPreview = gulp.series(
	pubDelete,
	gulp.parallel(sass, js, fonts, images, buildFunctions),
	hugoPreview,
	pureCss
);
const server = gulp.series(build, initWatch, watchContent);
const serverWithDrafts = gulp.series(buildPreview, initWatch, watchPreviewContent);

gulp.task("minify", minify);
gulp.task("init-watch", initWatch);
gulp.task("build-functions", buildFunctions);
gulp.task("hugo", hugo);
gulp.task("hugo-preview", hugoPreview);
gulp.task("sass", sass);
gulp.task("pure-css", pureCss);
gulp.task("js-watch", jsWatch);
gulp.task("js", js);
gulp.task("fonts", fonts);
gulp.task("images", images);
gulp.task("cms-delete", cmsDelete);
gulp.task("pub-delete", pubDelete);
gulp.task("build", build);
gulp.task("build-preview", buildPreview);
gulp.task("server", server);
gulp.task("server:with-drafts", serverWithDrafts);
