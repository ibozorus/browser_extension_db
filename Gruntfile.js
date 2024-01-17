module.exports = function(grunt) {
    // Projekt-Konfiguration
    grunt.initConfig({
        copy: {
            main: {
                expand: true,
                cwd: '', // Ausgangsverzeichnis (current working directory)
                src: ['popup.js', 'popup.html', 'popup.css', 'manifest.json', 'README.md'
                        ,'SNIF-ROT.png', 'LICENSE'
                        , 'node_modules/jquery/dist/**'
                        , 'node_modules/jquery-ui-dist/**'
                        , 'node_modules/@popperjs/core/dist/**'
                        , 'node_modules/bootstrap/dist/**'
                        , 'node_modules/flatpickr/dist/**'
                        , 'node_modules/@fortawesome/**'], // Alle Dateien und Verzeichnisse
                dest: 'dist/' // Zielverzeichnis
            }
        }
    });

    // Lade das Grunt-Plugin
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Registriere die Standardaufgabe (default task)
    grunt.registerTask('default', ['copy']);
};