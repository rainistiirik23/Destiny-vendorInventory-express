const path = require('path')
const directoryNames = {
    Vendorpage: 'Vendorpage',
    Wishlistpage: 'Wishlistpage'
}


const Vendorpage = {

    mode: 'development',
    entry: path.join(__dirname, 'src/Views/Vendorpage/app'),
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, `Public/Views/${directoryNames['Vendorpage']}/`)
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.(png|js)$/,
            exclude: [/node_modules/, /Requests/, /Manifest/, /Vanilla-JS/, /server/]
        }]
    }

}
const Wishlistpage = {

    mode: 'development',
    entry: {

        Wishlistpage: path.join(__dirname, 'src/Views/Wishlistpage/app'),
    },
    output: {
        filename: 'bundle.js',
        path: path.join(__dirname, `Public/Views/${directoryNames['Wishlistpage']}/`)
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.(png|js)$/,
            exclude: [/node_modules/, /Requests/, /Manifest/, /Vanilla-JS/, /server/]
        }]
    }
}

module.exports = [Vendorpage, Wishlistpage]


/* module.exports = {

    mode: 'development',
    entry: {
        Vendorpage: path.join(__dirname, 'src/Views/Vendorpage/app'),
        Wishlistpage: path.join(__dirname, 'src/Views/Wishlistpage/app'),
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, 'Public/Views/[name]/')
    },
    module: {
        rules: [{
            loader: 'babel-loader',
            test: /\.(png|js)$/,
            exclude: [/node_modules/, /Requests/, /Manifest/, /Vanilla-JS/, /server/]
        }]
    }

}
 */
