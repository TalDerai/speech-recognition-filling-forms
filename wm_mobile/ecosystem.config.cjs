
module.exports = {
    apps: [
        {
            name: 'kupaktana-mobile',
            script: './startscript.js',
            watch: false,
            instances  : 1,
            exec_mode: 'cluster',
            out_file: './out.log',
            error_file: './error.log'
        }
    ]
}