const ResolveTsPlugin = require("resolve-typescript-plugin").default;
const webpack = require("webpack");
module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  stats: "errors-only",
  module: {
    rules: [
      {
        exclude:
          /node_modules|\.contract\.(cts|mts|ts|tsx)|\.error\.(cts|mts|ts|tsx)|\.test\.(cts|mts|ts|tsx)|index.(cts|mts|ts|tsx)$/,
        loader: "@jsdevtools/coverage-istanbul-loader",
        options: { esModules: true, produceSourceMap: true },
        test: /\.(cts|mts|ts|tsx)$/,
      },
      {
        exclude: /node_modules/,
        loader: "ts-loader",
        options: { transpileOnly: true },
        test: /\.(cts|mts|ts|tsx)$/,
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ],
  resolve: {
    fallback: {
      buffer: require.resolve("buffer"),
      process: require.resolve("process/browser"),
      util: require.resolve("util"),
    },
    plugins: [new ResolveTsPlugin()],
  },
};
