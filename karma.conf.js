const path = require("path");
module.exports = function (karmaConfig) {
  karmaConfig.set({
    autoWatch: false,
    basePath: process.cwd(),
    browsers: process.env.BROWSER
      ? process.env.BROWSER.split(",")
      : ["Chromium", "Firefox", "WebKit"],
    client: { mocha: { opts: path.join(__dirname, ".mocharc.json") } },
    files: [
      { pattern: "source/**/*.test.cts", watched: false },
      { pattern: "source/**/*.test.mts", watched: false },
      { pattern: "source/**/*.test.ts", watched: false },
      { pattern: "source/**/*.test.tsx", watched: false },
    ],
    frameworks: ["mocha", "webpack"],
    hostname: "127.0.0.1",
    logLevel: karmaConfig.LOG_ERROR,
    plugins: [
      "@marubase-tools/karma-playwright-launcher",
      "karma-mocha",
      "karma-sourcemap-loader",
      "karma-webpack",
    ],
    preprocessors: {
      "**/*.cts": ["webpack", "sourcemap"],
      "**/*.mts": ["webpack", "sourcemap"],
      "**/*.ts": ["webpack", "sourcemap"],
      "**/*.tsx": ["webpack", "sourcemap"],
    },
    reporters: ["dots"],
    singleRun: true,
    webpack: require("./webpack.config.js"),
  });
};
