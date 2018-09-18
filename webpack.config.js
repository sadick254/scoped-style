const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "scoped-css.js",
    path: path.resolve(__dirname, "dist"),
    library: "scopedCss",
    libraryTarget: "umd",
    globalObject: `typeof self !== 'undefined' ? self : this`,
    libraryExport: "default"
  },
  mode: "production"
};
