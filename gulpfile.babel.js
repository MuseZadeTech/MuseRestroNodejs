// Generated on 2017-07-20 using generator-angular-fullstack 4.2.2
"use strict";

import _ from "lodash";
import del from "del";
import gulp from "gulp";
import grunt from "grunt";
import path from "path";
import through2 from "through2";
import gulpLoadPlugins from "gulp-load-plugins";
import http from "http";
import open from "open";
import lazypipe from "lazypipe";
import nodemon from "nodemon";
//import { Server as KarmaServer } from "karma";
import runSequence from "run-sequence";
import { protractor, webdriver_update } from "gulp-protractor";
//import { Instrumenter } from "isparta";
import webpack from "webpack-stream";
import makeWebpackConfig from "./webpack.make";

var plugins = gulpLoadPlugins();
var config;

const clientPath = "client";
const serverPath = "server";
const paths = {
  client: {
    assets: `${clientPath}/assets/**/*`,
    images: `${clientPath}/assets/images/**/*`,
    revManifest: `${clientPath}/assets/rev-manifest.json`,
    scripts: [
      `${clientPath}/**/!(*.spec|*.mock).js`,
      `${clientPath}/swagger-ui.js`,
      `${clientPath}/swagger-ui-bundle.js`,
      `${clientPath}/swagger-ui-standalone-preset.js`
    ],
    styles: [`${clientPath}/swagger-ui.css`],
    json: `${clientPath}/swagger.css`,
    mainStyle: `${clientPath}/app/app.css`,
    views: `${clientPath}/oauth2-redirect.html`,
    mainView: `${clientPath}/index.html`,
    test: [`${clientPath}/{app,components}/**/*.{spec,mock}.js`],
    e2e: ["e2e/**/*.spec.js"]
  },
  server: {
    scripts: [
      `${serverPath}/**/!(*.spec|*.integration).js`,
      `!${serverPath}/config/local.env.sample.js`
    ],
    json: [`${serverPath}/**/*.json`],
    test: {
      integration: [`${serverPath}/**/*.integration.js`, "mocha.global.js"],
      unit: [`${serverPath}/**/*.spec.js`, "mocha.global.js"]
    }
  },
  //karma: "karma.conf.js",
  dist: "dist"
};

/********************
 * Helper functions
 ********************/

function onServerLog(log) {
  console.log(
    plugins.util.colors.white("[") +
      plugins.util.colors.yellow("nodemon") +
      plugins.util.colors.white("] ") +
      log.message
  );
}

function checkAppReady(cb) {
  var options = {
    host: "localhost",
    port: config.port
  };
  http.get(options, () => cb(true)).on("error", () => cb(false));
}

// Call page until first success
function whenServerReady(cb) {
  var serverReady = false;
  var appReadyInterval = setInterval(
    () =>
      checkAppReady(ready => {
        if (!ready || serverReady) {
          return;
        }
        clearInterval(appReadyInterval);
        serverReady = true;
        cb();
      }),
    100
  );
}

/********************
 * Reusable pipelines
 ********************/

let lintClientScripts = lazypipe()
  .pipe(plugins.eslint, `${clientPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

const lintClientTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${clientPath}/.eslintrc`,
    envs: ["browser", "es6", "mocha"]
  })
  .pipe(plugins.eslint.format);

let lintServerScripts = lazypipe()
  .pipe(plugins.eslint, `${serverPath}/.eslintrc`)
  .pipe(plugins.eslint.format);

let lintServerTestScripts = lazypipe()
  .pipe(plugins.eslint, {
    configFile: `${serverPath}/.eslintrc`,
    envs: ["node", "es6", "mocha"]
  })
  .pipe(plugins.eslint.format);

let transpileServer = lazypipe()
  .pipe(plugins.sourcemaps.init)
  .pipe(plugins.babel, {
    plugins: ["transform-class-properties", "transform-runtime"]
  })
  .pipe(plugins.sourcemaps.write, ".");

let mocha = lazypipe().pipe(plugins.mocha, {
  reporter: "spec",
  timeout: 5000,
  require: ["./mocha.conf"]
});

