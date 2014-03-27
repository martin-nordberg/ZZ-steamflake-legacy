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
 * Configuration of a tsemplet translator.
 */
interface TranslatorConfig {

    /** The prefix designating a line of code. */
    codePrefix : string;

    /** The prefix for a line of template output. */
    templatePrefix : string;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a translator state (a la GoF State pattern).
 */
interface ITranslatorState {

    /**
     * Processes one line of input.
     * @param line The input
     * @return The new translator state.
     */
    process( line : string ) : ITranslatorState;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Base class for translator states.
 * Distinguishes directive, code, and template lines. Tracks the state of the translator.
 */
class AbstractTranslatorState
    implements ITranslatorState {

    /**
     * Constructs a new translator state.
     * @param translator The outer translator.
     * @param config The code and template prefixes to use.
     */
    constructor(
        translator : ITsempletTranslator,
        config : TranslatorConfig
    ) {
        this._translator = translator;
        this._config = config;
    }

    /** The configuration of the translator. */
    public get config() {
        return this._config;
    }

    /** Sends one line of output out through the translator. */
    public emitLine( line : string ) {
        this._translator.lineReadEvent.trigger( line );
    }

    /**
     * Determines whether a given line is code (starts with the code prefix).
     * @param line The line to test.
     */
    public isCode( line : string ) : boolean {
        return line.lastIndexOf( this._config.codePrefix, 0 ) === 0;
    }

    /**
     * Determines whether a given line is a Tsemplet directive line.
     * @param line The line to test.
     */
    public isDirective( line : string ) : boolean {
        return false;
    }

    /**
     * Determines whether a given line is part of template output (starts with the template prefix)..
     * @param line The line to test.
     */
    public isTemplate( line : string ) : boolean {
        return line.lastIndexOf( this._config.templatePrefix, 0 ) === 0;
    }

    /**
     * Processes one line of input; determines the next state of the translator.
     * @param line The line of input to process.
     * @return {ITranslatorState} The next translator state.
     */
    public process( line : string ) : ITranslatorState {
        if ( this.isDirective( line ) ) {
            return this.processDirective( line )
        }
        else if ( this.isCode( line ) ) {
            return this.processCode( line.substring( this._config.codePrefix.length ) );
        }
        else if ( this.isTemplate( line ) ) {
            return this.processTemplate( line.substring( this._config.templatePrefix.length ) );
        }
        else {
            // TBD: error handling
            return this;
        }
    }

    /**
     * Processes a line of code.
     * @param codeLine The line of code to process (stripped of its prefix).
     * @return {ITranslatorState} The next translator state.
     */
    public processCode( codeLine : string ) : ITranslatorState {
        return new CodeTranslatorState( this.translator, this.config ).processCode( codeLine );
    }

    /**
     * Processes a directive line.
     * @param line The directive line.
     */
    public processDirective( line : string ) : ITranslatorState {
        throw new Error( "Operation must be overridden by derived class: processDirective." );
    }

    /**
     * Processes a line in a template.
     * @param templateLine The line of template out to process (stripped of its prefix).
     * @return {ITranslatorState} The next translator state.
     */
    public processTemplate( templateLine : string ) : ITranslatorState {
        return new TemplateTranslatorState( this.translator, this.config ).processTemplate( templateLine );
    }

    /** The translator this state is for. */
    public get translator() {
        return this._translator;
    }

    private _config : TranslatorConfig;

    private _translator : ITsempletTranslator;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Translator state for processing code lines.
 */
class CodeTranslatorState
    extends AbstractTranslatorState {

    /**
     * Constructs a new translator state.
     * @param translator The translator.
     * @param config The configuration of the translator.
     */
    constructor(
        translator : ITsempletTranslator,
        config : TranslatorConfig
    ) {
        super( translator, config );
    }

    /**
     * Emits a line of code unmodified from the input.
     * @param codeLine The code to emit.
     */
    public processCode( codeLine : string ) : ITranslatorState {
        this.emitLine( codeLine );
        return this;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Translator state for parsing directive lines.
 */
class DirectiveTranslatorState
    extends AbstractTranslatorState {

    /**
     * Constructs a new translator state.
     * @param translator The translator.
     * @param config The configuration of the translator.
     */
    constructor(
        translator : ITsempletTranslator,
        config : TranslatorConfig
    ) {
        super( translator, config );
    }

    /**
     * Determines whether a given line is a Tsemplet directive.
     * @param line The line to check.
     */
    public isDirective( line : string ) : boolean {
        return line.substring( 0, 9 ) === '%Tsemplet';
    }

    /**
     * Adjusts the translator configuration from the given directive line.
     * @param line The directive line to parse for new configuration.
     */
    public processDirective( line : string ) : ITranslatorState {
        // TBD: process directives into revised config ...

        return this;
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Translator state for handling lines of template output.
 */
class TemplateTranslatorState
    extends AbstractTranslatorState {

    /**
     * Constructs a new translator state.
     * @param translator The translator.
     * @param config The configuration of the translator.
     */
    constructor(
        translator : ITsempletTranslator,
        config : TranslatorConfig
    ) {
        super( translator, config );
    }

    /**
     * Processes a line of code - closes up the prior template output, then forwards to a new code translator.
     * @param codeLine
     */
    public processCode( codeLine : string ) : ITranslatorState {
        // TBD: return the string result ...

        return new CodeTranslatorState( this.translator, this.config ).processCode( codeLine );
    }

    /**
     * Processes a line of template output.
     * @param templateLine The input line of the template.
     */
    public processTemplate( templateLine : string ) : ITranslatorState {
        // TBD: wrap the template pieces in a string concatenation sequence ...
        // TBD: split out ${} pieces as code ...
        this.emitLine( templateLine );

        return this;
    }

    // TBD: boolean to flag the first line of output needing start of join
}

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

        this._state = new DirectiveTranslatorState( this, { codePrefix: "`", templatePrefix: "" } );

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
        this._state = this._state.process( line );
    }

    private _state : ITranslatorState;

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
