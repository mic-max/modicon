const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: {
        background: './src/background.js',
        popup: './src/popup/popup.js'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(jpe?g|png|gif|ico|svg)$/,
                use: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.(json|ttf|otf|woff2|woff|eot)$/,
                use: 'file-loader?name=[name].[ext]'
            },
            {
                test: /\.(scss|css)$/,
                use: [
                    'style-loader',
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpe?g|png)$/,
                loader: 'responsive-loader',
                options: {
                    adapter: require('responsive-loader/sharp')
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'ModIcon',
            template: './src/popup/popup.html',
            filename: 'popup.html'
        }),
        new CopyWebpackPlugin([
            { from: 'src/manifest.json', to: 'manifest.json'},
            { from: 'src/_locales/', to: '_locales'}
        ]),
        new VueLoaderPlugin()
    ]
}
