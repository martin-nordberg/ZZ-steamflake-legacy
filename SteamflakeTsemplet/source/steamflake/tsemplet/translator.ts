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

    /** The prefix for a line of directives (only at the top of the file). */
    directivePrefix : string;

    /** The indent to use for template output compared to the latest code indentation. */
    indent : string;

    /** The prefix for a line of template output. */
    templatePrefix : string;

}

/** The default configuration for a Tsemplet translator. */
var DEFAULT_TRANSLATOR_CONFIG = {
    codePrefix: '`',
    directivePrefix: '%Tsemplet ',
    indent: '    ',
    templatePrefix: ''
};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a translator state (a la GoF State pattern).
 */
interface ITranslatorState {

    /**
     * Processes one line of input.
     * @param line The input line to be translated.
     * @return The new translator state after processing the line.
     */
    process( line : string ) : ITranslatorState;

    /**
     * Processes the end of input (either end of file or end of a kind of input:directive/code/template) for
     * this translator state.
     */
    processEof();

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

    /** Determines the indentation to use for a newly started template segment. */
    public getTemplateIndentation() : string {
        return "";
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
            return this.processDirective( line.substring( this._config.directivePrefix.length ) )
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
        this.processEof();
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
     * Processes the end of input for this translator state.
     */
    public processEof() {
        // do nothing; override as needed
    }

    /**
     * Processes a line in a template.
     * @param templateLine The line of template out to process (stripped of its prefix).
     * @return {ITranslatorState} The next translator state.
     */
    public processTemplate( templateLine : string ) : ITranslatorState {

        this.processEof();

        // start a template translator indented from the last seen line of code
        return new TemplateTranslatorState(
            this.translator,
            this.config,
            this.getTemplateIndentation()
        ).processTemplate( templateLine );

    }

    /** The translator this state is for. */
    public get translator() {
        return this._translator;
    }

    /** The current configuration of this translator state. */
    private _config : TranslatorConfig;

    /** The translator we're the state of. */
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

    /** Determines the indentation to use for a newly started template segment - one indent from last seen code line. */
    public getTemplateIndentation() : string {
        return this._latestIndentation + this.config.indent;
    }

    /**
     * Emits a line of code unmodified from the input.
     * @param codeLine The code to emit.
     */
    public processCode( codeLine : string ) : ITranslatorState {

        // change the current indentation to match the actual line of code
        this._latestIndentation = codeLine.match( /^\s*/ )[0];

        // emit the line of code
        this.emitLine( codeLine );

        return this;

    }

    /** The indentation seen in the latest line of code. */
    private _latestIndentation : string;

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
        return line.lastIndexOf( this.config.directivePrefix, 0 ) === 0;
    }

    /**
     * Adjusts the translator configuration from the given directive line.
     * @param line The directive line to parse for new configuration.
     */
    public processDirective( line : string ) : ITranslatorState {

        // TBD: process directives into revised config ...

        return this;

    }

    /**
     * Processes a line in a template.
     * @param templateLine The line of template out to process (stripped of its prefix).
     * @return {ITranslatorState} The next translator state.
     */
    public processTemplate( templateLine : string ) : ITranslatorState {
        this.processEof();
        return new TemplateTranslatorState( this.translator, this.config, '' ).processTemplate( templateLine );
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
        config : TranslatorConfig,
        extraIndentation : string
    ) {
        super( translator, config );

        this._extraIndentation = extraIndentation;
        this._outputStarted = false;
    }

    /** Sends one line of output out through the translator; prepends the extra indentation for the template. */
    public emitLine( line : string ) {
        super.emitLine( this._extraIndentation + line );
    }

    /**
     * Processes the end of the template - closes up the prior template output.
     */
    public processEof() {
        this.emitLine( "return result;" );
    }

    /**
     * Processes a line of template output.
     * @param templateLine The input line of the template.
     */
    public processTemplate( templateLine : string ) : ITranslatorState {

        // declare or concatenate to the output variable
        var outputLine = "result += ";
        if ( !this._outputStarted ) {
            outputLine = "var result = ";
            this._outputStarted = true;
        }

        // TBD: split out ${} pieces as code ...

        if ( templateLine.indexOf( "'" ) < 0 ) {
            outputLine += "'" + templateLine + "';"
        }
        else if ( templateLine.indexOf( '"' ) < 0 ) {
            outputLine += '"' + templateLine + '";'
        }
        else {
            outputLine += "'" + templateLine.replace( "'", "\\'" ); + "';";
        }

        this.emitLine( outputLine );

        return this;

    }

    /** Current indentation to use for each emitted line. */
    private _extraIndentation : string;

    // flag telling whether the first line of template output has already been emitted
    private _outputStarted : boolean;

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

        // set the default configuration and start out looking for directive lines
        this._state = new DirectiveTranslatorState( this, DEFAULT_TRANSLATOR_CONFIG );

        // listen for input
        lineReader.lineReadEvent.registerListener( this.onReadLine.bind( this ) );
        lineReader.eofReadEvent.registerListener( this.onReadEof.bind( this ) );

    }

    /**
     * Responds to the end of the input.
     * @param source The source of the EOF event.
     */
    private onReadEof( source : ITsempletTranslator ) {
        this._state.processEof();
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

    /** The current state of this translator (directive/code/template). */
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
