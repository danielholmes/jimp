const webpack = require("webpack");
const path = require("path");

const isProd = process.env.NODE_ENV === "production";

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? "source-map" : "eval-cheap-module-source-map",
  entry: "./src/index.js",
  target: "web",
  resolve: {
    alias: {
      pngjs: "pngjs/browser",
    },
    fallback: {
      path: require.resolve("path-browserify"),
      fs: false,
    },
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false, // disable the behaviour
        },
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.browser": JSON.stringify("true"),
      "process.env.ENVIRONMENT": JSON.stringify("BROWSER"),
      "process.env.DIRNAME": JSON.stringify(""),
    }),
    new webpack.ProvidePlugin({
      process: "process/browser.js",
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    }),
    // Support new node: prefixed packages
    new webpack.NormalModuleReplacementPlugin(/node:/, (resource) => {
      const mod = resource.request.replace(/^node:/, "");
      switch (mod) {
        case "buffer":
          resource.request = "buffer";
          break;
        case "stream":
          resource.request = "readable-stream";
          break;
        default:
            throw new Error(`Not found ${mod}`);
      }
    }),
  ],
  output: {
    path: path.join(__dirname, "browser/lib"),
    filename: "jimp.js",
  },
}; 
/* as webpack.Configuration */
