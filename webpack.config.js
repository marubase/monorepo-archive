const ResolveTsPlugin = require("resolve-typescript-plugin").default;
module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  stats: "errors-only",
  module: {
    rules: [
      {
        exclude:
          /node_modules|\.contract\.(cts|mts|ts|tsx)|\.error\.(cts|mts|ts|tsx)|\.test\.(cts|mts|ts|tsx)$/,
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
  resolve: {
    plugins: [new ResolveTsPlugin()],
  },
};
