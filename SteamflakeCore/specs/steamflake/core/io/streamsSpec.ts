/**
 * Spec Module: steamflake/core/io/streamsSpec
 */

///<reference path='../../../../../ThirdParty/lib/server/node.d.ts'/>
///<reference path='../../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import fs = require( 'fs' );

import streams = require( '../../../../source/steamflake/core/io/streams' );


describe( "Streams", function() {

    describe( "Readable Stream Line Reader", function()  {

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

    describe( "String Line Reader", function() {
        var expectedLines;
        var lineReader;
        var linesRead;
        var done;

        var onLineRead = function( source : streams.ILineReader, line : string ) {
            expect( source ).toBe( lineReader );
            linesRead += 1;
            expect( line ).toEqual( "Line " + linesRead );
        }

        var onLineRead2 = function( source : streams.ILineReader, line : string ) {
            expect( source ).toBe( lineReader );
            linesRead += 1;
        }

        var onEofRead = function( source : streams.ILineReader ) {
            expect( source ).toBe( lineReader );
            expect( linesRead ).toEqual( expectedLines );
            lineReader.eofReadEvent.unregisterListener( onEofRead );
            lineReader.lineReadEvent.unregisterListener( onLineRead );
            done();
        }

        var check = function(
            initInput,
            initExpectedLines,
            initOnLineRead,
            initOnEofRead,
            initDone
        ) {
            // wrap the input with a line reader
            lineReader = streams.makeStringLineReader( initInput );

            // set the expectations
            expectedLines = initExpectedLines;
            done = initDone;

            // register for line events
            lineReader.lineReadEvent.registerListener( initOnLineRead );
            lineReader.eofReadEvent.registerListener( initOnEofRead );
        }

        beforeEach( function() {
            linesRead = 0;
        } );

        it( "Reads lines from a string", function( done : ()=>void ) {
            check( "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6\n", 6, onLineRead, onEofRead, done );
        } );

        it( "Reads lines from a string without final new line", function( done : ()=>void ) {
            check( "Line 1\nLine 2\nLine 3\nLine 4\nLine 5\nLine 6", 6, onLineRead, onEofRead, done );
        } );

        it( "Reads one line from a one line string", function( done : ()=>void ) {
            check( "Line 1", 1, onLineRead, onEofRead, done );
        } );

        it( "Reads lines from a string with some blank lines", function( done : ()=>void ) {
            check( "Line 1\n\n\nLine 4\n\nLine 6", 6, onLineRead2, onEofRead, done );
        } );

    } );


} );
