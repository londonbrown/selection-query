let HtmlWebpackPlugin = require("html-webpack-plugin")
let path = require("path")

module.exports = {
  entry: {
    background: ["./src/background.ts"],
    options: ["./src/options.ts"]
  },
  module: {
    rules: [
      {
        test: /\.ts?$/,
        use: ["ts-loader"],
        exclude: /node_modules/
      },
      {
        test: /\.ejs?$/,
        use: ["html-loader", "template-ejs-loader"],
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [".ts"]
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist")
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/html/template.html",
      chunks: ["options"],
      filename: "./options.html",
      cache: true
    })
  ],
  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 4000
  }
}
