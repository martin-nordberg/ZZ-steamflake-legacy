
/**
 * Module: steamflake/core/utilities/commands
 */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Enumeration of command execution states.
 */
export enum CommandState {

    /** Not yet executed at all. */
    Created,

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
 * Interface to a general reversible command action.
 */
export interface IReversibleCommand {

    /**
     * @returns A detailed description of this command.
     */
    description() : string;

    /**
     * Repeats the execution of this command after it has been undone.
     */
    redo() : void;

    /**
     * The current status of this command.
     */
    state() : CommandState;

    /**
     * @returns A brief (generic) description of this command.
     */
    title() : string;

    /**
     * Reverts the execution of this command.
     */
    undo() : void;

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
     * @returns An arbitrary value resulting from the command execution.
     */
    do() : T;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/**
 * Interface to a queue of completed command actions.
 */
export interface ICommandHistory {

    /**
     * Adds a command to this history.
     */
    add( command : IReversibleCommand ) : void;

    // TBD: undo, redo, max depth, etc.

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/** Creates a do-nothing command history. */
export var makeNullCommandHistory : () => ICommandHistory;

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
