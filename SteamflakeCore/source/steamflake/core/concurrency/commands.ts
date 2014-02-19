
/**
 * Module: steamflake/core/utilities/commands
 */

import promises = require( './promises' );
import values = require( '../utilities/values' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Enumeration of command execution states.
 */
export enum ECommandState {

    /** Not yet executed at all. */
    Created,

    /* Currently executing. */
    Executing,

    /** An attempted execution resulted in an exception. */
    Error,

    /** Executed and can be reversed. */
    ReadyToUndo,

    /** Executed, reversed, can be re-executed. */
    ReadyToRedo,

    /** Executed - not reversible. */
    Done,

    /** Executed and reversed, can not be re-executed. */
    Undone

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a reversible command action.
 */
export interface IReversibleCommand {

    /**
     * @returns A detailed description of this command. Note: read-only.
     */
    description : string;

    /**
     * Repeats the execution of this command after it has been undone.
     */
    redo() : promises.IPromise<values.ENothing>;

    /**
     * The current status of this command. Note: read-only.
     */
    state : ECommandState;

    /**
     * @returns A brief (generic) description of this command. Note: read-only.
     */
    title : string;

    /**
     * Reverts the execution of this command.
     */
    undo() : promises.IPromise<values.ENothing>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a reversible command action with an initiating action that returns a typed value.
 */
export interface ICommand<T>
    extends IReversibleCommand
{

    /**
     * Executes this command.
     * @returns The promise of an arbitrary value resulting from the command execution.
     */
    do() : promises.IPromise<T>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a queue of completed command actions.
 */
export interface ICommandHistory {

    /** Whether there is an undone command that can be redone. Note: read-only. */
    canRedo : boolean;

    /** Whether the last command can be undone. Note: read-only. */
    canUndo : boolean;

    /** Whether a command is currently executing. Note: read-only. */
    isExecutingCommand : boolean;

    /**
     * Adds a command to this history; executes it [do()] after any already queued commands are done.
     */
    queue<T>( command : ICommand<T> ) : promises.IPromise<T>;

    /**
     * Redoes the last undone command.
     */
    redo() : promises.IPromise<values.ENothing>;

    /**
     * Undoes the last command (or the last command not already undone).
     */
    undo() : promises.IPromise<values.ENothing>;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A no-op history of completed command actions.
 */
class NullCommandHistory
    implements ICommandHistory
{

    /** Whether there is an undone command that can be redone. */
    public get canRedo() : boolean {
        return false;
    }
    public set canRedo( value : boolean ) {
        throw new Error( "Attempted to set read-only attribute: canRedo." );
    }

    /** Whether the last command can be undone. */
    public get canUndo() : boolean {
        return false;
    }
    public set canUndo( value : boolean ) {
        throw new Error( "Attempted to set read-only attribute: canUndo." );
    }

    /** Whether a command is currently executing. Note: read-only. */
    public get isExecutingCommand() : boolean {
        return this._isExecutingCommand;
    }
    public set isExecutingCommand( value : boolean ) {
        throw new Error( "Attempted to set read-only attribute: isExecutingCommand." );
    }

    /**
     * Adds a command to this history; immediately executes it
     */
    public queue<T>( command : ICommand<T> ) : promises.IPromise<T> {

        var self = this;

        /**
         * Tracks the execution state.
         */
        function maintainHistory( value : T ) {
            self._isExecutingCommand = false;
            return value;
        }

        /**
         * Tracks execution state after an error.
         */
        function handleError( reason : any ) {
            self._isExecutingCommand = false;
            return reason;
        }

        /**
         * Executes the command
         */
        function doCommand( value : values.ENothing ) {
            self._isExecutingCommand = true;
            command.do().then( maintainHistory, handleError );
            return values.nothing;
        }

        promises.makeImmediatelyFulfilledPromise( values.nothing ).then( doCommand );

        return command.do().then( maintainHistory, handleError );
    }

    /**
     * Redoes the last undone command.
     */
    public redo() : promises.IPromise<values.ENothing> {
        throw new Error( "Illegal command history state: nothing to redo" );
    }

    /**
     * Undoes the last command (or the last command not already undone).
     */
    public undo() : promises.IPromise<values.ENothing> {
        throw new Error( "Illegal command history state: nothing to undo" );
    }

    private _isExecutingCommand = false;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * A general purpose history of completed command actions.
 */
class CommandHistory
    implements ICommandHistory
{

    constructor( maxUndoCount : number ) {
        this._doneCommands = [];
        this._maxUndoCount = maxUndoCount;
        this._queue = promises.makeImmediatelyFulfilledPromise( values.nothing );
        this._queuedCommandCount = 0;
        this._undoneCommands = [];
    }

    /** Whether there is an undone command that can be redone. */
    public get canRedo() : boolean {
        var result = this._undoneCommands.length > 0;
        result = result && this._undoneCommands[this._undoneCommands.length-1].state === ECommandState.ReadyToRedo;
        return result;
    }
    public set canRedo( value : boolean ) {
        throw new Error( "Attempted to set read-only attribute: canRedo." );
    }

    /** Whether the last command can be undone. */
    public get canUndo() : boolean {
        var result = this._doneCommands.length > 0;
        result = result && this._doneCommands[this._doneCommands.length-1].state === ECommandState.ReadyToUndo;
        result = result && this._queuedCommandCount === 0;
        return result;
    }
    public set canUndo( value : boolean ) {
        throw new Error( "Attempted to set read-only attribute: canUndo." );
    }

    /** Whether a command is currently executing. Note: read-only. */
    public get isExecutingCommand() : boolean {
        return this._isExecutingCommand;
    }
    public set isExecutingCommand( value : boolean ) {
        throw new Error( "Attempted to set read-only attribute: isExecutingCommand." );
    }

    /**
     * Adds a command to this history; immediately executes it
     */
    public queue<T>( command : ICommand<T> ) : promises.IPromise<T> {

        var self = this;
        var result = promises.makePromise<T>();

        // count the commands waiting
        self._queuedCommandCount += 1;

        // cannot undo after backtracking and starting a new trail
        self._undoneCommands = [];

        /**
         * Puts a successfully completed command into the undo stack.
         * @param value The value returned by the command.
         */
        function maintainHistory( value : T ) {
            self._isExecutingCommand = false;
            self._queuedCommandCount -= 1;
            if ( command.state === ECommandState.ReadyToUndo ) {
                self._doneCommands.push( command );
                if ( self._doneCommands.length > self._maxUndoCount ) {
                    self._doneCommands.slice( 0, 1 );
                }
            }
            else {
                self._doneCommands = [];
            }
            result.fulfill( value );
            return values.nothing;
        }

        /**
         * Handles a failed command
         * @param reason The reason for failure.
         */
        function handleError( reason : any ) {
            self._isExecutingCommand = false;
            self._queuedCommandCount = 0;
            self._doneCommands = [];
            self._undoneCommands = [];
            result.reject( reason );
            return reason;
        }

        /**
         * Executes the command
         */
        function doCommand( value : values.ENothing ) {
            self._isExecutingCommand = true;
            command.do().then( maintainHistory, handleError );
            return values.nothing;
        }

        // queue the command behind any that are in progress
        if ( self._queuedCommandCount > 1 ) {
            self._queue = self._queue.then( doCommand, handleError );
        }
        else {
            self._queue = promises.makeImmediatelyFulfilledPromise( values.nothing ).then( doCommand );
        }

        return result;

    }

    /**
     * Redoes the last undone command.
     */
    public redo() : promises.IPromise<values.ENothing> {

        var self = this;

        if ( !self.canRedo ) {
            throw new Error( "Illegal command history state: nothing to redo" );
        }

        var result = promises.makePromise<values.ENothing>();

        // count the commands waiting
        self._queuedCommandCount += 1;

        // get the command to redo
        var command = self._undoneCommands.pop();

        /**
         * Puts a successfully completed command into the undo stack.
         */
        function maintainHistory( value : values.ENothing ) {
            self._isExecutingCommand = false;
            self._queuedCommandCount -= 1;
            if ( command.state === ECommandState.ReadyToUndo ) {
                self._doneCommands.push( command );
            }
            else {
                self._doneCommands = [];
            }
            result.fulfill( values.nothing );
            return values.nothing;
        }

        /**
         * Handles a failed command
         * @param reason The reason for failure.
         */
        function handleError( reason : any ) {
            self._isExecutingCommand = false;
            self._queuedCommandCount = 0;
            self._doneCommands = [];
            self._undoneCommands = [];
            result.reject( reason );
            return reason;
        }

        /**
         * Re-executes the command
         */
        function redoCommand( value : values.ENothing ) {
            self._isExecutingCommand = true;
            command.redo().then( maintainHistory, handleError );
            return values.nothing;
        }

        // queue the command behind any that are in progress
        if ( self._queuedCommandCount > 1 ) {
            self._queue = self._queue.then( redoCommand, handleError );
        }
        else {
            self._queue = promises.makeImmediatelyFulfilledPromise( values.nothing ).then( redoCommand );
        }

        return result;

    }

    /**
     * Undoes the last command (or the last command not already undone).
     */
    public undo() : promises.IPromise<values.ENothing> {

        var self = this;

        if ( !self.canUndo ) {
            throw new Error( "Illegal command history state: nothing to undo" );
        }

        var result = promises.makePromise<values.ENothing>();

        // count the commands waiting
        self._queuedCommandCount += 1;

        // get the command to undo
        var command = self._doneCommands.pop();

        /**
         * Puts a successfully completed command into the undo stack.
         */
        function maintainHistory( value : values.ENothing ) {
            self._isExecutingCommand = false;
            self._queuedCommandCount -= 1;
            if ( command.state === ECommandState.ReadyToRedo ) {
                self._undoneCommands.push( command );
            }
            else {
                self._undoneCommands = [];
            }
            result.fulfill( values.nothing );
            return values.nothing;
        }

        /**
         * Handles a failed command
         * @param reason The reason for failure.
         */
        function handleError( reason : any ) {
            self._isExecutingCommand = false;
            self._queuedCommandCount = 0;
            self._doneCommands = [];
            self._undoneCommands = [];
            result.reject( reason );
            return reason;
        }

        /**
         * Unexecutes the command
         */
        function undoCommand( value : values.ENothing ) {
            self._isExecutingCommand = true;
            command.undo().then( maintainHistory, handleError );
            return values.nothing;
        }

        // queue the command behind any that are in progress
        if ( self._queuedCommandCount > 1 ) {
            self._queue = self._queue.then( undoCommand, handleError );
        }
        else {
            self._queue = promises.makeImmediatelyFulfilledPromise( values.nothing ).then( undoCommand );
        }

        return result;

    }

  ////

    private _doneCommands : IReversibleCommand[];

    private _isExecutingCommand = false;

    private _maxUndoCount : number;

    private _queue : promises.IPromise<values.ENothing>;

    private _queuedCommandCount : number;

    private _undoneCommands : IReversibleCommand[];

}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Creates a do-nothing command history. */
export function makeNullCommandHistory() : ICommandHistory {
    return new NullCommandHistory();
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Creates a general purpose command history. */
export function makeCommandHistory( maxUndoCount : number ) : ICommandHistory {
    return new CommandHistory( maxUndoCount );
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
