/**
 * Module: steamflake/core/utilities/commands
 */

import commands = require( './commands' );
import promises = require( './promises' );
import values = require( '../utilities/values' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Abstract base command with template methods for command execution.
 */
export class AbstractCommand<T>
    implements commands.ICommand<T>
{
    /**
     * Constructs a new abstract command.
     * @param title The title of the command.
     * @param description A description of the command.
     * @param undoable Whether the command is undoable.
     * @param redoable Whether the command is redoable.
     */
    constructor(
        title : string,
        description : string,
        undoable : boolean = true,
        redoable : boolean = true
    ) {
        this._description = description;
        this._redoable = redoable;
        this._state = commands.ECommandState.Created;
        this._title = title;
        this._undoable = undoable;
    }

    /**
     * @returns A detailed description of this command.
     */
    description() : string {
        return this._description;
    }

    /**
     * Executes this command.
     * @returns An arbitrary value resulting from the command execution.
     */
    do() : promises.IPromise<T> {
        if ( this._state != commands.ECommandState.Created ) {
            throw new Error( "Illegal command state." );
        }

        try {
            var result = this.execute();

            if ( this._undoable ) {
                this._state = commands.ECommandState.ReadyToUndo;
            }
            else {
                this._state = commands.ECommandState.Done;
            }

            return result;
        }
        catch ( e ) {
            this._state = commands.ECommandState.Error;
            throw e;
        }
    }

    /**
     * Executes this command for the first time.
     * @returns An arbitrary value resulting from the command execution.
     */
    execute() : promises.IPromise<T> {
        throw new Error( "Abstract method 'execute' must be overridden by derived class." );
    }

    /**
     * Repeats the execution of this command after it has been undone.
     */
    redo() : promises.IPromise<values.ENothing> {

        if ( this._state != commands.ECommandState.ReadyToRedo ) {
            return promises.makeImmediatelyRejectedPromise<values.ENothing>( "Illegal command state." );
        }

        var result = this.reexecute();

        /** Callback updates the state of this command after reeexecution. */
        function updateCommandState( value : T ) {
            if ( this._undoable ) {
                this._state = commands.ECommandState.ReadyToUndo;
            }
            else {
                this._state = commands.ECommandState.Done;
            }
            return values.nothing;
        }

        /** Callback updates the state of this command after an error. */
        function errorCommandState( reason : any ) {
            this._state = commands.ECommandState.Error;
            return reason;
        }

        return result.then( updateCommandState, errorCommandState );

    }

    /**
     * Executes this command after it has been undone at least once.
     * @returns An arbitrary value resulting from the command execution.
     */
    reexecute() : promises.IPromise<T> {
        return this.execute();
    }

    /**
     * The current status of this command.
     */
    state() : commands.ECommandState {
        return this._state;
    }

    /**
     * @returns A brief (generic) description of this command.
     */
    title() : string {
        return this._title;
    }

    /**
     * Reverts the execution of this command.
     */
    undo() : promises.IPromise<values.ENothing> {

        if ( this._state != commands.ECommandState.ReadyToUndo ) {
            return promises.makeImmediatelyRejectedPromise<values.ENothing>( "Illegal command state." );
        }

        var result = this.unexecute();

        function updateCommandState( value : values.ENothing ) {
            if ( this._redoable ) {
                this._state = commands.ECommandState.ReadyToRedo;
            }
            else {
                this._state = commands.ECommandState.Undone;
            }
            return values.nothing;
        }

        function errorCommandState( reason : any ) {
            this._state = commands.ECommandState.Error;
            return reason;
        }

        return result.then( updateCommandState, errorCommandState );
    }

    /**
     * Reverse the previous execution of this command.
     */
    unexecute() : promises.IPromise<values.ENothing> {
        throw new Error( "Abstract method 'unexecute' must be overridden by derived class." );
    }

    /** A longer description of this command. */
    private _description : string;

    /** Whether this command is redoable once undone. */
    private _redoable : boolean;

    /** The current status of this command. */
    private _state : commands.ECommandState;

    /** The title of this command. */
    private _title : string;

    /** Whether this command is undoable. */
    private _undoable : boolean = true;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

