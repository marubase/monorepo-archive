const ResolveTsPlugin = require("resolve-typescript-plugin").default;
module.exports = {
  devtool: "inline-source-map",
  mode: "development",
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
      },
    ],
  },
  resolve: {
    plugins: [new ResolveTsPlugin()],
  },
};
