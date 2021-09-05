const path = require('path');
const webpack = require('webpack');


module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
               process: 'process/browser',
        }),
    ],
    entry:  { main:'/src/index.js'},
    output:  {
        path: `${__dirname}/static/frontend`,
        filename: 'main.js',
        publicPath: '/'
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                  loader: "babel-loader"
                }
            },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] }
        ]
    },

    devServer: {
        historyApiFallback: true,
        writeToDisk: true,
    },

};
