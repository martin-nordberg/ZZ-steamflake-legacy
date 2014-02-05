/**
 * Spec Module: steamflake/core/metamodel/persistenceSpec
 */

///<reference path='../../../thirdparty/jasmine/jasmine.d.ts'/>


import elements = require( '../../../../source/steamflake/core/metamodel/elements' );
import elements_impl = require( '../../../../source/steamflake/core/metamodel/elements_impl' );
import persistence = require( '../../../../source/steamflake/core/metamodel/persistence' );
import sampleElements = require( './sampleElements' );
import uuids = require( '../../../../source/steamflake/core/utilities/uuids' );


describe( "Persistence", function() {

    var modelElement : elements.IContainerElement;
    var store : persistence.IPersistentStore<sampleElements.RootContainer>;

    beforeEach( function() {
        modelElement = new sampleElements.Container( null, uuids.makeUuid(), "container", "Sample element" );
    } );

    describe( "Null Persistent Store", function() {

        beforeEach( function() {
            store = persistence.makeNullPersistentStore<sampleElements.RootContainer>();
        } );

        it( "Does nothing to create", function() {
            expect( function(){
                store.creator.createModelElement( modelElement );
            } ).not.toThrow();
        } );

        it( "Throws an error for reading a root element", function() {
            expect( function(){
                store.reader.loadRootModelElement();
            } ).toThrow();
        } );

        it( "Throws an error for reading element contents", function() {
            expect( function(){
                store.reader.loadModelElementContents( modelElement );
            } ).toThrow();
        } );


        it( "Does nothing to update", function() {
            expect( function(){
                store.updater.updateModelElement( modelElement, { changedAttributeNames: ['none'] } );
            } ).not.toThrow();
        } );

        it( "Does nothing to delete", function() {
            expect( function(){
                store.deleter.deleteModelElement( modelElement );
            } ).not.toThrow();
        } );

    } );

} );