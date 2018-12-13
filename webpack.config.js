const path = require('path');


const HtmlWebpackPlugin = require('html-webpack-plugin');


const HtmlWebpackPluginConfig = new HtmlWebpackPlugin({
    template: './src/app.html',
    filename: 'app.html',
    inject: 'body'
})
module.exports = {
    context: __dirname,
    //entry: './src/app.js',
    
    entry: {
        main: './src/app.js',
    },
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'app.bundle.js'
    },

    resolve: {
        alias: {
            ROOT: path.resolve(__dirname, 'src/'),
        },
    },
    module: {
        loaders: [
            { test: /\.less$|\.css$/, loader: 'style-loader!css-loader!less-loader', exclude: /node_modules/ },
            { test: /\.svg$/, loader: 'svg-inline-loader', exclude: /node_modules/ },
            { test: /\.js$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.jsx$/, loader: 'babel-loader', exclude: /node_modules/ },
            { test: /\.(png|jpg|gif)$/, loader: 'file-loader', exclude: /node_modules/ },
        ],
    },
    plugins: [
        HtmlWebpackPluginConfig,
    ]
};



    rules: [
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}  
          }
        ]
      }
    ]