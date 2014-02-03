/**
 * Module: steamflake/core/utilities/commands
 */

import commands = require( './commands' );

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
        this._state = commands.CommandState.Created;
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
    do() : T {
        if ( this._state != commands.CommandState.Created ) {
            throw new Error( "Illegal command state." );
        }

        try {
            var result = this.execute();

            if ( this._undoable ) {
                this._state = commands.CommandState.ReadyToUndo;
            }
            else {
                this._state = commands.CommandState.Done;
            }

            return result;
        }
        catch ( e ) {
            this._state = commands.CommandState.Error;
            throw e;
        }
    }

    /**
     * Executes this command for the first time.
     * @returns An arbitrary value resulting from the command execution.
     */
    execute() : T {
        throw new Error( "Abstract method 'execute' must be overridden by derived class." );
    }

    /**
     * Repeats the execution of this command after it has been undone.
     */
    redo() : void {
        if ( this._state != commands.CommandState.ReadyToRedo ) {
            throw new Error( "Illegal command state." );
        }

        try {
            this.reexecute();

            if ( this._undoable ) {
                this._state = commands.CommandState.ReadyToUndo;
            }
            else {
                this._state = commands.CommandState.Done;
            }
        }
        catch ( e ) {
            this._state = commands.CommandState.Error;
            throw e;
        }
    }

    /**
     * Executes this command after it has been undone at least once.
     * @returns An arbitrary value resulting from the command execution.
     */
    reexecute() : void {
        this.execute();
    }

    /**
     * The current status of this command.
     */
    state() : commands.CommandState {
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
    undo() : void {
        if ( this._state != commands.CommandState.ReadyToUndo ) {
            throw new Error( "Illegal command state." );
        }

        try {
            this.unexecute();

            if ( this._redoable ) {
                this._state = commands.CommandState.ReadyToRedo;
            }
            else {
                this._state = commands.CommandState.Undone;
            }
        }
        catch ( e ) {
            this._state = commands.CommandState.Error;
            throw e;
        }
    }

    /**
     * Reverse the previous execution of this command.
     */
    unexecute() : void {
        throw new Error( "Abstract method 'unexecute' must be overridden by derived class." );
    }

    /** A longer description of this command. */
    private _description : string;

    /** Whether this command is redoable once undone. */
    private _redoable : boolean;

    /** The current status of this command. */
    private _state : commands.CommandState;

    /** The title of this command. */
    private _title : string;

    /** Whether this command is undoable. */
    private _undoable : boolean = true;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

