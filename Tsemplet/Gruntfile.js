
// Grunt file for Tsemplet
// -----------------------

module.exports = function( grunt ) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON( 'package.json' ),

        clean: ['app'],

        typescript: {
            base: {
                src: ['source/tsemplet/**/*.ts'],
                dest: 'app/tsemplet',
                options: {
                    module: 'commonjs',
                    target: 'es5',
                    base_path: 'source/tsemplet',
                    sourcemap: true,
                    comments: true
                }
            }
        }
    });

    // Load the plugins needed
    grunt.loadNpmTasks( 'grunt-contrib-clean' );
    grunt.loadNpmTasks( 'grunt-typescript' );

    // Default task(s).
    grunt.registerTask( 'default', ['clean','typescript'] );

};
