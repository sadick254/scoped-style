const path = require("path");

module.exports = {
  entry: "./src/index.js",
  output: {
    filename: "scoped-style.js",
    path: path.resolve(__dirname, "dist"),
    library: "scopedStyle",
    libraryTarget: "umd",
    globalObject: `typeof self !== 'undefined' ? self : this`,
    libraryExport: "default"
  },
  mode: "production"
};
