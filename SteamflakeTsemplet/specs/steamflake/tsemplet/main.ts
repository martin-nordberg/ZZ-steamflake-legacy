
//<reference path='../thirdparty/node.d.ts'/>

/***
import fs = require( 'fs' );
import readline = require('readline');

console.log( "Tsemplet TBD ..." );

// print process.argv
process.argv.forEach( function ( val : string, index : number, array : string[] ) : void {
    console.log( index + ': ' + val );
} );

var inputFiles : string[] = [];
var outputFolder = '.';

// Read through the command line options
var istart = 1;
if ( process.argv[0] === 'node' ) {
    istart = 2;
}
for ( var i = istart ; i < process.argv.length ; i += 1 ) {

    var arg = process.argv[i];

    if ( arg === '--outDir' ) {
        i += 1;
        if ( i >= process.argv.length ) {
            console.log( "Missing output folder after --outDir option." );
            process.exit( 1 );
        }
        outputFolder = process.argv[i]
    }
    else {
        inputFiles.push( arg );
    }

}

// Echo the input files and output folder
inputFiles.forEach( function ( file : string, index : number, array : string[] ) : void {
    console.log( 'Input File[' + index + ']: ' + file );
} );

console.log( 'Output Folder: ' + outputFolder );


// Process each input file
inputFiles.forEach( function ( file : string, index : number, array : string[] ) : void {

    // open the input file
    var inputStream = fs.createReadStream( file, {
        bufferSize: 4096,
        encoding: 'utf-8'
    } );

    // read the file line by line
    var line ='';

    inputStream.on( 'data', function( chunkBuf : any ) {

        var chunk = chunkBuf.toString();

        var eol = chunk.indexOf( '\n' );
        while ( eol >= 0 ) {
            line += chunk.substring( 0, eol );

            // TBD
            console.log( "LINE : " + line );

            line = '';
            chunk = chunk.substring( eol+1 );
            eol = chunk.indexOf( '\n' );
        }

        line = chunk;
    } );

    inputStream.on( 'end', function() {
        if ( line.length > 0 ) {
            console.log( "LINE*: " + line );
        }
        console.log( 'END' );
    } );

} );

***/