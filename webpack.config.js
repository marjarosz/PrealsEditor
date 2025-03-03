const path = require('path');

const webpack = require("webpack");

module.exports = {
    mode: 'development',

    entry: {
        main: {
          import: './src/main.ts',
        }
      },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, './public/js/dist'),
        publicPath: "public"
    },

    devtool: 'inline-source-map',
    devServer: {
        static: {
          directory: path.join(__dirname, 'public'), 
        },
        compress: true,
        port: 9000, 
      },
    module: {
        rules: [
            { 
                test: /\.ts$/, 
                use: 'ts-loader',
                exclude: [
                    /node_modules/
                ]
            },
            {
                test: /\.css$/, 
                use: ['style-loader', 'css-loader'],
            },
        ],
    },
    resolve : {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new webpack.ProvidePlugin({
            Buffer: ['buffer', 'Buffer'],
        }),
    ],
}