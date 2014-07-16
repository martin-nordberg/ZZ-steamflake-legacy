///<reference path='../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import jsonfilepersistence = require( '../../../source/steamflake/webserver/jsonfilepersistence' );
import structure = require( '../../../../SteamflakeModel/source/steamflake/model/structure' );
import uuids = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/uuids' );

describe( "JSON File Persistence", function() {

    it( "Creates a root model element", function( done : ()=>void ) {

        var store = jsonfilepersistence.makeJsonFilePersistentStore( "/tmp/steamflake/a" );

        var rootElement = structure.makeRootPackage( uuids.makeUuid() );

        var create = function() {
            return store.creator.createModelElement( rootElement );
        };

        var load = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( rootElement );
            return store.reader.loadRootModelElement();
        };

        var remove = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toEqual( rootElement );
            return store.deleter.deleteModelElement( modelElement );
        };

        var finish = function( modelElement : structure.IRootPackage ) {
            expect( modelElement.uuid ).toEqual( rootElement.uuid );
            done();
        };

        var onError = function( msg : string ) {
            expect( msg ).toBeNull();
            done();
        };

        create()
            .then_p( load )
            .then_p( remove )
            .then( finish )
            .then( null, onError );

    } );

    it( "Creates namespaces", function( done : ()=>void ) {

        var store = jsonfilepersistence.makeJsonFilePersistentStore( "/tmp/steamflake/b" );

        var rootElement = structure.makeRootPackage( uuids.makeUuid() );
        var namespace1 = rootElement.makeNamespace( uuids.makeUuid(), { name: "testing" } );
        var namespace2 = namespace1.makeNamespace( uuids.makeUuid(), { name: "sample" } );

        var createRootElement = function() {
            return store.creator.createModelElement( rootElement );
        };

        var createNamespace1 = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( rootElement );
            return store.creator.createModelElement( namespace1 );
        };

        var createNamespace2 = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( namespace1 );
            return store.creator.createModelElement( namespace2 );
        };

        var deleteRootElement = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( namespace2 );
            return store.deleter.deleteModelElement( rootElement );
        };

        var finish = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( rootElement );
            done();
        };

        var onError = function( msg : string ) {
            expect( msg ).toBeNull();
            done();
        };

        createRootElement()
            .then_p( createNamespace1 )
            .then_p( createNamespace2 )
            .then_p( deleteRootElement )
            .then( finish )
            .then( null, onError );

    } );

} );


