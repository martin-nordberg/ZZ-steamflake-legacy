/**
 * Module: steamflake/core/io/streams
 */

///<reference path='../../../../../ThirdParty/lib/server/node.d.ts'/>

import events = require( '../utilities/events' );
import platform = require( '../platform/platform' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ILineReader {

    /** Event triggered after the end of the input has been reached. */
    eofReadEvent : events.IStatelessEvent<ILineReader>;

    /** Event triggered for each line read from some stream. */
    lineReadEvent : events.IStatefulEvent<ILineReader,string>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Abstract base class for line readers.
 */
export class AbstractLineReader
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
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class that wraps a node.js readable stream to fire line-read events.
 */
class ReadableStreamLineReader
    extends AbstractLineReader
{

    /**
     * Constructs a new readable stream line reader.
     * @param inputStream The underlying stream to convert into lines.
     */
    constructor(
        inputStream : ReadableStream
    ) {

        super();

        this._line = '';

        // establish the event handling to get lines read out
        inputStream.on( 'data', this.onStreamData.bind( this ) );
        inputStream.on( 'end', this.onStreamEnd.bind( this ) );

    }

    /**
     * Responds to the reading of the end of the stream.
     */
    private onStreamEnd() {

        if ( this._line.length > 0 ) {
            this.lineReadEvent.trigger( this._line );
            this._line = '';
        }

        this.eofReadEvent.trigger();

    }

    /**
     * Responds to the reading of one chunk of data from the stream.
     * @param chunkBuf A buffer of data read.
     */
    private onStreamData( chunkBuf : any ) {

        var chunk = chunkBuf.toString();

        var lineStart = 0;
        var lineEnd = chunk.indexOf( '\n', lineStart );
        while ( lineEnd >= 0 ) {
            this._line += chunk.substring( lineStart, lineEnd );

            this.lineReadEvent.trigger( this._line );

            this._line = '';
            lineStart = lineEnd + 1;
            lineEnd = chunk.indexOf( '\n', lineStart );
        }

        this._line = chunk.substring( lineStart );

    }

    /** The latest fragment of a line read. */
    private _line : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class that wraps a string to fire line-read events.
 */
class StringLineReader
    extends AbstractLineReader
{

    /**
     * Constructs a new readable stream line reader.
     * @param inputString The underlying string to convert into lines.
     */
    constructor(
        inputString : string
    ) {

        super();

        // emit the lines and eof when next idle
        platform.doWhenIdle( this.readLines.bind( this, inputString ) );

    }

    /**
     * Reads the string, breaks it into lines, triggers events for each line and eof.
     * @param inputString The input string to break into lines.
     */
    private readLines( inputString : string ) {

        var lineStart = 0;
        var lineEnd = inputString.indexOf( '\n', lineStart );

        while ( lineEnd >= 0 ) {
            var line = inputString.substring( lineStart, lineEnd );

            this.lineReadEvent.trigger( line );

            line = '';
            lineStart = lineEnd + 1;
            lineEnd = inputString.indexOf( '\n', lineStart );
        }

        line = inputString.substring( lineStart );

        if ( line.length > 0 ) {
            this.lineReadEvent.trigger( line );
        }

        this.eofReadEvent.trigger();
    }

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

/**
 * Constructs a new line reader that breaks a given string into lines.
 * @param inputString The input string to read.
 */
export function makeStringLineReader( inputString : string ) : ILineReader {
    return new StringLineReader( inputString );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
