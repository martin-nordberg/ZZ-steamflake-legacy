/**
 * Spec Module: steamflake/core/io/streamsSpec
 */

///<reference path='../../../../source/thirdparty/node.d.ts'/>
///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>

import fs = require( 'fs' );

import streams = require( '../../../../source/steamflake/core/io/streams' );


describe( "Streams", function() {

    describe( "Line Reader", function()  {

        it( "Reads lines from a file", function( done : ()=>void ) {

            // open the input file
            var filePath = './specs/steamflake/core/io/testdata/sample001.txt';
            var inputStream = fs.createReadStream( filePath, {
                bufferSize: 100,
                encoding: 'utf-8'
            } );

            // wrap it with a line reader
            var lineReader = streams.makeReadableStreamLineReader( inputStream );

            // count lines read during the test
            var linesRead = 0;

            function onLineRead( source : streams.ILineReader, line : string ) {
                linesRead += 1;
                expect( line ).toEqual( "Line " + linesRead );
            }

            function onEofRead( source : streams.ILineReader ) {
                expect( linesRead ).toEqual( 6 );
                lineReader.eofReadEvent.unregisterListener( onEofRead );
                lineReader.lineReadEvent.unregisterListener( onLineRead );
                done();
            }

            // register for line events
            lineReader.lineReadEvent.registerListener( onLineRead );
            lineReader.eofReadEvent.registerListener( onEofRead );
        } );

    } );


} );