let istanbul = lazypipe()
  .pipe(plugins.istanbul.writeReports)
  .pipe(plugins.istanbulEnforcer, {
    thresholds: {
      global: {
        lines: 80,
        statements: 80,
        branches: 80,
        functions: 80
      }
    },
    coverageDirectory: "./coverage",
    rootDirectory: ""
  });

/********************
 * Env
 ********************/

gulp.task("env:all", () => {
  let localConfig;
  try {
    localConfig = require(`./${serverPath}/config/local.env`);
  } catch (e) {
    localConfig = {};
  }
  plugins.env({
    vars: localConfig
  });
});
gulp.task("env:test", () => {
  plugins.env({
    vars: { NODE_ENV: "test" }
  });
});
gulp.task("env:prod", () => {
  plugins.env({
    vars: { NODE_ENV: "production" }
  });
});

gulp.task("webpack:dev", function() {
  const webpackDevConfig = makeWebpackConfig({ DEV: true });
  return gulp
    .src(webpackDevConfig.entry.app)
    .pipe(plugins.plumber())
    .pipe(webpack(webpackDevConfig))
    .pipe(gulp.dest(".tmp"));
});

gulp.task("webpack:dist", function() {
  const webpackDistConfig = makeWebpackConfig({ BUILD: true });
  return gulp
    .src(webpackDistConfig.entry.app)
    .pipe(webpack(webpackDistConfig))
    .on("error", err => {
      this.emit("end"); // Recover from errors
    })
    .pipe(gulp.dest(`${paths.dist}/client`));
});

gulp.task("webpack:test", function() {
  const webpackTestConfig = makeWebpackConfig({ TEST: true });
  return gulp
    .src(webpackTestConfig.entry.app)
    .pipe(webpack(webpackTestConfig))
    .pipe(gulp.dest(".tmp"));
});

gulp.task("webpack:e2e", function() {
  const webpackE2eConfig = makeWebpackConfig({ E2E: true });
  return gulp
    .src(webpackE2eConfig.entry.app)
    .pipe(webpack(webpackE2eConfig))
    .pipe(gulp.dest(".tmp"));
});

gulp.task("styles", () => {
  return gulp
    .src(paths.client.styles)
    .pipe(styles())
    .pipe(gulp.dest(".tmp/app"));
});
gulp.task("json", () => {
  return gulp.src(paths.client.json).pipe(gulp.dest(".tmp/app"));
});
gulp.task("transpile:server", () => {
  return gulp
    .src(_.union(paths.server.scripts, paths.server.json))
    .pipe(transpileServer())
    .pipe(gulp.dest(`${paths.dist}/${serverPath}`));
});

gulp.task("lint:scripts", cb =>
  runSequence(["lint:scripts:client", "lint:scripts:server"], cb)
);

gulp.task("lint:scripts:client", () => {
  return gulp
    .src(
      _.union(
        paths.client.scripts,
        _.map(paths.client.test, blob => "!" + blob)
      )
    )
    .pipe(lintClientScripts());
});

gulp.task("lint:scripts:server", () => {
  return gulp
    .src(
      _.union(
        paths.server.scripts,
        _.map(paths.server.test, blob => "!" + blob)
      )
    )
    .pipe(lintServerScripts());
});

gulp.task("lint:scripts:clientTest", () => {
  return gulp.src(paths.client.test).pipe(lintClientScripts());
});

gulp.task("lint:scripts:serverTest", () => {
  return gulp.src(paths.server.test).pipe(lintServerTestScripts());
});

gulp.task("jscs", () => {
  return gulp
    .src(_.union(paths.client.scripts, paths.server.scripts))
    .pipe(plugins.jscs())
    .pipe(plugins.jscs.reporter());
});

gulp.task("clean:tmp", () => del([".tmp/**/*"], { dot: true }));

gulp.task("start:client", cb => {
  whenServerReady(() => {
    open("http://localhost:" + config.browserSyncPort);
    cb();
  });
});

gulp.task("start:server", () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  config = require(`./${serverPath}/config/environment`);
  nodemon(`-w ${serverPath} ${serverPath}`).on("log", onServerLog);
});

gulp.task("start:server:prod", () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  config = require(`./${paths.dist}/${serverPath}/config/environment`);
  nodemon(`-w ${paths.dist}/${serverPath} ${paths.dist}/${serverPath}`).on(
    "log",
    onServerLog
  );
});

