const path = require("path");
module.exports = Object.assign(require("../../webpack.config.js"), {
  devtool: "source-map",
  entry: path.join(process.cwd(), "source", "index.ts"),
  mode: "production",
  output: {
    filename: "container.bundle.js",
    library: {
      name: ["Marubase", "Container"],
      type: "assign-properties",
    },
    path: path.join(process.cwd(), "build"),
  },
});
