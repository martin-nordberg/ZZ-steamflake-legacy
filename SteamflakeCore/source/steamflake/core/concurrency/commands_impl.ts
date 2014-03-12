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
    public get description() : string {
        return this._description;
    }
    public set description( value : string ) {
        throw new Error( "Attempted to change read only attribute - description." );
    }

    /**
     * Executes this command.
     * @returns An arbitrary value resulting from the command execution.
     */
    public do() : promises.IPromise<T> {

        var self = this;

        if ( self._state != commands.ECommandState.Created ) {
            return promises.makeImmediatelyRejectedPromise<T>( "Illegal command state." );
        }

        self._state = commands.ECommandState.Executing;

        var result = self.execute();

        /** Callback updates the state of this command after execution. */
        var updateCommandState = function( value : T ) {
            if ( self._undoable ) {
                self._state = commands.ECommandState.ReadyToUndo;
            }
            else {
                self._state = commands.ECommandState.Done;
            }
            return value;
        }

        /** Callback updates the state of this command after an error. */
        var errorCommandState = function( reason : any ) {
            self._state = commands.ECommandState.Error;
            return reason;
        }

        return result.then( updateCommandState, errorCommandState );
    }

    /**
     * Repeats the execution of this command after it has been undone.
     */
    public redo() : promises.IPromise<values.ENothing> {

        var self = this;

        if ( self._state != commands.ECommandState.ReadyToRedo ) {
            return promises.makeImmediatelyRejectedPromise<values.ENothing>( "Illegal command state." );
        }

        self._state = commands.ECommandState.Executing;

        var result = self.reexecute();

        /** Callback updates the state of this command after re-execution. */
        var updateCommandState = function( value : values.ENothing ) {
            if ( self._undoable ) {
                self._state = commands.ECommandState.ReadyToUndo;
            }
            else {
                self._state = commands.ECommandState.Done;
            }
            return values.nothing;
        }

        /** Callback updates the state of this command after an error. */
        var errorCommandState = function( reason : any ) {
            self._state = commands.ECommandState.Error;
            return reason;
        }

        return result.then( updateCommandState, errorCommandState );

    }

    /**
     * The current status of this command.
     */
    public get state() : commands.ECommandState {
        return this._state;
    }
    public set state( value : commands.ECommandState ) {
        throw new Error( "Attempted to change read only attribute - state." );
    }

    /**
     * @returns A brief (generic) description of this command.
     */
    public get title() : string {
        return this._title;
    }
    public set title( value : string ) {
        throw new Error( "Attempted to change read only attribute - title." );
    }

    /**
     * Reverts the execution of this command.
     */
    public undo() : promises.IPromise<values.ENothing> {

        var self = this;

        if ( self._state != commands.ECommandState.ReadyToUndo ) {
            return promises.makeImmediatelyRejectedPromise<values.ENothing>( "Illegal command state." );
        }

        self._state = commands.ECommandState.Executing;

        var result = self.unexecute();

        /** Callback updates the state of this command after un-execution. */
        var updateCommandState = function( value : values.ENothing ) {
            if ( self._redoable ) {
                self._state = commands.ECommandState.ReadyToRedo;
            }
            else {
                self._state = commands.ECommandState.Undone;
            }
            return values.nothing;
        }

        /** Callback updates the state of this command after an error. */
        var errorCommandState = function( reason : any ) {
            self._state = commands.ECommandState.Error;
            return reason;
        }

        return result.then( updateCommandState, errorCommandState );
    }

  ////

    /**
     * Executes this command for the first time.
     * @returns An arbitrary value resulting from the command execution.
     */
    public/*protected*/ execute() : promises.IPromise<T> {
        throw new Error( "Abstract method 'execute' must be overridden by derived class." );
    }

    /**
     * Executes this command after it has been undone at least once.
     * @returns An arbitrary value resulting from the command execution.
     */
    public/*protected*/ reexecute() : promises.IPromise<values.ENothing> {

        var ignore = function( value : T ) {
            return values.nothing;
        }

        return this.execute().then( ignore );
    }

    /**
     * Reverse the previous execution of this command.
     */
    public/*protected*/ unexecute() : promises.IPromise<values.ENothing> {
        throw new Error( "Abstract method 'unexecute' must be overridden by derived class." );
    }

  ////

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

