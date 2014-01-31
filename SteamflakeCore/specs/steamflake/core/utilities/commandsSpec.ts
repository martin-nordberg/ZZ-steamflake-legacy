/**
 * Spec Module: steamflake/utilities/commandsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import commands = require( '../../../../source/steamflake/core/utilities/commands' );
import commands_impl = require( '../../../../source/steamflake/core/utilities/commands_impl' );

describe( "Commands", function() {

    beforeEach( function() {
        commands_impl.initialize();
    } )

    describe( "Null Command History", function() {
        var commandHistory : commands.ICommandHistory;

        beforeEach( function() {
            commandHistory = commands.makeNullCommandHistory();
        } );

        it( "Constructs successfully", function() {
            expect( commandHistory ).not.toBeNull();
        } );

    } );

} );
