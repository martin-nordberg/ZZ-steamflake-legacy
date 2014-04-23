///<reference path='../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import mongodbpersistence = require( '../../../source/steamflake/webserver/mongodbpersistence' );
import structure = require( '../../../../SteamflakeModel/source/steamflake/model/structure' );
import uuids = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/uuids' );

describe( "MongoDB Persistence", function() {

    it( "Initializes the schema", function( done : ()=>void ) {

        var onError = function( msg : string ) {
            console.log( "FAILED: ", msg );
            expect( msg ).toBeNull();
            done();
        };

        var onDisconnected = function( disconnected ) {
            expect( disconnected ).toBeTruthy();
            done();
        };

        var onConnected = function( connected ) {
            expect( connected ).toBeTruthy();
            store.disconnect().then( onDisconnected, onError );
        };

        var store = mongodbpersistence.makeMongoDbPersistentStore();

        store.connect( true, true ).then( onConnected, onError );

    } );

    it( "Creates and deletes a model element", function( done : ()=>void ) {

        var sampleElement = structure.makeRootPackage( uuids.makeUuid() );

        var onError = function( msg : string ) {
            console.log( "FAILED: ", msg );
            expect( msg ).toBeNull();
            done();
        };

        var onDisconnected = function( disconnected ) {
            expect( disconnected ).toBeTruthy();
            done();
        };

        var onDeleted = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( sampleElement );
            store.disconnect().then( onDisconnected, onError );
        }

        var onCreated = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( sampleElement );
            store.deleter.deleteModelElement( modelElement ).then( onDeleted, onError );
        }

        var onConnected = function( connected ) {
            expect( connected ).toBeTruthy();
            store.creator.createModelElement( sampleElement ).then( onCreated, onError );
        };

        var store = mongodbpersistence.makeMongoDbPersistentStore();

        store.connect( true, true ).then( onConnected, onError );

    } );

} );

