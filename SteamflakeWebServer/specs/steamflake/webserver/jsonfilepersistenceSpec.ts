///<reference path='../../../../ThirdParty/lib/testing/jasmine.d.ts'/>

import jsonfilepersistence = require( '../../../source/steamflake/webserver/jsonfilepersistence' );
import structure = require( '../../../../SteamflakeModel/source/steamflake/model/structure' );
import uuids = require( '../../../../SteamflakeCore/source/steamflake/core/utilities/uuids' );

describe( "JSON File Persistence", function() {

    it( "Creates a root model element", function( done : ()=>void ) {

        var rootElement = structure.makeRootPackage( uuids.makeUuid() );

        var onError = function( msg : string ) {
            expect( msg ).toBeNull();
            done();
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

        var store = jsonfilepersistence.makeJsonFilePersistentStore( "/tmp/steamflake/a" );

        store.creator.createModelElement( rootElement )
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

        var onError = function( msg : string ) {
            expect( msg ).toBeNull();
            done();
        };

        var onNamespace2Created = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( namespace2 );
            done();
        };

        var onNamespace1Created = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( namespace1 );
            store.creator.createModelElement( namespace2 ).then( onNamespace2Created, onError );
        };

        var onRootCreated = function( modelElement : structure.IRootPackage ) {
            expect( modelElement ).toBe( rootElement );
            store.creator.createModelElement( namespace1 ).then( onNamespace1Created, onError );
        };

        store.creator.createModelElement( rootElement ).then( onRootCreated, onError );

        // TBD: Change to promise chain
        // TBD: delete after created

    } );

} );


