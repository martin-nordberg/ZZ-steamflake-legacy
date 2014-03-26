/**
 * Module: steamflake/tsemplet/translator
 */

import streams = require( '../../../../SteamflakeCore/source/steamflake/core/io/streams' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

export interface ITsempletTranslator
    extends streams.ILineReader {

    // TBD: translation error event(s)

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Class representing a Tsemplet translator. Takes input from a line reader and provides a line reader of the
 * translated output.
 */
class TsempletTranslator
    extends streams.AbstractLineReader
    implements ITsempletTranslator
{

    /**
     * Constructs a new translator for given line-oriented input.
     * @param lineReader The input to be translated.
     */
    constructor(
        lineReader : streams.ILineReader
    ) {
        super();

        lineReader.lineReadEvent.registerListener( this.onReadLine.bind( this ) );
        lineReader.eofReadEvent.registerListener( this.onReadEof.bind( this ) );
    }

    /**
     * Responds to the end of the input.
     * @param source The source of the EOF event.
     */
    private onReadEof( source : ITsempletTranslator ) {
        this.eofReadEvent.trigger();
    }

    /**
     * Responds to the reading of one line of input.
     * @param source The source of the line-read event.
     * @param line The line of input to be translated.
     */
    private onReadLine( source : ITsempletTranslator, line : string ) {
        // TBD: do the translation here
        this.lineReadEvent.trigger( line );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Constructs a new Tsemplet translator.
 * @param lineReader
 * @returns {TsempletTranslator}
 */
export function makeTsempletTranslator( lineReader : streams.ILineReader ) : ITsempletTranslator {
    return new TsempletTranslator( lineReader );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
