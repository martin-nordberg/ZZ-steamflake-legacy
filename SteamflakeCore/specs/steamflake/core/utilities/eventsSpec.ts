/**
 * Spec Module: steamflake/utilities/eventsSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import events = require( '../../../../source/steamflake/core/utilities/events' );

describe( "Events", function() {

    describe( "Stateless Event", function() {
        var event : events.IStatelessEvent<string>,
            source : string;

        beforeEach( function() {
            source = "Event Source";
            event = events.makeStatelessEvent<string>( source );
        } );

        it( "Registers a listener and sends it events", function() {
            var listenCount = 0;

            event.registerListener( function( s : string ) {
                expect( s ).toBe( source )
                listenCount += 1;
            } );

            event.trigger();
            event.trigger();
            event.trigger();
            event.trigger();

            expect( listenCount ).toEqual( 4 );
        } );

        it( "Registers multiple listeners and sends them all events in correct order", function() {
            var listened = [false,false,false];

            event.registerListener( function( s : string ) {
                listened[0] = true;
            } );
            event.registerListener( function( s : string ) {
                expect( listened[0] ).toBeTruthy();
                listened[1] = true;
            } );
            event.registerListener( function( s : string ) {
                expect( listened[0] ).toBeTruthy();
                expect( listened[1] ).toBeTruthy();
                listened[2] = true;
            } );

            event.trigger();

            expect( listened[0] ).toBeTruthy();
            expect( listened[1] ).toBeTruthy();
            expect( listened[2] ).toBeTruthy();
        } );

        it( "Unregisters a listener and sends it no more events", function() {
            var listened = false;

            function listener( s : string ) {
                listened = true;
            }

            event.registerListener( listener );

            event.unregisterListener( listener );

            event.trigger();

            expect( listened ).toBeFalsy();
        } );

        it( "Unregisters a correct subset of listeners", function() {
            var listened = [false,false,false,false];

            function listener0( s : string ) {
                listened[0] = true;
            }
            function listener1( s : string ) {
                expect( listened[0] ).toBeFalsy();
                listened[1] = true;
            }
            function listener2( s : string ) {
                expect( listened[0] ).toBeFalsy();
                expect( listened[1] ).toBeTruthy();
                listened[2] = true;
            }
            function listener3( s : string ) {
                expect( listened[0] ).toBeFalsy();
                expect( listened[1] ).toBeTruthy();
                expect( listened[2] ).toBeFalsy();
                listened[3] = true;
            }

            event.registerListener( listener0 );
            event.registerListener( listener1 );
            event.registerListener( listener2 );
            event.registerListener( listener3 );

            event.unregisterListener( listener0 );
            event.unregisterListener( listener2 );

            event.trigger();

            expect( listened[0] ).toBeFalsy();
            expect( listened[1] ).toBeTruthy();
            expect( listened[2] ).toBeFalsy();
            expect( listened[3] ).toBeTruthy();
        } );

        it( "Temporarily disables event propagation", function() {
            var listenCount = 0;

            event.registerListener( function( s : string ) {
                expect( s ).toBe( source )
                listenCount += 1;
            } );

            event.whileDisabledDo( function() {
                expect( event.enabled ).toBeFalsy();
                event.trigger();
                event.trigger();
                event.trigger();
            } );
            event.trigger();

            expect( listenCount ).toEqual( 1 );
        } );

    } );

    describe( "Stateful Event", function() {
        var source : string,
            one : string,
            two : string,
            event : events.IStatefulEvent<string,{one:string;two:string}>;

        beforeEach( function() {
            source = "Event Source";
            one = "one";
            two = "two";
            event = events.makeStatefulEvent<string,{one:string;two:string}>( source );
        } );

        it( "Registers a parametric listener and sends it events with parameters", function() {
            var listened = false;

            event.registerListener( function( s : string, param : {one:string;two:string} ) {
                expect( s ).toBe( source )
                expect( param.one ).toBe( one );
                expect( param.two ).toBe( two );
                listened = true;
            } );

            event.trigger( {one:one,two:two} );

            expect( listened ).toBeTruthy();
        } );

        it( "Temporarily disables event propagation", function() {
            var listenCount = 0;

            event.registerListener( function( s : string, param : {one:string;two:string} ) {
                expect( s ).toBe( source )
                expect( param.one ).toBe( one );
                expect( param.two ).toBe( two );
                listenCount += 1;
            } );

            event.whileDisabledDo( function() {
                expect( event.enabled ).toBeFalsy();
                event.trigger( {one:one,two:two} );
                event.trigger( {one:one,two:two} );
                event.trigger( {one:one,two:two} );
            } );
            event.trigger( {one:one,two:two} );

            expect( listenCount ).toEqual( 1 );
        } );

    } );

} );
