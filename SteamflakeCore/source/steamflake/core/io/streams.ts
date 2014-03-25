/**
 * Module: steamflake/core/io/streams
 */

///<reference path='../../../thirdparty/node.d.ts'/>

import events = require( '../utilities/events' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ILineReader {

    /** Event triggered after the end of the input has been reached. */
    eofReadEvent : events.IStatelessEvent<ILineReader>;

    /** Event triggered for each line read from some stream. */
    lineReadEvent : events.IStatefulEvent<ILineReader,string>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Abstract base class for line readers.
 */
class BaseLineReader
    implements ILineReader
{

    /**
     * Constructs a new line reader.
     */
    constructor() {
        this._eofReadEvent = events.makeStatelessEvent( this );
        this._lineReadEvent = events.makeStatefulEvent( this );
    }

    /** Event triggered after the end of the input has been reached. */
    public get eofReadEvent() {
        return this._eofReadEvent;
    }
    public set eofReadEvent( value : events.IStatelessEvent<ILineReader> ) {
        throw new Error( "Attempted to change read only event - eofReadEvent." );
    }

    /** Event triggered for each line read from some stream. */
    public get lineReadEvent() {
        return this._lineReadEvent;
    }
    public set lineReadEvent( value : events.IStatefulEvent<ILineReader,string> ) {
        throw new Error( "Attempted to change read only event - lineReadEvent." );
    }

    /** Event triggered after the end of the input has been reached. */
    private _eofReadEvent : events.IStatelessEvent<ILineReader>;

    /** Event triggered for each line read from some stream. */
    private _lineReadEvent : events.IStatefulEvent<ILineReader,string>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class that wraps a node.js readable stream to fire line-read events.
 */
class ReadableStreamLineReader
    extends BaseLineReader {

    /**
     * Constructs a new readable stream line reader.
     * @param inputStream The underlying stream to convert into lines.
     */
    constructor(
        inputStream : ReadableStream
    ) {

        super();

        this._line = '';

        this.readLines( inputStream );

    }

    /**
     * Establishes the event handling to read the stream and break it into individual lines.
     * @param inputStream
     */
    private readLines(
        inputStream : ReadableStream
    ) {

        var self = this;

        // responds to the reading of a chunk of data from the input stream
        var onData = function( chunkBuf : any ) {

            var chunk = chunkBuf.toString();

            var lineStart = 0;
            var lineEnd = chunk.indexOf( '\n', lineStart );
            while ( lineEnd >= 0 ) {
                self._line += chunk.substring( lineStart, lineEnd );

                self.lineReadEvent.trigger( self._line );

                self._line = '';
                lineStart = lineEnd + 1;
                lineEnd = chunk.indexOf( '\n', lineStart );
            }

            self._line = chunk.substring( lineStart );

        }

        // responds to the end of the input stream
        var onEnd = function() {

            if ( self._line.length > 0 ) {
                self.lineReadEvent.trigger( self._line );
                self._line = '';
            }

            self.eofReadEvent.trigger();

        }

        // establish the event handling to get lines read out
        inputStream.on( 'data', onData );
        inputStream.on( 'end', onEnd );

    }

    /** The latest fragment of a line read. */
    private _line : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new line reader that breaks a given readable stream into lines.
 * @param inputStream The input stream to read.
 */
export function makeReadableStreamLineReader( inputStream : ReadableStream ) : ILineReader {
    return new ReadableStreamLineReader( inputStream );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