gulp.task("start:server:debug", () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "development";
  config = require(`./${serverPath}/config/environment`);
  // nodemon(`-w ${serverPath} --debug=5858 --debug-brk ${serverPath}`)
  nodemon(`-w ${serverPath} --inspect --debug-brk ${serverPath}`).on(
    "log",
    onServerLog
  );
});

gulp.task("watch", () => {
  var testFiles = _.union(
    paths.client.test,
    paths.server.test.unit,
    paths.server.test.integration
  );

  plugins
    .watch(_.union(paths.server.scripts, testFiles))
    .pipe(plugins.plumber())
    .pipe(lintServerScripts());

  plugins
    .watch(_.union(paths.server.test.unit, paths.server.test.integration))
    .pipe(plugins.plumber())
    .pipe(lintServerTestScripts());
});

gulp.task("serve", cb => {
  runSequence(
    ["clean:tmp", "env:all"],
    // 'webpack:dev',
    ["start:server", "start:client"],
    "watch",
    cb
  );
});

gulp.task("serve:debug", cb => {
  runSequence(
    ["clean:tmp", "env:all"],
    "webpack:dev",
    ["start:server:debug", "start:client"],
    "watch",
    cb
  );
});

gulp.task("serve:dist", cb => {
  runSequence(
    "build",
    "env:all",
    "env:prod",
    ["start:server:prod", "start:client"],
    cb
  );
});

gulp.task("test", cb => {
  return runSequence("test:server", "test:client", cb);
});

gulp.task("test:server", cb => {
  runSequence("env:all", "env:test", "mocha:unit", "mocha:integration", cb);
});

gulp.task("mocha:unit", () => {
  return gulp.src(paths.server.test.unit).pipe(mocha());
});

gulp.task("mocha:integration", () => {
  return gulp.src(paths.server.test.integration).pipe(mocha());
});

gulp.task("test:server:coverage", cb => {
  runSequence(
    "coverage:pre",
    "env:all",
    "env:test",
    "coverage:unit",
    "coverage:integration",
    cb
  );
});

gulp.task("coverage:pre", () => {
  return (
    gulp
      .src(paths.server.scripts)
      // Covering files
      .pipe(
        plugins.istanbul({
          //instrumenter: Instrumenter, // Use the isparta instrumenter (code coverage for ES6)
          includeUntested: true
        })
      )
      // Force `require` to return covered files
      .pipe(plugins.istanbul.hookRequire())
  );
});

gulp.task("coverage:unit", () => {
  return gulp
    .src(paths.server.test.unit)
    .pipe(mocha())
    .pipe(istanbul());
  // Creating the reports after tests ran
});

gulp.task("coverage:integration", () => {
  return gulp
    .src(paths.server.test.integration)
    .pipe(mocha())
    .pipe(istanbul());
  // Creating the reports after tests ran
});

// Downloads the selenium webdriver
gulp.task("webdriver_update", webdriver_update);

gulp.task(
  "test:e2e",
  ["webpack:e2e", "env:all", "env:test", "start:server", "webdriver_update"],
  cb => {
    gulp
      .src(paths.client.e2e)
      .pipe(
        protractor({
          configFile: "protractor.conf.js"
        })
      )
      .on("error", e => {
        throw e;
      })
      .on("end", () => {
        process.exit();
      });
  }
);

//gulp.task("test:client", done => {
// new KarmaServer(
//   {
//     configFile: `${__dirname}/${paths.karma}`,
//     singleRun: true
//   },
//   err => {
//     done(err);
//     process.exit(err);
//   }
// ).start();
//});

/********************
 * Build
 ********************/

gulp.task("build", cb => {
  runSequence(
    ["clean:dist", "clean:tmp"],
    "transpile:server",
    ["build:images"],
    [
      "copy:extras",
      "copy:server",
      "copy:email",
      "copy:orderStatus",
      "webpack:dist"
    ],
    "revReplaceWebpack",
    cb
  );
});

gulp.task("clean:dist", () =>
  del([`${paths.dist}/!(.git*|.openshift|Procfile)**`], { dot: true })
);

