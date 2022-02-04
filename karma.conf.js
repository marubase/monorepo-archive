module.exports = function (karmaConfig) {
  karmaConfig.set({
    autoWatch: false,
    basePath: process.cwd(),
    browsers: process.env.KARMA_BROWSER
      ? process.env.KARMA_BROWSER.split(",")
      : ["Chromium", "Firefox", "WebKit"],
    coverageIstanbulReporter: {
      combineBrowserReports: process.env.KARMA_REPORT_COMBINE ? true : false,
      dir: "coverage/%browser%",
      fixWebpackSourcePaths: true,
      reports: process.env.KARMA_REPORT
        ? process.env.KARMA_REPORT.split(",")
        : ["text"],
    },
    failOnEmptyTestSuite: false,
    files: [
      { pattern: "source/index.test.ts", watched: false },
      { pattern: "source/index.test.cts", watched: false },
      { pattern: "source/index.test.js", watched: false },
      { pattern: "source/index.test.jsx", watched: false },
      { pattern: "source/index.test.mjs", watched: false },
      { pattern: "source/index.test.mts", watched: false },
      { pattern: "source/index.test.ts", watched: false },
      { pattern: "source/index.test.tsx", watched: false },
    ],
    frameworks: ["mocha", "webpack"],
    hostname: "127.0.0.1",
    logLevel: karmaConfig.LOG_ERROR,
    plugins: [
      "@marubase-tools/karma-playwright-launcher",
      "karma-coverage-istanbul-reporter",
      "karma-mocha",
      "karma-sourcemap-loader",
      "karma-webpack",
    ],
    preprocessors: {
      "**/*.cts": ["webpack", "sourcemap"],
      "**/*.cjs": ["webpack", "sourcemap"],
      "**/*.js": ["webpack", "sourcemap"],
      "**/*.jsx": ["webpack", "sourcemap"],
      "**/*.mjs": ["webpack", "sourcemap"],
      "**/*.mts": ["webpack", "sourcemap"],
      "**/*.ts": ["webpack", "sourcemap"],
      "**/*.tsx": ["webpack", "sourcemap"],
    },
    reporters: ["coverage-istanbul"],
    singleRun: true,
    webpack: require("./webpack.config.js"),
  });
};
