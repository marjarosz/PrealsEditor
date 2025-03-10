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
        filename: 'js/[name].js',
        path: path.resolve(__dirname, 'public'),
        publicPath: ""
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
            {
                test: /\.html$/,
                use: 'html-loader',
            },
            {
                test: /\.(png|jpg|jpeg|gif|svg)$/i,
                type: 'asset/resource', // Automatycznie kopiuje pliki do folderu wyjściowego
                generator: {
                  filename: './images/[hash][ext][query]', // Określa, gdzie zapisywać obrazy
                },
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