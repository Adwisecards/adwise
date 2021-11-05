const path = require('path');
const Dotenv = require('dotenv-webpack');


module.exports = {
    mode: 'development',
    entry: ['@babel/polyfill', path.join(__dirname, 'src', 'index.js')],
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'dist'),
        publicPath: '/'
    },
    target: 'web',
    resolve: {
        extensions: ['.js', '.jsx']
    },
    module: {
        rules: [{
            test: /\.(js|jsx)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader'
            }
        }, {
            test: /\.(png|jpe?g|gif|svg)$/,
            loader: 'url-loader?limit=10000&name=img/[name].[ext]'
        }, {
            test: /\.json$/,
            type: 'javascript/auto',
            use: [require.resolve('json-loader')],
        }, {
            test: /\.css$/,
            use: [
                'style-loader',
                {
                    loader: 'css-loader',
                    options: {
                        importLoaders: 1,
                        modules: true
                    }
                }
            ]
        }]
    },
    plugins: [
        new Dotenv()
    ],

    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        historyApiFallback: true,
        port: 3000,
        clientLogLevel: 'info',
        watchContentBase: true,
        liveReload: true,
        publicPath: '/',
        index: 'index.html'
    },
};