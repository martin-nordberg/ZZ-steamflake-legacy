/**
 * Spec Module: steamflake/tsemplet/translator
 */

///<reference path='../../../../SteamflakeCore/source/thirdparty/node.d.ts'/>
///<reference path='../../../../SteamflakeCore/specs/thirdparty/jasmine/jasmine.d.ts'/>

import streams = require( '../../../../SteamflakeCore/source/steamflake/core/io/streams' );
import translator = require( '../../../source/steamflake/tsemplet/translator' );

describe( "Translator", function() {

    describe( "Simple Translations", function() {
        var expectedLineCount : number;
        var expectedLines : string[];
        var lineReader;
        var linesRead;
        var done;

        var onLineRead = function( source : streams.ILineReader, line : string ) {
            expect( source ).toBe( lineReader );
            expect( line ).toEqual( expectedLines[linesRead] );
            linesRead += 1;
        }

        var onEofRead = function( source : streams.ILineReader ) {
            expect( source ).toBe( lineReader );
            expect( linesRead ).toEqual( expectedLineCount );
            lineReader.eofReadEvent.unregisterListener( onEofRead );
            lineReader.lineReadEvent.unregisterListener( onLineRead );
            done();
        }

        var check = function(
            initInput,
            initOnLineRead,
            initOnEofRead,
            initExpectedLineCount,
            initExpectedLines,
            initDone
        ) {
            // wrap the input with a line reader and translator
            lineReader = streams.makeStringLineReader( initInput );
            lineReader = translator.makeTsempletTranslator( lineReader );

            // set the expectations
            expectedLineCount = initExpectedLineCount;
            expectedLines = initExpectedLines;
            done = initDone;

            // register for line events
            lineReader.lineReadEvent.registerListener( initOnLineRead );
            lineReader.eofReadEvent.registerListener( initOnEofRead );
        }

        beforeEach( function() {
            linesRead = 0;
        } );

        it( "Translates simple default code", function( done : ()=>void ) {
            check(
                "`Line 1\n`Line 2\n`\n`Line 4\n`\n`Line 6",
                onLineRead,
                onEofRead,
                6,
                [ "Line 1", "Line 2", "", "Line 4", "", "Line 6" ],
                done
            );
        } );

        it( "Translates a simple template within simple code", function( done : ()=>void ) {
            check(
                "`function returnStuff() {\nstuff\nand more stuff\n`}\n",
                onLineRead,
                onEofRead,
                5,
                [ "function returnStuff() {", "    var result = 'stuff';", "    result += 'and more stuff';", "    return result;", "}" ],
                done
            );
        } );

        it( "Translates a simple template within indented code", function( done : ()=>void ) {
            check(
                "`  function returnStuff() {\nstuff\nand more stuff\n`  }\n",
                onLineRead,
                onEofRead,
                5,
                [ "  function returnStuff() {", "      var result = 'stuff';", "      result += 'and more stuff';", "      return result;", "  }" ],
                done
            );
        } );

        it( "Translates a template with single quotation marks", function( done : ()=>void ) {
            check(
                "`  function returnStuff() {\nst'uff\nand 'more' stuff\n`  }\n",
                onLineRead,
                onEofRead,
                5,
                [ "  function returnStuff() {", "      var result = \"st'uff\";", "      result += \"and 'more' stuff\";", "      return result;", "  }" ],
                done
            );
        } );

        it( "Translates a template with double quotation marks", function( done : ()=>void ) {
            check(
                "`  function returnStuff() {\nst\"uff\nand \"more\" stuff\n`  }\n",
                onLineRead,
                onEofRead,
                5,
                [ "  function returnStuff() {", "      var result = 'st\"uff';", "      result += 'and \"more\" stuff';", "      return result;", "  }" ],
                done
            );
        } );

        it( "Translates a template with single and double quotation marks", function( done : ()=>void ) {
            check(
                "`  function returnStuff() {\n'st\"uff'\nand \'more\' \"stuff\"\n`  }\n",
                onLineRead,
                onEofRead,
                5,
                [ "  function returnStuff() {", "      var result = '\\'st\"uff\\'';", "      result += 'and \\'more\\' \"stuff\"';", "      return result;", "  }" ],
                done
            );
        } );

        it( "Translates a template with a simple slot", function( done : ()=>void ) {
            check(
                "`  function returnStuff() {\nstuff\nand ${more} stuff\n`  }\n",
                onLineRead,
                onEofRead,
                7,
                [
                    "  function returnStuff() {",
                    "      var result = 'stuff';",
                    "      result += 'and ';",
                    "      result += more;",
                    "      result += ' stuff';",
                    "      return result;",
                    "  }" ],
                done
            );
        } );

    } );

} );
