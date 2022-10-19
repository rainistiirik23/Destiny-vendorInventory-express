const decompress = require('decompress');
decompress('sqliteFile', 'dist').then(files => {
    console.log('done!');
});
