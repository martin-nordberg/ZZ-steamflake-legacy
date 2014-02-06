/**
 * Spec Module: steamflake/core/concurrency/promisesSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import promises = require( '../../../../source/steamflake/core/concurrency/promises' );


describe( "Promises", function() {

    describe( "Immediately Fulfilled Promise", function()  {
        var promise : promises.IPromise<string>;

        beforeEach( function() {
            promise = promises.makeImmediatelyFulfilledPromise( "done" );
        } );

        it( "Calls onFulfilled", function( done : ()=>void ) {
            function f( value : string ) {
                expect( value ).toEqual( "done" );
                done();
            }
            promise.then( f );
        } );

        it( "Supports multiple then calls in correct order", function( done : ()=>void ) {
            var count = 0;
            function f1( value : string ) {
                expect( count ).toEqual( 0 );
                count = 1;
                expect( value ).toEqual( "done" );
            }
            function f2( value : string ) {
                expect( count ).toEqual( 1 );
                expect( value ).toEqual( "done" );
                done();
            }
            promise.then( f1 );
            promise.then( f2 );
        } );

        it( "Supports chained calls", function( done : ()=>void ) {
            function f1( value : string ) {
                expect( value ).toEqual( "done" );
                return "chained";
            }
            function f2( value : string ) {
                expect( value ).toEqual( "chained" );
                done();
            }
            promise.then( f1 ).then( f2 );
        } );

    } );

    describe( "Immediately Rejected Promise", function()  {
        var promise : promises.IPromise<string>;

        beforeEach( function() {
            promise = promises.makeImmediatelyRejectedPromise( "bad" );
        } );

        it( "Calls onRejected", function( done : ()=>void ) {
            function f( value : string ) {
            }
            function r( reason : string ) {
                expect( reason ).toEqual( "bad" )
                done();
            }
            promise.then( f, r );
        } );

        it( "Supports multiple then calls in correct order", function( done : ()=>void ) {
            var count = 0;
            function f( value : string ) {
            }
            function r1( reason : string ) {
                expect( count ).toEqual( 0 );
                count = 1;
                expect( reason ).toEqual( "bad" );
            }
            function r2( value : string ) {
                expect( count ).toEqual( 1 );
                expect( value ).toEqual( "bad" );
                done();
            }
            promise.then( f, r1 );
            promise.then( f, r2 );
        } );

        it( "Supports chained calls", function( done : ()=>void ) {
            function f( value : string ) {
                return "more";
            }
            function r1( value : string ) {
                expect( value ).toEqual( "bad" );
                return "very bad";
            }
            function r2( value : string ) {
                expect( value ).toEqual( "very bad" );
                done();
            }
            promise.then( f, r1 ).then( f, r2 );
        } );

    } );

    describe( "Later Fulfilled Promise", function()  {
        var promise : promises.IPromiseResult<string>;

        beforeEach( function() {
            promise = promises.makePromise<string>();
        } );

        it( "Calls onFulfilled", function( done : ()=>void ) {
            function f( value : string ) {
                expect( value ).toEqual( "done" );
                done();
            }
            promise.then( f );
            promise.fulfill( "done" );
        } );

        it( "Supports multiple then calls in correct order", function( done : ()=>void ) {
            var count = 0;
            function f1( value : string ) {
                expect( count ).toEqual( 0 );
                count = 1;
                expect( value ).toEqual( "done" );
            }
            function f2( value : string ) {
                expect( count ).toEqual( 1 );
                expect( value ).toEqual( "done" );
                done();
            }
            promise.then( f1 );
            promise.then( f2 );
            promise.fulfill( "done" );
        } );

        it( "Supports chained calls", function( done : ()=>void ) {
            function f1( value : string ) {
                expect( value ).toEqual( "done" );
                return "chained";
            }
            function f2( value : string ) {
                expect( value ).toEqual( "chained" );
                done();
            }
            promise.then( f1 ).then( f2 );
            promise.fulfill( "done" );
        } );

    } );

    describe( "Later Rejected Promise", function()  {
        var promise : promises.IPromiseResult<string>;

        beforeEach( function() {
            promise = promises.makePromise<string>();
        } );

        it( "Calls onRejected", function( done : ()=>void ) {
            function f( value : string ) {
            }
            function r( reason : string ) {
                expect( reason ).toEqual( "bad" )
                done();
            }
            promise.then( f, r );
            promise.reject( "bad" );
        } );

        it( "Supports multiple then calls in correct order", function( done : ()=>void ) {
            var count = 0;
            function f( value : string ) {
            }
            function r1( reason : string ) {
                expect( count ).toEqual( 0 );
                count = 1;
                expect( reason ).toEqual( "bad" );
            }
            function r2( value : string ) {
                expect( count ).toEqual( 1 );
                expect( value ).toEqual( "bad" );
                done();
            }
            promise.then( f, r1 );
            promise.then( f, r2 );
            promise.reject( "bad" );
        } );

        it( "Supports chained calls", function( done : ()=>void ) {
            function f( value : string ) {
                return "more";
            }
            function r1( value : string ) {
                expect( value ).toEqual( "bad" );
                return "very bad";
            }
            function r2( value : string ) {
                expect( value ).toEqual( "very bad" );
                done();
            }
            promise.then( f, r1 ).then( f, r2 );
            promise.reject( "bad" );
        } );

    } );

    describe( "Asynchronously Fulfilled Promise", function()  {
        var promise : promises.IPromiseResult<string>;

        beforeEach( function() {
            promise = promises.makePromise<string>();
        } );

        it( "Calls onFulfilled", function( done : ()=>void ) {
            function f( value : string ) {
                expect( value ).toEqual( "done" );
                done();
            }
            promise.then( f );
            setTimeout( function(){ promise.fulfill( "done" ); }, 1 );
        } );

        it( "Supports multiple then calls in correct order", function( done : ()=>void ) {
            var count = 0;
            function f1( value : string ) {
                expect( count ).toEqual( 0 );
                count = 1;
                expect( value ).toEqual( "done" );
            }
            function f2( value : string ) {
                expect( count ).toEqual( 1 );
                expect( value ).toEqual( "done" );
                done();
            }
            promise.then( f1 );
            promise.then( f2 );
            setTimeout( function(){ promise.fulfill( "done" ); }, 1 );
        } );

        it( "Supports chained calls", function( done : ()=>void ) {
            function f1( value : string ) {
                expect( value ).toEqual( "done" );
                return "chained";
            }
            function f2( value : string ) {
                expect( value ).toEqual( "chained" );
                done();
            }
            promise.then( f1 ).then( f2 );
            setTimeout( function(){ promise.fulfill( "done" ); }, 1 );
        } );

        it( "Handles callback exceptions", function( done : ()=>void ) {
            function f1( value : string ) : string {
                expect( value ).toEqual( "done" );
                throw new Error( "failed" );
                return "never";
            }
            function f2( value : string ) {
            }
            function r2( value : any ) {
                expect( value ).toEqual( new Error( "failed" ) );
                done();
            }
            promise.then( f1 ).then( f2, r2 );
            setTimeout( function(){ promise.fulfill( "done" ); }, 1 );
        } );

    } );

    describe( "Asynchronously Rejected Promise", function()  {
        var promise : promises.IPromiseResult<string>;

        beforeEach( function() {
            promise = promises.makePromise<string>();
        } );

        it( "Calls onRejected", function( done : ()=>void ) {
            function f( value : string ) {
            }
            function r( reason : string ) {
                expect( reason ).toEqual( "bad" )
                done();
            }
            promise.then( f, r );
            setTimeout( function(){ promise.reject( "bad" ); }, 1 );
        } );

        it( "Supports multiple then calls in correct order", function( done : ()=>void ) {
            var count = 0;
            function f( value : string ) {
            }
            function r1( reason : string ) {
                expect( count ).toEqual( 0 );
                count = 1;
                expect( reason ).toEqual( "bad" );
            }
            function r2( value : string ) {
                expect( count ).toEqual( 1 );
                expect( value ).toEqual( "bad" );
                done();
            }
            promise.then( f, r1 );
            promise.then( f, r2 );
            setTimeout( function(){ promise.reject( "bad" ); }, 1 );
        } );

        it( "Supports chained calls", function( done : ()=>void ) {
            function f( value : string ) {
                return "more";
            }
            function r1( value : string ) {
                expect( value ).toEqual( "bad" );
                return "very bad";
            }
            function r2( value : string ) {
                expect( value ).toEqual( "very bad" );
                done();
            }
            promise.then( f, r1 ).then( f, r2 );
            setTimeout( function(){ promise.reject( "bad" ); }, 1 );
        } );

        it( "Handles callback exceptions", function( done : ()=>void ) {
            function f( value : string ) {
                return "more";
            }
            function r1( value : string ) {
                expect( value ).toEqual( "bad" );
                throw new Error( "failed" );
            }
            function r2( value : any ) {
                expect( value ).toEqual( new Error( "failed" ) );
                done();
            }
            promise.then( f, r1 ).then( f, r2 );
            setTimeout( function(){ promise.reject( "bad" ); }, 1 );
        } );

    } );

} );
