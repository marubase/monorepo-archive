const ResolveTsPlugin = require("resolve-typescript-plugin").default;
const path = require("path");

module.exports = {
  devtool: "source-map",
  entry: path.join(process.cwd(), "source", "index.ts"),
  mode: "production",
  stats: "errors-only",
  module: {
    rules: [
      {
        test: /\.ts/,
        use: [{ loader: "ts-loader", options: { transpileOnly: true } }],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    library: { name: "Marubase", type: "assign-properties" },
    path: path.join(process.cwd(), "build"),
  },
  resolve: {
    plugins: [new ResolveTsPlugin()],
  },
};
