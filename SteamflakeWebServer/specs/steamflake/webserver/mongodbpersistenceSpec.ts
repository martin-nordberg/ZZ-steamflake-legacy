///<reference path='../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import mongodbpersistence = require( '../../../source/steamflake/webserver/mongodbpersistence' );

describe( "MongoDB Persistence", function() {

    it( "Initializes the schema", function( done : ()=>void ) {

        var store = mongodbpersistence.makeMongoDbPersistentStore();

        expect( store ).not.toBeNull();

        store.connect( true, true ).then( function( initialized ) {
            console.log( "INITIALIZED" );
            expect( initialized ).toBeTruthy();
            done();
        }, function( msg ) {
            console.log( "FAILED: ", msg );
        } );

    } );

} );


