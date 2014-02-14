/**
 * Spec Module: steamflake/utilities/commandsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import commands = require( '../../../../source/steamflake/core/concurrency/commands' );
import commands_impl = require( '../../../../source/steamflake/core/concurrency/commands_impl' );
import promises = require( '../../../../source/steamflake/core/concurrency/promises' );
import timing = require( '../../../../source/steamflake/core/concurrency/timing' );
import values = require( '../../../../source/steamflake/core/utilities/values' );

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class SampleCommand
    extends commands_impl.AbstractCommand<string> {

    constructor() {
        super( "Sample", "Sample" );

        this._executionCount = 0;
        this._unexecutionCount = 0;
    }

    public get executionCount() {
        return this._executionCount;
    }
    public/*protected*/ set executionCount( value : number ) {
        this._executionCount = value;
    }

    public get unexecutionCount() {
        return this._unexecutionCount;
    }
    public/*protected*/ set unexecutionCount( value : number ) {
        this._unexecutionCount = value;
    }

  ////

    private _executionCount : number;

    private _unexecutionCount : number;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ImmediateCommand
    extends SampleCommand {

    public/*protected*/ execute() : promises.IPromise<string> {
        this.executionCount += 1;
        return promises.makeImmediatelyFulfilledPromise( "executed" );
    }

    public/*protected*/ unexecute() : promises.IPromise<values.ENothing> {
        this.unexecutionCount += 1;
        return promises.makeImmediatelyFulfilledPromise( values.nothing );
    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class DeferredCommand
    extends SampleCommand {

    public/*protected*/ execute() : promises.IPromise<string> {

        var self = this;
        var result = promises.makePromise<string>();

        function doIt() {
            self.executionCount += 1;
            result.fulfill( "executed" );
        }

        timing.doWhenIdle( doIt );

        return result;

    }

    public/*protected*/ unexecute() : promises.IPromise<values.ENothing> {

        var self = this;
        var result = promises.makePromise<values.ENothing>();

        function undoIt() {
            self.unexecutionCount += 1;
            result.fulfill( values.nothing );
        }

        timing.doWhenIdle( undoIt );

        return result;

    }

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class ExecutionCheckingCommand
    extends commands_impl.AbstractCommand<values.ENothing> {

    constructor( commandHistory : commands.ICommandHistory ) {
        super( "ExecutionChecking", "ExecutionChecking" );
        this._commandHistory = commandHistory;
    }

    public/*protected*/ execute() : promises.IPromise<values.ENothing> {

        var self = this;
        var result = promises.makePromise<values.ENothing>();

        function doIt() {
            expect( self._commandHistory.isExecutingCommand ).toBeTruthy();
            result.fulfill( values.nothing );
        }

        timing.doWhenIdle( doIt );

        return result;

    }

    public/*protected*/ unexecute() : promises.IPromise<values.ENothing> {

        var self = this;
        var result = promises.makePromise<values.ENothing>();

        function undoIt() {
            expect( self._commandHistory.isExecutingCommand ).toBeTruthy();
            result.fulfill( values.nothing );
        }

        timing.doWhenIdle( undoIt );

        return result;

    }

    private _commandHistory : commands.ICommandHistory;

}

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// TBD: ErrorCommand

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

describe( "Commands", function() {

    var cmds : SampleCommand[];
    var commandHistory : commands.ICommandHistory;
    var xcmd : ExecutionCheckingCommand;

    beforeEach( function() {
        cmds = [];
        cmds[0] = new ImmediateCommand();
        cmds[1] = new DeferredCommand();
        cmds[2] = new ImmediateCommand();
        cmds[3] = new DeferredCommand();
    } );

    function executeOneImmediateCommand( done ) {
        function checkOutcome( value : string ) {
            expect( value ).toEqual( "executed" );
            expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToUndo );
            expect( cmds[0].executionCount ).toEqual( 1 );
            expect( cmds[0].unexecutionCount ).toEqual( 0 );
            done();
        }
        commandHistory.queue( cmds[0] ).then( checkOutcome );
    }

    function executeOneDeferredCommand( done ) {
        function checkOutcome( value : string ) {
            expect( value ).toEqual( "executed" )
            expect( cmds[1].state ).toEqual( commands.ECommandState.ReadyToUndo );
            expect( cmds[1].executionCount ).toEqual( 1 );
            expect( cmds[1].unexecutionCount ).toEqual( 0 );
            done();
        }
        commandHistory.queue( cmds[1] ).then( checkOutcome );
    }

    function executeCommandSequence( done ) {
        function checkOutcome( sequence : number ) {
            return function( value : string ) {
                expect( value ).toEqual( "executed" )
                for ( var i=0 ; i<sequence ; i+=1 ) {
                    expect( cmds[i].state ).toEqual( commands.ECommandState.ReadyToUndo );
                    expect( cmds[i].executionCount ).toEqual( 1 );
                    expect( cmds[i].unexecutionCount ).toEqual( 0 );
                }
            }
        }
        commandHistory.queue( cmds[0] ).then( checkOutcome(1) );
        commandHistory.queue( cmds[1] ).then( checkOutcome(2) );
        commandHistory.queue( cmds[2] ).then( checkOutcome(3) );
        commandHistory.queue( cmds[3] ).then( checkOutcome(4) ).then( done );
    }

    function checkEmptyHistory() {
        expect( commandHistory.canRedo ).toBeFalsy();
        expect( commandHistory.canUndo ).toBeFalsy();
    }

    function executeWithExecutionChecking( done ) {
        function checkOutcome( value : values.ENothing ) {
            expect( commandHistory.isExecutingCommand ).toBeFalsy();
            done();
        }
        expect( commandHistory.isExecutingCommand ).toBeFalsy();
        commandHistory.queue( xcmd ).then( checkOutcome );
        expect( commandHistory.isExecutingCommand ).toBeFalsy();
    }

    describe( "Null Command History", function() {

        beforeEach( function() {
            commandHistory = commands.makeNullCommandHistory();
            xcmd = new ExecutionCheckingCommand( commandHistory );
        } );

        it( "Cannot redo or undo when empty", checkEmptyHistory );

        it( "Executes one immediate command successfully", executeOneImmediateCommand );

        it( "Executes one deferred command successfully", executeOneDeferredCommand );

        it( "Executes a sequence of commands successfully", executeCommandSequence );

        it( "Tracks execution state correctly", executeWithExecutionChecking );

        it( "Cannot undo", function( done ) {
            function checkOutcome( value : string ) {
                expect( commandHistory.canUndo ).toBeFalsy();
                done();
            }
            commandHistory.queue( cmds[0] ).then( checkOutcome );
        } );

    } );

    describe( "Command History", function() {

        beforeEach( function() {
            commandHistory = commands.makeCommandHistory( 10 );
            xcmd = new ExecutionCheckingCommand( commandHistory );
        } );

        it( "Cannot redo or undo when empty", checkEmptyHistory );

        it( "Executes one immediate command successfully", executeOneImmediateCommand );

        it( "Executes one deferred command successfully", executeOneDeferredCommand );

        it( "Executes a sequence of commands successfully", executeCommandSequence );

        it( "Tracks execution state correctly", executeWithExecutionChecking );

        it( "Can undo a done command", function( done ) {
            function checkOutcome( value : string ) {
                expect( commandHistory.canUndo ).toBeTruthy();
                done();
            }
            commandHistory.queue( cmds[0] ).then( checkOutcome );
        } );

        it( "Undoes a command", function( done ) {
            function checkOutcome( value : values.ENothing ) {
                expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToRedo );
                expect( commandHistory.canUndo ).toBeFalsy();
                expect( commandHistory.canRedo ).toBeTruthy();
                done();
            }
            function undo( value : string ) {
                expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToUndo );
                commandHistory.undo().then( checkOutcome );
            }
            commandHistory.queue( cmds[0] ).then( undo );
        } );

        it( "Undoes and redoes commands", function( done ) {
            function checkOutcome( value : values.ENothing ) {
                expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[1].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[2].state ).toEqual( commands.ECommandState.ReadyToRedo );
                expect( commandHistory.canUndo ).toBeTruthy();
                expect( commandHistory.canRedo ).toBeTruthy();
                done();
            }
            function redo1( value : values.ENothing ) {
                expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[1].state ).toEqual( commands.ECommandState.ReadyToRedo );
                expect( cmds[2].state ).toEqual( commands.ECommandState.ReadyToRedo );
                expect( commandHistory.canUndo ).toBeTruthy();
                expect( commandHistory.canRedo ).toBeTruthy();
                commandHistory.redo().then( checkOutcome );
            }
            function undo1( value : values.ENothing ) {
                expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[1].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[2].state ).toEqual( commands.ECommandState.ReadyToRedo );
                expect( commandHistory.canUndo ).toBeTruthy();
                expect( commandHistory.canRedo ).toBeTruthy();
                commandHistory.undo().then( redo1 );
            }
            function undo2( value : string ) {
                expect( cmds[0].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[1].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( cmds[2].state ).toEqual( commands.ECommandState.ReadyToUndo );
                expect( commandHistory.canUndo ).toBeTruthy();
                expect( commandHistory.canRedo ).toBeFalsy();
                commandHistory.undo().then( undo1 );
            }
            commandHistory.queue( cmds[0] );
            commandHistory.queue( cmds[1] );
            commandHistory.queue( cmds[2] ).then( undo2 );
        } );

    } );

} );
