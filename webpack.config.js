const path = require('path')
module.exports = {
    mode: 'development',
    entry: path.join(__dirname, 'src/app.js'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, 'Public')
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.(png|js)$/,
            exclude: [/node_modules/, /Requests/, /Manifest/]
        }]
    }

}