gulp.task("build:images", () => {
  return gulp
    .src(paths.client.images)
    .pipe(
      plugins.imagemin([
        plugins.imagemin.optipng({ optimizationLevel: 5 }),
        plugins.imagemin.jpegtran({ progressive: true }),
        plugins.imagemin.gifsicle({ interlaced: true }),
        plugins.imagemin.svgo({ plugins: [{ removeViewBox: false }] })
      ])
    )
    .pipe(plugins.rev())
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/images`))
    .pipe(
      plugins.rev.manifest(`${paths.dist}/${paths.client.revManifest}`, {
        base: `${paths.dist}/${clientPath}/assets`,
        merge: true
      })
    )
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task("revReplaceWebpack", function() {
  return gulp
    .src("dist/client/app.*.ts")
    .pipe(
      plugins.revReplace({
        manifest: gulp.src(`${paths.dist}/${paths.client.revManifest}`)
      })
    )
    .pipe(gulp.dest("dist/client"));
});

gulp.task("copy:extras", () => {
  return gulp
    .src(
      [
        `${clientPath}/favicon.ico`,
        `${clientPath}/robots.txt`,
        `${clientPath}/swagger.json`,
        `${clientPath}/swagger-ui.js`,
        `${clientPath}/swagger-ui-bundle.js`,
        `${clientPath}/swagger-ui-standalone-preset.js`,
        `${clientPath}/swagger-ui.css`,
        `${clientPath}/oauth2-redirect.html`,
        `${clientPath}/.htaccess`
      ],
      { dot: true }
    )
    .pipe(gulp.dest(`${paths.dist}/${clientPath}`));
});

gulp.task("copy:email", () => {
  return gulp
    .src([`${serverPath}/components/email/*`], { dot: true })
    .pipe(gulp.dest(`${paths.dist}/${serverPath}/components/email`));
});
gulp.task("copy:orderStatus", () => {
  return gulp
    .src([`${serverPath}/components/orderStatus/*`], { dot: true })
    .pipe(gulp.dest(`${paths.dist}/${serverPath}/components/orderStatus`));
});

/**
 * turns 'bootstrap/fonts/font.woff' into 'bootstrap/font.woff'
 */
function flatten() {
  return through2.obj(function(file, enc, next) {
    if (!file.isDirectory()) {
      try {
        let dir = path.dirname(file.relative).split(path.sep)[0];
        let fileName = path.normalize(path.basename(file.path));
        file.path = path.join(file.base, path.join(dir, fileName));
        this.push(file);
      } catch (e) {
        this.emit("error", new Error(e));
      }
    }
    next();
  });
}

gulp.task("copy:fonts:dist", () => {
  return gulp
    .src("node_modules/{bootstrap,font-awesome}/fonts/*")
    .pipe(flatten())
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets/fonts`));
});

gulp.task("copy:assets", () => {
  return gulp
    .src([paths.client.assets, "!" + paths.client.images])
    .pipe(gulp.dest(`${paths.dist}/${clientPath}/assets`));
});

gulp.task("copy:server", () => {
  return gulp
    .src(["package.json"], { cwdbase: true })
    .pipe(gulp.dest(paths.dist));
});

/********************
 * Grunt ported tasks
 ********************/

grunt.initConfig({
  buildcontrol: {
    options: {
      dir: paths.dist,
      commit: true,
      push: true,
      connectCommits: false,
      message:
        "Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%"
    },
    heroku: {
      options: {
        remote: "heroku",
        branch: "master"
      }
    },
    openshift: {
      options: {
        remote: "openshift",
        branch: "master"
      }
    }
  }
});

grunt.loadNpmTasks("grunt-build-control");

gulp.task("buildcontrol:heroku", function(done) {
  grunt.tasks(
    ["buildcontrol:heroku"], //you can add more grunt tasks in this array
    { gruntfile: false }, //don't look for a Gruntfile - there is none. :-)
    function() {
      done();
    }
  );
});
gulp.task("buildcontrol:openshift", function(done) {
  grunt.tasks(
    ["buildcontrol:openshift"], //you can add more grunt tasks in this array
    { gruntfile: false }, //don't look for a Gruntfile - there is none. :-)
    function() {
      done();
    }
  );
});
