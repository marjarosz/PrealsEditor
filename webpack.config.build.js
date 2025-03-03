const path = require('path');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require("webpack");
module.exports = {
    mode: 'production',
    entry: './src/main.ts',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, './public/js/dist')
    },
    devtool: false,
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                use: 'ts-loader',
                exclude: [
                    /node_modules/
                ]
            }
        ],
    },
    resolve : {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanPlugin.CleanWebpackPlugin(),
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
      ]
}