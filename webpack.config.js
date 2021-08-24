const path = require('path');
const webpack = require('webpack');


module.exports = {
    plugins: [
        new webpack.ProvidePlugin({
               process: 'process/browser',
        }),
    ],
    mode:'development',
    entry:  { main:'/new_math_site/frontend/src/index.js'},
    output:  {
        path: `${__dirname}/new_math_site/frontend/static/frontend`,
        filename: 'main.js'
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
    },


};
